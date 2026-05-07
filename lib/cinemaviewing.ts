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
  date: string;
  time: string;
  startTime: string;
  screenName: string;
  notes: string[];
  customLists: string[];
  popularity: number;
};

export type Movie = {
  movieId: number;
  title: string;
  posterUrl: string | null;
  screenings: Screening[];
  minPopularity: number;
};

const AURORA_BASE = "https://fokus.aurorakino.no";

function deSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

type MovieMeta = { title: string; posterUrl: string | null };

function extractMoviesFromHomepage(html: string): Map<number, MovieMeta> {
  const movies = new Map<number, MovieMeta>();
  // Captures: slug (1), localId (2), posterUrl (3) — poster is first <img> inside <a>
  const pattern =
    /<a[^>]+href="\/f\/([^/"]+)\/(\d+)"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"[^>]*>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(html)) !== null) {
    const slug = match[1];
    const id = parseInt(match[2], 10);
    const imgSrc = match[3];
    if (movies.has(id)) continue;
    // Skip play-button overlay — it should never be first but guard anyway
    if (imgSrc.includes("play-button")) continue;
    movies.set(id, { title: deSlug(slug), posterUrl: imgSrc });
  }
  return movies;
}

function isUpcomingDate(value: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  const limit = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  return value >= today && value <= limit;
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

export async function getMoviesWithScreenings(): Promise<Movie[]> {
  const homepageRes = await fetch(AURORA_BASE, {
    next: { revalidate: 300 },
  }).catch(() => null);

  if (!homepageRes?.ok) return [];

  const html = await homepageRes.text();
  const movieMeta = extractMoviesFromHomepage(html);
  if (movieMeta.size === 0) return [];

  const seenShowIds = new Set<string>();

  const settled = await Promise.allSettled(
    Array.from(movieMeta.entries()).map(async ([movieId, meta]) => {
      const dates = await auroraPost<AuroraDateItem>("getDates", [
        String(movieId),
      ]);
      const upcoming = dates.filter((d) => isUpcomingDate(d.value));

      const dateResults = await Promise.allSettled(
        upcoming.map((d) =>
          auroraPost<AuroraShowtime>("getShowtimes", [
            String(movieId),
            d.value,
          ]),
        ),
      );

      const screenings: Screening[] = [];
      for (const r of dateResults) {
        if (r.status !== "fulfilled") continue;
        for (const raw of r.value) {
          if (seenShowIds.has(raw.showId)) continue;
          seenShowIds.add(raw.showId);
          screenings.push({
            showId: raw.showId,
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

      // Sort screenings by date/time, not popularity — let the page sort movies
      screenings.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      );

      const minPopularity =
        screenings.length > 0
          ? Math.min(...screenings.map((s) => s.popularity))
          : 100;

      return {
        movieId,
        title: meta.title,
        posterUrl: meta.posterUrl,
        screenings,
        minPopularity,
      } satisfies Movie;
    }),
  );

  const movies: Movie[] = [];
  for (const r of settled) {
    if (r.status !== "fulfilled" || r.value.screenings.length === 0) continue;
    movies.push(r.value);
  }

  // Sort movies so the ones with emptiest screenings appear first
  movies.sort((a, b) => a.minPopularity - b.minPopularity);
  return movies;
}
