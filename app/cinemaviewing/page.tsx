import type { Metadata } from "next";

import { getMoviesWithScreenings } from "@/lib/cinemaviewing";
import { MovieCard } from "./ui/movie-card";

export const metadata: Metadata = {
  title: "Tomme kinosaler — Aurora Kino Fokus",
};

export default async function CinemaViewingPage() {
  const movies = await getMoviesWithScreenings();

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-8 text-slate-100 md:py-12">
      <section className="mx-auto w-full max-w-5xl">
        <header className="mb-8">
          <p className="text-xs font-medium tracking-[0.2em] text-slate-500 uppercase">
            Aurora Kino Fokus
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Tomme kinosaler
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Forestillinger de neste 7 dagene, sortert etter fyllingsgrad.
          </p>
        </header>

        {movies.length === 0 ? (
          <p className="text-sm text-slate-500">
            Ingen kommende forestillinger funnet.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.movieId} movie={movie} />
            ))}
          </div>
        )}

        <p className="mt-8 text-xs text-slate-600">
          % = andel solgte billetter ifølge Aurora Kino · oppdateres hvert 5. minutt
        </p>
      </section>
    </main>
  );
}
