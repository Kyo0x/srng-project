"use client";

import { useEffect, useState } from "react";

export default function TfkWebsiteProjectPage() {
  const [demoUrl, setDemoUrl] = useState("https://hunting-dog-portal.srng.no");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLocalhost = window.location.hostname === "localhost" || window.location.hostname.endsWith(".localhost");

      if (isLocalhost) {
        // For local development, point to localhost:3002
        setDemoUrl("http://localhost:3002");
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
            <h1 className="text-lg font-bold text-cyan-500 tracking-wider">HUNTING.DOG.PORTAL</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 border-2 border-dotted border-magenta-500 p-4 bg-black">
            <h2 className="text-2xl font-bold text-magenta-500 mb-2">
              &gt;&gt; HUNTING.CLUB.CMS.PLATFORM
            </h2>
            <p className="text-green-400">
              :: EVENTS_NEWS_&_HUNT_TRIALS_FOR_DOG_CLUB_MEMBERS ::
            </p>
          </div>

          {/* Project Info */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Features */}
            <div className="border-4 border-double border-cyan-500 p-6 bg-black">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; FEATURES</h3>
              <ul className="space-y-2 text-sm text-green-400">
                <li>:: EVENTS_CALENDAR_WITH_HUNT_TRIAL_CATEGORIES</li>
                <li>:: NEWS_&_ACTIVITY_FEED</li>
                <li>:: CLUBHOUSE_RENTAL_INFO_&_CONTRACT_PDF</li>
                <li>:: RULES_&_RESOURCE_DOCUMENT_LIBRARY</li>
                <li>:: FULL_CONTENT_MANAGEMENT_VIA_SANITY_STUDIO</li>
                <li>:: ON-DEMAND_REVALIDATION_FOR_INSTANT_UPDATES</li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div className="border-4 border-double border-cyan-500 p-6 bg-black">
              <h3 className="text-xl font-bold text-cyan-400 mb-4">&gt; TECH.STACK</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-magenta-400">FRONTEND:</span>
                  <span className="text-green-400"> NEXT.JS_+_REACT_+_TAILWIND</span>
                </div>
                <div>
                  <span className="text-magenta-400">CMS:</span>
                  <span className="text-green-400"> SANITY.IO</span>
                </div>
                <div>
                  <span className="text-magenta-400">LANGUAGE:</span>
                  <span className="text-green-400"> TYPESCRIPT</span>
                </div>
                <div>
                  <span className="text-magenta-400">ANALYTICS:</span>
                  <span className="text-green-400"> VERCEL_ANALYTICS</span>
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
              <div className="aspect-video border-2 border-dotted border-yellow-400 flex items-center justify-center">
                <span className="text-yellow-400">[IMG_001]</span>
              </div>
              <div className="aspect-video border-2 border-dotted border-yellow-400 flex items-center justify-center">
                <span className="text-yellow-400">[IMG_002]</span>
              </div>
              <div className="aspect-video border-2 border-dotted border-yellow-400 flex items-center justify-center">
                <span className="text-yellow-400">[IMG_003]</span>
              </div>
            </div>
          </div>

          {/* Project Notes */}
          <div className="border-4 border-double border-magenta-500 p-6 bg-black">
            <h3 className="text-xl font-bold text-magenta-400 mb-4">&gt; PROJECT.NOTES</h3>
            <div className="space-y-2 text-sm text-green-400">
              <p>:: CONTENT-DRIVEN_WEBSITE_FOR_A_HUNTING_DOG_CLUB</p>
              <p>:: EVENTS_&_NEWS_MANAGED_ENTIRELY_THROUGH_SANITY_STUDIO</p>
              <p>:: HUNT_TRIAL_RESULTS_ORGANIZED_BY_CATEGORY</p>
              <p>:: CLUBHOUSE_BOOKING_INFO_WITH_DOWNLOADABLE_CONTRACT</p>
              <p>:: BUILT_FOR_NON-TECHNICAL_CLUB_VOLUNTEERS_TO_MAINTAIN</p>
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
              :: FULL_WORKING_SITE_WITH_LIVE_CMS_CONTENT ::
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
