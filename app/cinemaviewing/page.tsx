import type { Metadata } from "next";

import { getUpcomingScreenings } from "@/lib/cinemaviewing";
import { ScreeningRow } from "./ui/screening-row";

export const metadata: Metadata = {
  title: "Quiet Screenings — srng",
};

export default async function CinemaViewingPage() {
  const screenings = await getUpcomingScreenings();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100 md:py-12">
      <section className="mx-auto w-full max-w-3xl">
        <header className="mb-8 rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
          <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
            Cinema
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Quiet Screenings
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Aurora Kino · next 7 days · sorted by fill rate
          </p>
        </header>

        {screenings.length === 0 ? (
          <p className="text-sm text-slate-400">
            No upcoming screenings found right now.
          </p>
        ) : (
          <ul className="space-y-3">
            {screenings.map((screening) => (
              <ScreeningRow key={screening.showId} screening={screening} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
