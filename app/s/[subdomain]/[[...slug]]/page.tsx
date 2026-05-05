type SubdomainSlugPageProps = {
  params: Promise<{ subdomain: string; slug?: string[] }>;
};

export default async function SubdomainSlugPage({
  params,
}: SubdomainSlugPageProps) {
  const { subdomain, slug } = await params;
  const path = slug?.length ? `/${slug.join("/")}` : "/";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <section className="w-full max-w-3xl rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl md:p-12">
        <p className="text-xs font-medium tracking-[0.2em] text-slate-400 uppercase">
          Subdomain route
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">
          {subdomain}.srng.no{path}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
          This catch-all route handles nested paths for each subdomain while you
          set up real pages.
        </p>
      </section>
    </main>
  );
}
