type AuroraDateItem = {
  title: string;
  value: string;
  active: boolean;
};

type AuroraShowtime = {
  movieId: number;
  startTimeTransformed: string;
  startTime: string;
  notes: string[];
  showId: string;
  screenName: string;
  popularity: number;
  customLists: string[];
  ticketsAvailable: null;
};

export type Screening = {
  showId: string;
  movieId: number;
  movieTitle: string;
  date: string;
  time: string;
  startTime: string;
  screenName: string;
  notes: string[];
  customLists: string[];
  popularity: number;
};

const AURORA_BASE = "https://fokus.aurorakino.no";

function deSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function extractMoviesFromHomepage(html: string): Map<number, string> {
  const movies = new Map<number, string>();
  const pattern = /href="\/f\/([^/"]+)\/(\d+)"/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const slug = match[1];
    const id = parseInt(match[2], 10);
    if (!movies.has(id)) {
      movies.set(id, deSlug(slug));
    }
  }
  return movies;
}

function isUpcomingDate(value: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const limitDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return value >= today && value <= limitDate;
}

async function auroraPost<T>(
  methodName: string,
  methodData: (string | number)[],
): Promise<T[]> {
  try {
    const res = await fetch(
      `${AURORA_BASE}/api/ExecuteApiMethod?blockName=QuickBuyWidget&methodName=${methodName}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockData: {}, methodData }),
        next: { revalidate: 300 },
      },
    );
    if (!res.ok) return [];
    const data: unknown = await res.json();
    return Array.isArray(data) ? (data as T[]) : [];
  } catch {
    return [];
  }
}

export async function getUpcomingScreenings(): Promise<Screening[]> {
  const homepageRes = await fetch(AURORA_BASE, {
    next: { revalidate: 300 },
  }).catch(() => null);

  if (!homepageRes?.ok) return [];

  const html = await homepageRes.text();
  const movies = extractMoviesFromHomepage(html);

  if (movies.size === 0) return [];

  const seenShowIds = new Set<string>();
  const results: Screening[] = [];

  const movieEntries = Array.from(movies.entries());

  const perMovie = await Promise.allSettled(
    movieEntries.map(async ([movieId, movieTitle]) => {
      const dates = await auroraPost<AuroraDateItem>("getDates", [
        String(movieId),
      ]);
      const upcoming = dates.filter((d) => isUpcomingDate(d.value));

      const perDate = await Promise.allSettled(
        upcoming.map((d) =>
          auroraPost<AuroraShowtime>("getShowtimes", [String(movieId), d.value]),
        ),
      );

      const showtimes: Screening[] = [];
      for (const settled of perDate) {
        if (settled.status !== "fulfilled") continue;
        for (const raw of settled.value) {
          if (seenShowIds.has(raw.showId)) continue;
          seenShowIds.add(raw.showId);
          showtimes.push({
            showId: raw.showId,
            movieId,
            movieTitle,
            date: raw.startTime.slice(0, 10),
            time: raw.startTimeTransformed,
            startTime: raw.startTime,
            screenName: raw.screenName ?? "",
            notes: Array.isArray(raw.notes) ? raw.notes : [],
            customLists: Array.isArray(raw.customLists) ? raw.customLists : [],
            popularity: raw.popularity ?? 100,
          });
        }
      }
      return showtimes;
    }),
  );

  for (const settled of perMovie) {
    if (settled.status !== "fulfilled") continue;
    results.push(...settled.value);
  }

  results.sort((a, b) => a.popularity - b.popularity);
  return results;
}
