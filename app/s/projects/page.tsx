import SubdomainLink from "../../components/SubdomainLink";

export default function ProjectsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-black font-mono">
      {/* Header */}
      <header className="border-b-2 border-dashed border-cyan-500">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-3">
            <SubdomainLink
              className="text-2xl text-cyan-500 hover:text-yellow-400 transition-colors"
            >
              [S]
            </SubdomainLink>
            <h1 className="text-lg font-bold text-cyan-500 tracking-wider">SRNG.PROJECTS</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-2 border-dotted border-magenta-500 p-4 bg-black">
            <h2 className="text-2xl font-bold text-magenta-500 mb-2">
              &gt;&gt; DEMO.PROJECTS
            </h2>
            <p className="text-green-400">
              :: EXPLORE_PORTFOLIO_OF_WEB_APPLICATIONS ::
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Vehicle Rental Demo */}
            <a
              href="/vehicle-rental-project"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-cyan-400">[V]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; VEHICLE.RENTAL</h3>
              <p className="text-sm text-green-400 mb-3">
                :: CAMPERVAN_RENTAL_BOOKING_PLATFORM ::
              </p>
              <div className="flex gap-2 text-xs">
                <span className="border border-dotted border-magenta-400 px-2 py-1 text-magenta-400">NEXT.JS</span>
                <span className="border border-dotted border-magenta-400 px-2 py-1 text-magenta-400">STRIPE</span>
              </div>
              <div className="mt-4 text-yellow-400">
                &gt;&gt;&gt;
              </div>
            </a>

            {/* Hunting Dog Website */}
            <a 
              href="#"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-cyan-400">[H]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; HUNTING.DOG.PORTAL</h3>
              <p className="text-sm text-green-400 mb-3">
                :: WEBSITE_FOR_DOG_BREEDERS_AND_ENTHUSIASTS ::
              </p>
              <div className="flex gap-2 text-xs">
                <span className="border border-dotted border-magenta-400 px-2 py-1 text-magenta-400">REACT</span>
                <span className="border border-dotted border-magenta-400 px-2 py-1 text-magenta-400">TAILWIND</span>
              </div>
              <div className="mt-4 text-yellow-400">
                &gt;&gt;&gt;
              </div>
            </a>

            {/* IT Website */}
            <a 
              href="#"
              className="group block border-4 border-double border-cyan-500 p-6 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <div className="mb-4">
                <span className="text-4xl text-cyan-400">[I]</span>
              </div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">&gt; IT.SOLUTIONS</h3>
              <p className="text-sm text-green-400 mb-3">
                :: IT_SERVICES_AND_TECHNOLOGY_CONSULTING ::
              </p>
              <div className="flex gap-2 text-xs">
                <span className="border border-dotted border-magenta-400 px-2 py-1 text-magenta-400">NEXT.JS</span>
                <span className="border border-dotted border-magenta-400 px-2 py-1 text-magenta-400">CMS</span>
              </div>
              <div className="mt-4 text-yellow-400">
                &gt;&gt;&gt;
              </div>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
