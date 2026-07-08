import SubdomainLink from "../components/SubdomainLink";

export default function PlexPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black font-mono">
      {/* Header */}
      <header className="border-b-2 border-dashed border-cyan-500">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="text-2xl text-cyan-500 hover:text-yellow-400 transition-colors"
            >
              [←]
            </a>
            <h1 className="text-lg font-bold text-cyan-500 tracking-wider">PLEX</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-2 border-dotted border-magenta-500 p-4 bg-black">
            <h2 className="text-2xl font-bold text-magenta-500 mb-2">
              &gt;&gt; PLEX.MEDIA.SERVER
            </h2>
            <p className="text-green-400">
              :: CHOOSE_A_REQUEST_PORTAL ::
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <SubdomainLink
              subdomain="aniseerr"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-cyan-400">[A]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; ANISEERR</h3>
              <p className="text-sm text-green-400 mb-3">
                :: ANIME_REQUEST_PORTAL ::
              </p>
              <span className="inline-block border border-dotted border-yellow-400 px-2 py-1 text-xs text-yellow-400">
                STATUS: IN_DEVELOPMENT
              </span>
              <div className="mt-4 text-magenta-400">
                &gt;&gt;&gt;
              </div>
            </SubdomainLink>

            <SubdomainLink
              subdomain="tvseerr"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-cyan-400">[T]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; TVSEERR</h3>
              <p className="text-sm text-green-400 mb-3">
                :: TV_&_MOVIE_REQUEST_PORTAL ::
              </p>
              <span className="inline-block border border-dotted border-yellow-400 px-2 py-1 text-xs text-yellow-400">
                STATUS: IN_DEVELOPMENT
              </span>
              <div className="mt-4 text-magenta-400">
                &gt;&gt;&gt;
              </div>
            </SubdomainLink>
          </div>

          <p className="mt-8 text-xs text-yellow-400">
            :: BOTH_PORTALS_ARE_CURRENTLY_IN_DEVELOPMENT_-_EXPECT_CHANGES ::
          </p>
        </div>
      </div>
    </main>
  );
}
