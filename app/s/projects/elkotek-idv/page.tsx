export default function ElkotekIdvProjectPage() {
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
            <h1 className="text-lg font-bold text-cyan-500 tracking-wider">ELKOTEK.IDV</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-2 border-dotted border-magenta-500 p-4 bg-black">
            <h2 className="text-2xl font-bold text-magenta-500 mb-2">
              &gt;&gt; AUTOMATED.JOB.DISPATCH.PLATFORM
            </h2>
            <p className="text-green-400">
              :: CONNECTS_CUSTOMERS_WITH_THE_BEST-FIT_SERVICE_PROVIDER ::
            </p>
          </div>

          {/* Project Info */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Features */}
            <div className="border-4 border-double border-cyan-500 p-6 bg-black">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; FEATURES</h3>
              <ul className="space-y-2 text-sm text-green-400">
                <li>:: AUTOMATIC_JOB_DELIVERY_TO_BEST-FIT_PROVIDER</li>
                <li>:: LOCATION-BASED_PROVIDER_MATCHING</li>
                <li>:: CONNECTS_CUSTOMERS_&_SERVICE_PROVIDERS</li>
                <li>:: NATIVE_MOBILE_APP_FOR_PROVIDERS</li>
                <li>:: REAL-TIME_JOB_TRACKING_&_DISPATCH</li>
                <li>:: MICROSERVICES-BASED_BACKEND</li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="border-4 border-double border-cyan-500 p-6 bg-black">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; TECH.STACK</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-magenta-400">FRONTEND:</span>
                  <span className="text-green-400"> REACT</span>
                </div>
                <div>
                  <span className="text-magenta-400">MOBILE:</span>
                  <span className="text-green-400"> CAPACITOR.JS</span>
                </div>
                <div>
                  <span className="text-magenta-400">ARCHITECTURE:</span>
                  <span className="text-green-400"> MICROSERVICES</span>
                </div>
                <div>
                  <span className="text-magenta-400">CONTAINERIZATION:</span>
                  <span className="text-green-400"> DOCKER</span>
                </div>
                <div>
                  <span className="text-magenta-400">DATABASE:</span>
                  <span className="text-green-400"> MONGODB_+_POSTGRESQL</span>
                </div>
                <div>
                  <span className="text-magenta-400">HOSTING:</span>
                  <span className="text-green-400"> GOOGLE_CLOUD_PLATFORM_(GCP)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Project Notes */}
          <div className="border-4 border-double border-magenta-500 p-6 bg-black">
            <h3 className="text-xl font-bold text-magenta-400 mb-4">&gt; PROJECT.NOTES</h3>
            <div className="space-y-2 text-sm text-green-400">
              <p>:: PRODUCTION_PLATFORM_USED_BY_ELKOTEK_IDV</p>
              <p>:: AUTOMATICALLY_ROUTES_JOBS_TO_THE_BEST_AVAILABLE_PROVIDER_BY_LOCATION</p>
              <p>:: SHARED_REACT_CODEBASE_PACKAGED_AS_A_NATIVE_APP_VIA_CAPACITOR.JS</p>
              <p>:: BACKEND_SPLIT_INTO_MICROSERVICES_DEPLOYED_ON_DOCKER_+_GCP</p>
            </div>
          </div>

          {/* No public demo notice */}
          <div className="mt-8 border-4 border-double border-yellow-400 p-8 bg-black text-center">
            <p className="text-yellow-400 text-lg mb-2">
              &gt;&gt; NO_PUBLIC_DEMO_AVAILABLE &lt;&lt;
            </p>
            <p className="text-xs text-green-400 mt-4">
              :: LIVE_PRODUCTION_PLATFORM_FOR_A_REAL_CLIENT ::
            </p>
            <p className="text-xs text-magenta-400 mt-2">
              :: DETAILS_SHOWN_HERE_FOR_PORTFOLIO_PURPOSES_ONLY ::
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
