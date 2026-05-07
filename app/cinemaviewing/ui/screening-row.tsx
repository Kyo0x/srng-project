import type { Screening } from "@/lib/cinemaviewing";
import { PopularityBar } from "./popularity-bar";

type ScreeningRowProps = {
  screening: Screening;
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "Europe/Oslo",
});

export function ScreeningRow({ screening }: ScreeningRowProps) {
  const formattedDate = dateFormatter.format(new Date(screening.startTime));

  return (
    <li className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-slate-900 px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-100">
          {screening.movieTitle}
        </p>
        <p className="mt-0.5 text-xs text-slate-400">
          {formattedDate}, {screening.time} &middot; {screening.screenName}
        </p>
        {screening.notes.length > 0 && (
          <p className="mt-0.5 text-xs text-slate-500">
            {screening.notes.join(" · ")}
          </p>
        )}
        {screening.customLists.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {screening.customLists.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0">
        <PopularityBar popularity={screening.popularity} />
      </div>
    </li>
  );
}
