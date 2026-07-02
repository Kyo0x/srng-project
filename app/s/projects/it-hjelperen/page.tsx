"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function ItHjelperenProjectPage() {
  const [demoUrl, setDemoUrl] = useState("https://it-website.srng.no");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname.endsWith(".localhost");

      if (isLocalhost) {
        // For local development, point to localhost:3003
        setDemoUrl("http://localhost:3003");
      }
    }
  }, []);

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
            <h1 className="text-lg font-bold text-cyan-500 tracking-wider">IT.SOLUTIONS</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-2 border-dotted border-magenta-500 p-4 bg-black">
            <h2 className="text-2xl font-bold text-magenta-500 mb-2">
              &gt;&gt; IT.SUPPORT.&.PC.BUILDING.SERVICE
            </h2>
            <p className="text-green-400">
              :: MARKETING_SITE_FOR_A_LOCAL_IT_SUPPORT_BUSINESS ::
            </p>
          </div>

          {/* Project Info */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Features */}
            <div className="border-4 border-double border-cyan-500 p-6 bg-black">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; FEATURES</h3>
              <ul className="space-y-2 text-sm text-green-400">
                <li>:: PC_SERVICE_&_REPAIR_INFO</li>
                <li>:: SETUP_&_INSTALLATION_SERVICES</li>
                <li>:: HOME_NETWORK_&_WIFI_OPTIMIZATION</li>
                <li>:: DATA_SECURITY_&_BACKUP_PACKAGES</li>
                <li>:: PRICING_&_CONTACT_PAGES</li>
                <li>:: SERVICE_BOOKING_CONTACT_FORM</li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="border-4 border-double border-cyan-500 p-6 bg-black">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; TECH.STACK</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-magenta-400">FRONTEND:</span>
                  <span className="text-green-400"> SVELTEKIT_+_TAILWIND</span>
                </div>
                <div>
                  <span className="text-magenta-400">LANGUAGE:</span>
                  <span className="text-green-400"> TYPESCRIPT</span>
                </div>
                <div>
                  <span className="text-magenta-400">HOSTING:</span>
                  <span className="text-green-400"> VERCEL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gallery */}
          <div className="border-4 border-double border-cyan-500 p-6 bg-black mb-8">
            <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; PROJECT.GALLERY</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="relative aspect-video border-2 border-dotted border-yellow-400 overflow-hidden">
                  <Image
                    src={`/screenshots/it-hjelperen/screenshot-${n}.png`}
                    alt={`IT-Hjelperen website screenshot ${n}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project Notes */}
          <div className="border-4 border-double border-magenta-500 p-6 bg-black">
            <h3 className="text-xl font-bold text-magenta-400 mb-4">&gt; PROJECT.NOTES</h3>
            <div className="space-y-2 text-sm text-green-400">
              <p>:: MARKETING_SITE_FOR_A_LOCAL_IT_SUPPORT_&_PC-BUILDING_BUSINESS</p>
              <p>:: SERVICES_PRICING_ABOUT_&_CONTACT_PAGES</p>
              <p>:: LEAD_CAPTURE_VIA_CONTACT_FORM</p>
              <p>:: BUILT_FOR_FAST_LOAD_&_STRONG_LOCAL_SEO</p>
            </div>
          </div>

          {/* CTA - Launch Demo */}
          <div className="mt-8 border-4 border-double border-yellow-400 p-8 bg-black text-center">
            <p className="text-yellow-400 text-lg mb-6">
              &gt;&gt; LIVE_DEMO_AVAILABLE &lt;&lt;
            </p>
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-4 border-double border-cyan-500 px-8 py-4 bg-black hover:bg-cyan-950 hover:border-yellow-400 transition-colors"
            >
              <span className="text-2xl font-bold text-cyan-400">
                &gt; LAUNCH.DEMO &lt;
              </span>
            </a>
            <p className="text-xs text-green-400 mt-6">
              :: FULL_WORKING_SITE ::
            </p>
            <p className="text-xs text-magenta-400 mt-2">
              :: PORTFOLIO_VERSION_-_ANONYMIZED_FOR_DEMONSTRATION ::
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
