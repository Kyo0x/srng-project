import type { Metadata } from 'next';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Campervan Rental Bergen | NorthVenture, Norway',
  description: 'Rent a campervan in Bergen from NorthVenture. Winter-ready vehicles, perfect for fjord road trips and northern adventures. Book direct for the best rates.',
  keywords: [
    'campervan rental Bergen',
    'motorhome hire Bergen',
    'campervan hire Bergen Norway',
    'winter campervan Norway',
    'fjord campervan trip',
    'northern lights campervan',
    'campervan rental Norway',
    'rent campervan Bergen',
  ],
  openGraph: {
    title: 'Campervan Rental Bergen | NorthVenture',
    description: 'Winter-ready campervans based in Bergen. Fjord routes and northern expeditions. Book your Norwegian road trip today.',
    images: [{ url: '/hero-image.jpg', width: 1200, height: 630 }],
  },
  alternates: {
    canonical: 'https://www.northventure-demo.com/campervan-rental-tromso',
  },
};

export default function CampervanRentalBergenPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* HERO */}
        <section
          className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ height: '65vh', backgroundImage: 'url(/hero-image.jpg)' }}
        >
          <div className="absolute inset-0 bg-black/55 z-0" />
          <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-3">Bergen · Northern Norway</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-5 tracking-tight leading-tight">
              Campervan Rental in Bergen
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-light mb-8 max-w-2xl mx-auto">
              Winter-ready campervans, airport pickup, and insider routes. Your Arctic road trip starts here.
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-gray-900 px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-gray-100 transition-all"
            >
              Check Availability
            </Link>
          </div>
        </section>

        {/* INTRO */}
        <section className="bg-white py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Why Bergen</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              The world's best basecamp for an Arctic road trip
            </h2>
            <div className="space-y-5 text-gray-600 text-base leading-relaxed">
              <p>
                Bergen sits at 69° north, well inside the Arctic Circle, and it is one of the few places on earth where you can drive straight from an international airport into genuine wilderness within twenty minutes. The city has everything you need before you set off: supermarkets, camping gas, outdoor shops, and good fuel stations. The moment you cross the bridge onto Bergen or head south towards Senja, the crowds thin out fast and the landscapes take over.
              </p>
              <p>
                Renting a campervan in Bergen means you travel on your own schedule. You stop when the light is extraordinary, you sleep where the aurora fills the sky, and you are never locked into a hotel that is an hour's drive from where you actually want to be. In the Arctic, conditions change quickly, and a campervan gives you the flexibility to follow the forecast, chase clear skies, and stay out as long as the night is worth it.
              </p>
              <p>
                At NorthVenture we are based on Bergen, the large island just west of Bergen city, and every vehicle in our fleet is prepared specifically for Norwegian Arctic conditions. That means proper winter tyres fitted before the season, heating systems that keep the interior comfortable at −20 °C, and a full kitchen so you can cook a hot meal after a long day on the road.
              </p>
            </div>
          </div>
        </section>

        {/* PICKUP LOCATION */}
        <section className="bg-gray-50 py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Pickup Location</p>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-5 tracking-tight">
                  Based on Bergen: easy to reach, easy to leave
                </h2>
                <div className="space-y-4 text-gray-600 text-base leading-relaxed">
                  <p>
                    Our fleet is based at Strandgaten 123 on Bergen, roughly 20 kilometres west of Bergen city centre. The drive from central Bergen takes around 25 minutes along one of the most scenic coastal roads in the region, a pleasant introduction to what the rest of your trip will look like.
                  </p>
                  <p>
                    Pickup is available daily from <strong className="text-gray-800">12:00 to 24:00</strong>, so you can arrive on a late afternoon flight, check into a hotel in town for one night, and collect the campervan the next day without any rush. Returns are due by <strong className="text-gray-800">12:00 noon</strong>, or 18:00 if you add the late-return option during booking.
                  </p>
                  <p>
                    When you arrive, we walk through the vehicle with you, covering the heating system, the kitchen, the bed layout, and the route planner we put together based on your dates and interests. You leave feeling ready, not overwhelmed.
                  </p>
                </div>
                <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
                  <p className="text-sm font-semibold text-gray-700 mb-1">NorthVenture base</p>
                  <p className="text-sm text-gray-500">Strandgaten 123, 5013 Bergen, Norway</p>
                  <p className="text-sm text-gray-500 mt-1">
                    <a href="tel:+4755512345" className="hover:text-gray-700 transition-colors">+47 555 12 345</a>
                    {' · '}
                    <a href="mailto:hello@northventure-demo.com" className="hover:text-gray-700 transition-colors">hello@northventure-demo.com</a>
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <iframe
                  src="https://maps.google.com/maps?q=Ropnesvegen+43,+5013+Kval%C3%B8ya,+Norway&output=embed&z=15"
                  width="100%"
                  height="320"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NorthVenture pickup location on Bergen"
                />
              </div>
            </div>
          </div>
        </section>

        {/* AIRPORT ACCESS */}
        <section className="bg-white py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Airport Access</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Flying into Bergen? We've got you covered
            </h2>
            <div className="space-y-5 text-gray-600 text-base leading-relaxed mb-10">
              <p>
                Bergen Airport Langnes (TOS) is one of the busiest airports in northern Norway, with direct flights from Oslo, Bergen, and several European hubs including London Heathrow, Frankfurt, and Amsterdam during the winter season. Flying into Bergen is genuinely easy, and so is getting your campervan the same day you land.
              </p>
              <p>
                We offer a dedicated <strong className="text-gray-800">airport transfer service</strong> for 600 kr each way. You land, collect your bags, and we meet you at arrivals. No taxi queues, no bus connections, no navigating an unfamiliar city. We drive you the 20 minutes out to Bergen, hand over the vehicle, and you can be on the road heading north within an hour of touching down.
              </p>
              <p>
                The airport transfer runs between <strong className="text-gray-800">09:00 and 18:00</strong>. For later arrivals we recommend spending the night in Bergen city (the airport is just 5 km from the city centre) and picking up the van the following morning. We can time the handover around your schedule.
              </p>
              <p>
                At the end of your trip, the same transfer runs in reverse. If you have an early morning departure, return the campervan the evening before and let us arrange an airport drop-off. It keeps the final morning stress-free.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Airport to base', value: '~20 min', note: 'Transfer available 09:00–18:00' },
                { label: 'Transfer cost', value: '600 kr', note: 'Each way, bookable as an extra' },
                { label: 'Direct flights to TOS', value: '15+', note: 'Routes from Oslo, Bergen, and Europe' },
              ].map(({ label, value, note }) => (
                <div key={label} className="bg-gray-50 rounded-xl border border-gray-100 p-5 text-center">
                  <p className="text-2xl font-semibold text-gray-900 mb-1">{value}</p>
                  <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                  <p className="text-xs text-gray-400">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WINTER DRIVING */}
        <section className="bg-gray-50 py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Winter Driving</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Driving in the Norwegian Arctic: what to expect
            </h2>
            <div className="space-y-5 text-gray-600 text-base leading-relaxed mb-10">
              <p>
                Winter driving in northern Norway is not difficult, but it is different. Roads are well maintained, with Norwegian road authorities having decades of experience keeping E6 and the coastal routes clear, but conditions can change over a short distance. A road in full sun at noon can be sheet ice in shadow around the next headland. The key is to slow down, keep distance, and read the surface ahead of you.
              </p>
              <p>
                Every NorthVenture campervan is fitted with <strong className="text-gray-800">studded winter tyres</strong> from October through April. Studs make a genuine difference on compacted snow and black ice compared to friction tyres, and they are what Norwegian drivers use locally. You will feel the grip as soon as you start driving. All vehicles are also equipped with an ice scraper, snow brush, and traction mats in case you need them.
              </p>
              <p>
                We brief every renter on local conditions before departure: which mountain passes may have closures, which roads require 4WD, and where to check the official Norwegian road hotline (<em>Vegtrafikksentralen</em>) before setting off each morning. The rule for mountain passes is simple: if the pass is marked closed, it is closed for a reason. Plan a coastal alternative and you will not lose much time.
              </p>
              <p>
                The heater in each campervan is designed for Arctic temperatures. Running it overnight is safe and expected. You will wake to a warm interior and a clear windscreen. We also supply a plug-in shore-power connection for campsite hookups, which keeps the van warm without using fuel.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Studded winter tyres', body: 'Fitted October–April on all vehicles. Engineered for ice, compacted snow, and the temperature swings common in coastal Arctic driving.' },
                { title: 'Diesel heating system', body: 'Keeps the interior at a comfortable temperature overnight down to −20 °C, independent of the engine.' },
                { title: 'Pre-departure road briefing', body: 'We cover live pass conditions, weather alerts, and the road sections most relevant to your planned route.' },
                { title: 'Emergency kit included', body: 'Every van carries a tow rope, jump leads, traction mats, reflective triangles, and a first-aid kit as standard.' },
              ].map(({ title, body }) => (
                <div key={title} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-all">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOFOTEN TRIPS */}
        <section className="bg-white py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Lofoten Road Trips</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Bergen to Lofoten by campervan
            </h2>
            <div className="space-y-5 text-gray-600 text-base leading-relaxed mb-10">
              <p>
                The drive from Bergen to Lofoten is one of the great road trips of northern Europe. It is around 450 kilometres each way, which sounds long until you start driving it. The road passes through Senja (consistently voted one of Norway's most beautiful islands), crosses into Vesterålen, and then drops down the chain of Lofoten islands all the way to the distinctive red fishing villages of Å and Reine. The scenery is extraordinary throughout.
              </p>
              <p>
                Most people allow <strong className="text-gray-800">seven to ten days</strong> for a return trip, which gives you time to explore properly rather than just driving through. A typical itinerary: two nights on Senja, one night in Harstad or Andenes, two or three nights spread across Lofoten, and then a different coastal route back to Bergen. The roads are well surfaced and the campervans handle them without issue.
              </p>
              <p>
                In winter (roughly November through March), the Lofoten route is one of the most reliable places in Norway to see the northern lights away from city light pollution. The islands sit far enough out to sea that the sky is genuinely dark, and the combination of arctic peaks reflected in the fjords makes for aurora photography that is hard to match anywhere in the world.
              </p>
              <p>
                In summer, the midnight sun means you can hike the famous Reinebringen ridge or kayak the fjords at 2am in full daylight. It is a completely different kind of spectacular, and a campervan is the best way to experience it: you sleep when you want, not when the light says so.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Suggested route: Bergen to Lofoten (7 nights)</p>
              <ol className="space-y-3">
                {[
                  { day: 'Day 1–2', text: 'Collect campervan on Bergen, drive south via E8 to Senja. Overnight at Senjahopen or Mefjordvær.' },
                  { day: 'Day 3', text: "Explore Senja's west coast: Tungeneset viewpoint, Bergsbotn viewpoint. Cross to Harstad." },
                  { day: 'Day 4', text: 'Ferry or drive through Vesterålen. Optional: whale safari at Andenes (Nov–Jan).' },
                  { day: 'Day 5–6', text: 'Into Lofoten via Gullesfjordbotn. Explore Svolvær, Henningsvær, Nusfjord. Stay near Reine.' },
                  { day: 'Day 7', text: 'Reine, Å, and the drive back north. Optional: overnight on Senja again.' },
                  { day: 'Day 8', text: 'Return to Bergen by noon.' },
                ].map(({ day, text }) => (
                  <li key={day} className="flex gap-4">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider w-16 shrink-0 pt-0.5">{day}</span>
                    <p className="text-sm text-gray-600 leading-relaxed">{text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* NORTHERN LIGHTS */}
        <section className="bg-gray-50 py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Northern Lights Travel</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Why a campervan is the best way to chase the aurora
            </h2>
            <div className="space-y-5 text-gray-600 text-base leading-relaxed mb-10">
              <p>
                The northern lights appear when the solar wind interacts with Earth's atmosphere, typically between 18:00 and 02:00 in winter. Forecasts are available, but the aurora is genuinely unpredictable. A strong display can develop in minutes and fade just as quickly, or a forecast of KP5 can produce nothing while a calm night suddenly erupts at KP2. The single biggest factor in whether you see the aurora is not the forecast: it is cloud cover.
              </p>
              <p>
                In the Bergen region, clouds roll in from the coast and often park over the fjords for days at a time. The best strategy is simple: drive away from the cloud. Hotel guests can't do this. Campervan travellers can. When a gap in the cloud cover appears 80 kilometres inland, you drive there. When the forecast shows clear skies over Senja at midnight, you are already parked up with the kettle on.
              </p>
              <p>
                Bergen is ideally positioned for this kind of aurora chasing. You have mountains to the east (Bergen and Lyngen), open fjords to the south, and coastal roads that let you position yourself quickly relative to the cloud. The drive times between locations are short enough that you can move twice in a single evening without losing the window of darkness.
              </p>
              <p>
                The aurora season in northern Norway runs from <strong className="text-gray-800">late September through late March</strong>, the months when the nights are long enough to see it. The peak months for both aurora activity and darkness are November through February. January and February are statistically the clearest months in the Bergen area, though they are also the coldest. Our campervans are fully heated and comfortable at these temperatures, so the cold is never a reason to stay inside.
              </p>
              <p>
                We also provide every renter with our aurora guide covering the best viewpoints within a two-hour radius of Bergen, how to read the SpaceWeatherLive and YR forecast apps together, and basic camera settings for aurora photography on a smartphone or mirrorless camera. You do not need specialist knowledge to get good shots; you just need to know where to stand and when.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'Aurora season', value: 'Sept–March', note: 'Peak darkness and activity Nov–Feb' },
                { label: 'Best tactic', value: 'Chase the clear sky', note: 'Drive away from cloud cover in real time' },
                { label: 'Included', value: 'Aurora guide', note: 'Viewpoints, forecast apps, photography tips' },
              ].map(({ label, value, note }) => (
                <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
                  <p className="text-lg font-semibold text-gray-900 mb-1">{value}</p>
                  <p className="text-sm font-medium text-gray-700 mb-1">{label}</p>
                  <p className="text-xs text-gray-400">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QUICK FACTS / BOOKING */}
        <section className="bg-white py-14 md:py-20 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Ready to Book</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Everything you need to get started
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {[
                { q: 'Minimum rental period', a: '2 days, though most Arctic trips are 7–14 days' },
                { q: 'Pickup hours', a: '12:00–24:00 daily from Bergen, Bergen' },
                { q: 'Airport transfer', a: '600 kr each way, 09:00–18:00, bookable as an extra' },
                { q: 'Winter tyres', a: 'Studded tyres fitted October through April, included' },
                { q: 'Minimum driver age', a: '21 years, valid licence held for at least 2 years' },
                { q: 'Long-stay discount', a: '10% off for rentals of 7 days or more' },
              ].map(({ q, a }) => (
                <div key={q} className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{q}</p>
                  <p className="text-sm text-gray-700">{a}</p>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/"
                className="inline-block bg-gray-900 text-white px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-gray-700 transition-all mr-4"
              >
                Check Availability
              </Link>
              <Link
                href="/faq"
                className="inline-block border border-gray-200 text-gray-700 px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-gray-50 transition-all"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </section>

        <CTASection
          title="Your Arctic adventure starts in Bergen"
          subtitle="Winter-ready campervans, airport pickup, and a team that knows the north. Book direct for the best rates."
          buttonText="Browse Available Dates"
          buttonHref="/"
        />
      </main>

      <Footer />
    </div>
  );
}
