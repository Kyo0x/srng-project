import SubdomainLink from "./components/SubdomainLink";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-black font-mono">
      {/* Header */}
      <header className="border-b-2 border-dashed border-cyan-500">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl text-cyan-500">[S]</span>
            <h1 className="text-lg font-bold text-cyan-500 tracking-wider">SRNG.DASHBOARD</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-2 border-dotted border-magenta-500 p-4 bg-black">
            <h2 className="text-2xl font-bold text-magenta-500 mb-2">
              &gt;&gt; WELCOME.BACK
            </h2>
            <p className="text-green-400">
              :: SELECT_A_SECTION_TO_GET_STARTED ::
            </p>
          </div>

          {/* Tiles Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SubdomainLink 
              subdomain="projects"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-yellow-400">[*]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; PROJECTS</h3>
              <p className="text-sm text-green-400">
                :: VIEW_ALL_DEMO_PROJECTS ::
              </p>
              <div className="mt-4 text-magenta-400">
                &gt;&gt;&gt;
              </div>
            </SubdomainLink>

            <a
              href="https://github.com/Kyo0x/srng-project"
              target="_blank"
              rel="noopener noreferrer"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-yellow-400">[&gt;]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; GITHUB</h3>
              <p className="text-sm text-green-400">
                :: VIEW_SOURCE_CODE_ON_GITHUB ::
              </p>
              <div className="mt-4 text-magenta-400">
                &gt;&gt;&gt;
              </div>
            </a>

            <a
              href="/plex"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-yellow-400">[P]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; PLEX</h3>
              <p className="text-sm text-green-400">
                :: MEDIA_REQUEST_PORTALS ::
              </p>
              <div className="mt-4 text-magenta-400">
                &gt;&gt;&gt;
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
