import Image from "next/image";
import type { Movie, Screening } from "@/lib/cinemaviewing";

type MovieCardProps = {
  movie: Movie;
};

const dayFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Europe/Oslo",
});

function fillColor(popularity: number): string {
  if (popularity < 20) return "text-emerald-400";
  if (popularity < 50) return "text-amber-400";
  return "text-slate-400";
}

function groupByDate(screenings: Screening[]): Map<string, Screening[]> {
  const groups = new Map<string, Screening[]>();
  for (const s of screenings) {
    const existing = groups.get(s.date) ?? [];
    existing.push(s);
    groups.set(s.date, existing);
  }
  return groups;
}

export function MovieCard({ movie }: MovieCardProps) {
  const byDate = groupByDate(movie.screenings);

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900">
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full bg-slate-800">
        {movie.posterUrl ? (
          <Image
            src={movie.posterUrl}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-2xl font-bold text-slate-600">
              {movie.title.charAt(0)}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm font-semibold leading-snug text-slate-100">
          {movie.title}
        </p>

        <div className="flex flex-col gap-2">
          {Array.from(byDate.entries()).map(([date, screenings]) => (
            <div key={date}>
              <p className="mb-1.5 text-xs text-slate-500">
                {dayFormatter.format(new Date(date + "T12:00:00"))}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {screenings.map((s) => (
                  <div
                    key={s.showId}
                    className="flex flex-col items-center rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5"
                  >
                    <span className="text-xs font-medium text-slate-200">
                      {s.time}
                    </span>
                    <span className={`text-xs font-semibold ${fillColor(s.popularity)}`}>
                      {s.popularity}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
