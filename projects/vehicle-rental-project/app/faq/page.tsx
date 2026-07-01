import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';
import { HeroSection } from '@/components/HeroSection';
import { FAQItem } from './FaqItem';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Answers to common questions about renting a campervan with NorthVenture in Bergen — cancellation policy, insurance, driver requirements, pickup, and more.',
  openGraph: {
    title: 'FAQ | NorthVenture',
    description: 'Answers to common questions about renting a campervan with NorthVenture in Bergen — cancellation policy, insurance, driver requirements, pickup, and more.',
    images: [{ url: '/hero-image.jpg', width: 1200, height: 630 }],
  },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection
          title="Frequently asked questions"
          subtitle="Find answers to common questions about renting with NorthVenture"
          backgroundImage="/hero-image.jpg"
          height="40vh"
        />

        {/* FAQ CONTENT */}
        <section className="bg-white py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">

            {/* CANCELLATION POLICY */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Cancellation & Refund Policy
              </h2>

              <div className="space-y-4">
                <FAQItem 
                  question="How can I cancel my camper booking, and how much of my already paid rental fee will be refunded?" 
                  defaultOpen={true}
                >
                  <p>
                    All cancellation requests must be submitted through our{' '}
                    <a href="/modify-booking" className="text-primary-600 hover:underline font-medium">
                      Modify Booking
                    </a>{' '}
                    page.
                  </p>

                  <div className="bg-primary-50 border-l-4 border-primary-500 p-4 my-4">
                    <p className="font-semibold text-primary-900 mb-2">Free Cancellation Window</p>
                    <p className="text-primary-900">
                      If you cancel your booking within 24 hours of making the reservation, you will receive a <strong>full refund (100%)</strong>.
                    </p>
                  </div>

                  <p className="font-semibold text-aurora-900 mt-6 mb-3">
                    Refund schedule for cancellations after 24 hours:
                  </p>

                  <p>
                    Cancellations made after the 24-hour free cancellation window will be refunded based on the number of days prior to the start of the rental:
                  </p>

                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden my-4">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cancellation timing</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Refund amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr>
                          <td className="px-4 py-3 text-sm">More than 30 days before rental</td>
                          <td className="px-4 py-3 text-sm font-medium text-green-700">100% refund</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">22 to 30 days before rental (inclusive)</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">50% refund</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">15 to 21 days before rental (inclusive)</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-700">25% refund</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 text-sm">14 days or less before rental</td>
                          <td className="px-4 py-3 text-sm font-medium text-red-700">No refund (0%)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
                    <p className="font-semibold text-gray-800 mb-2">Important notes:</p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      <li>The cancellation fee includes all rental charges, additional fees, booked extras, and insurance costs.</li>
                      <li>Once a cancellation has been processed, it is deemed final and irreversible.</li>
                      <li>Should you wish to proceed with a booking after cancellation, a new reservation must be submitted through our online booking system.</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 border-l-4 border-gray-400 p-4 my-4">
                    <p className="font-semibold text-gray-800 mb-2">Travel insurance recommendation</p>
                    <p className="text-gray-700">
                      We are not responsible for your cancellations due to events beyond our control, such as flight cancellations, illness, or other unforeseen circumstances. These situations will not result in changes to our cancellation policy. For your protection, we <strong>strongly encourage you to purchase travel insurance</strong> if you have not already done so. Travel insurance can help cover your costs in the event of such unexpected occurrences.
                    </p>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    It is not possible to convert your booking into a voucher for later use.
                  </p>
                </FAQItem>

                <FAQItem question="What happens if NorthVenture cancels my booking?">
                  <p>
                    NorthVenture reserves the right to cancel any reservation in the event of overbooking or for any other reason. In such cases, you will receive a <strong>full refund</strong> of all payments made. NorthVenture shall not be liable for any additional costs, losses, or inconveniences incurred as a result of the cancellation.
                  </p>
                </FAQItem>
              </div>
            </div>

            {/* VEHICLE & EQUIPMENT */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Vehicle & Equipment
              </h2>

              <div className="space-y-4">
                <FAQItem question="What is included with the vehicle?" defaultOpen={true}>
                  <p className="mb-4">Every vehicle comes fully equipped with the following at no extra cost:</p>
                  <ul className="space-y-2">
                    {[
                      'Basic kitchen package',
                      'Basic cleaning supplies',
                      'General basic essentials (toilet paper, soap, paper towels)',
                      'Minimum 11 kg of gas',
                      'Bed linen for all beds',
                      'Camping table and two camping chairs',
                      'Awning',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2.5 text-gray-700">
                        <svg className="w-4 h-4 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-gray-600">
                    Additional equipment and services can be added during the booking process on the extras page.
                  </p>
                </FAQItem>
              </div>
            </div>

            {/* PAYMENT & BOOKING */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Payment & Booking
              </h2>

              <div className="space-y-4">
                <FAQItem question="What payment methods do you accept?">
                  <p className="mb-3">
                    The vehicle rental fee must be paid by credit card or bank transfer. The full rental amount is charged at the time of booking.
                  </p>
                  <p>
                    <strong>Accepted cards:</strong> Visa, Mastercard, Google Pay, and Apple Pay.
                  </p>
                </FAQItem>

                <FAQItem question="What is the security deposit, and when will it be returned?">
                  <p className="mb-3">
                    A deposit covering the driver's deductible fee is required at pickup based on the chosen insurance:
                  </p>
                  <ul className="list-disc pl-6 mb-3 space-y-1">
                    <li><strong>Basic Insurance:</strong> 16,000 kr deposit</li>
                    <li><strong>Premium Insurance:</strong> 12,000 kr deposit</li>
                    <li><strong>Premium+ Insurance:</strong> 7,000 kr deposit</li>
                  </ul>
                  <p className="mb-3">
                    Deposits are generally released within <strong>10 business days</strong> following the vehicle's return, provided no deductions are required for damages or additional charges.
                  </p>
                  <p className="text-sm">
                    In the event of damage where an accident statement is provided, the deposit return timeline depends on insurance claim processing. This process typically takes 2–3 months but may extend longer in complex cases.
                  </p>
                </FAQItem>

                <FAQItem question="When do I receive my booking confirmation?">
                  <p>
                    You will receive a booking confirmation email immediately after your payment is successfully processed. If you don't receive it within a few minutes, please check your spam folder or contact us at{' '}
                    <a href="mailto:support@arctictrail.no" className="text-primary-600 hover:underline">
                      support@arctictrail.no
                    </a>
                    .
                  </p>
                </FAQItem>
              </div>
            </div>

            {/* RENTAL REQUIREMENTS */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Rental Requirements
              </h2>

              <div className="space-y-4">
                <FAQItem question="What are the driver requirements?">
                  <div className="space-y-3">
                    <p>
                      <strong>Age:</strong> The driver must be at least 21 years old on the day of pick-up.
                    </p>
                    <p>
                      <strong>Driver's license:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Must present a physical, standard, unrestricted driving license that has been valid for at least 2 years</li>
                      <li>Digital presentations are only accepted if they originate from Norway</li>
                      <li>License must be equivalent to a European Category B license or higher</li>
                      <li>License must use the Latin alphabet. If not, an international driving permit is required</li>
                    </ul>
                  </div>
                </FAQItem>

                <FAQItem question="Can I add an additional driver?">
                  <p>
                    Yes! You can purchase the "Extra Driver" option when booking. The extra driver must meet all the same requirements as the main driver and must be listed on the rental agreement before departure. 
                    <strong className="text-primary-700"> Premium and Premium+ insurance packages include one free extra driver!</strong>
                  </p>
                </FAQItem>

                <FAQItem question="What is the minimum rental period?">
                  <p>
                    The minimum rental period is <strong>2 days</strong>.
                  </p>
                </FAQItem>
              </div>
            </div>

            {/* INSURANCE */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Insurance Options
              </h2>

              <div className="space-y-4">
                <FAQItem question="What insurance options are available?">
                  <p className="mb-4">
                    We offer three insurance tiers to suit your needs:
                  </p>

                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Basic Insurance (Included)</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Included in rental price</li>
                        <li>Security deposit: 16,000 kr</li>
                        <li>Deductible equals security deposit</li>
                        <li>Liability coverage included</li>
                        <li className="text-red-600">Windshield damage not covered</li>
                        <li className="text-red-600">Roadside assistance not included</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Premium Insurance (200 kr/day)</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Security deposit: 12,000 kr</li>
                        <li>Deductible equals security deposit</li>
                        <li className="text-green-600">Free extra driver included</li>
                        <li className="text-red-600">Windshield damage not covered</li>
                        <li className="text-red-600">Roadside assistance not included</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-800 mb-2">Premium+ Insurance (400 kr/day)</p>
                      <ul className="list-disc pl-6 space-y-1 text-sm">
                        <li>Security deposit: 7,000 kr</li>
                        <li>Deductible equals security deposit</li>
                        <li className="text-green-600">Free extra driver included</li>
                        <li className="text-green-600">Windshield damage covered</li>
                        <li className="text-green-600">Roadside assistance included</li>
                      </ul>
                    </div>
                  </div>
                </FAQItem>

                <FAQItem question="Do I need additional travel insurance?">
                  <p>
                    Yes, we <strong>strongly recommend</strong> that all drivers obtain separate travel insurance to cover potential out-of-pocket expenses, trip cancellations, medical emergencies, and other unforeseen circumstances not included in the rental agreement.
                  </p>
                </FAQItem>
              </div>
            </div>

            {/* VEHICLE PICK-UP & RETURN */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Vehicle Pick-Up & Return
              </h2>

              <div className="space-y-4">
                <FAQItem question="When must the vehicle be returned?">
                  <div className="space-y-2">
                    <p>
                      The vehicle must be returned by <strong>12:00 (noon)</strong> on your return date, unless you have added the Late Return extra (until 18:00).
                    </p>
                    <p>
                      Every started 30 minutes after the agreed return time will be charged at <strong>400 NOK</strong>. For example, a return at 12:45 means two started 30-minute periods = 800 NOK.
                    </p>
                    <p className="text-sm text-gray-500">
                      Please contact us as soon as possible if you anticipate being late.
                    </p>
                  </div>
                </FAQItem>

                <FAQItem question="What are the pick-up hours?">
                  <p>
                    You can pick up your vehicle between <strong>12:00 and 24:00</strong> on your start date. When booking, you'll be asked to select an estimated arrival time so we can be ready for you.
                  </p>
                </FAQItem>

                <FAQItem question="Where do I pick up and return the vehicle?">
                  <p className="mb-3">
                    <strong>NorthVenture Location:</strong><br />
                    Ropnesvegen 43, 9107 Kvaløya, Bergen, Norway
                  </p>
                  <p>
                    We also offer airport pickup and drop-off services (09:00–18:00) for 600 kr each way. This service can be added during the booking process.
                  </p>
                </FAQItem>

                <FAQItem question="What condition should the vehicle be in when I return it?">
                  <div className="space-y-2">
                    <p>The vehicle must be returned:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Clean (inside and outside), except for normal wear and tear</li>
                      <li>With a full tank of fuel (diesel) or fully charged (electric vehicles)</li>
                      <li>With all original attachments and equipment</li>
                      <li>At the agreed time and location</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-3">
                      If the vehicle is not returned with a full tank, we will refill it and charge for the missing fuel plus a processing fee.
                    </p>
                  </div>
                </FAQItem>

                <FAQItem question="What happens if I return the vehicle late?">
                  <div className="space-y-2">
                    <p>
                      Every started 30 minutes after your agreed return time (<strong>12:00</strong>, or <strong>18:00</strong> with the Late Return extra) is charged at <strong>400 NOK</strong>.
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-600">
                      <li>Return at 12:20 - 400 NOK (one started 30-min period)</li>
                      <li>Return at 12:45 - 800 NOK (two started 30-min periods)</li>
                      <li>Return at 13:30 - 1,200 NOK (three started 30-min periods)</li>
                    </ul>
                    <p className="text-sm text-gray-500">
                      Please contact us as soon as possible if you anticipate being late.
                    </p>
                  </div>
                </FAQItem>
              </div>
            </div>

            {/* DRIVING & RESTRICTIONS */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-aurora-900 mb-6">
                Driving & Restrictions
              </h2>

              <div className="space-y-4">
                <FAQItem question="Can I drive the vehicle outside of Norway?">
                  <p>
                    No, driving outside of Norway requires prior written consent from NorthVenture. Please contact us if you wish to travel to other countries.
                  </p>
                </FAQItem>

                <FAQItem question="Are there any driving restrictions?">
                  <div className="space-y-2">
                    <p>Yes, the following are prohibited and will void insurance coverage:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Off-road driving (paths, beaches, trackless areas)</li>
                      <li>Driving on uncleared or unmaintained snow-covered roads</li>
                      <li>Driving across rivers or on frozen lakes/fjords</li>
                      <li>Driving in extreme weather conditions with official warnings (Red or Orange level)</li>
                      <li>Driving under the influence of alcohol or drugs (zero tolerance)</li>
                      <li>Carrying more passengers or cargo than the vehicle is registered for</li>
                    </ul>
                    <p className="text-sm text-gray-600 mt-3">
                      For complete driving restrictions, please see our{' '}
                      <a href="/toc" className="text-primary-600 hover:underline">Terms and Conditions</a>.
                    </p>
                  </div>
                </FAQItem>

                <FAQItem question="Is smoking allowed in the vehicle?">
                  <p>
                    <strong>No — smoking and vaping of any kind is strictly prohibited inside the vehicle</strong>, including when stationary. This applies to all occupants throughout the rental period.
                  </p>
                  <p className="mt-3 text-sm text-gray-600">
                    If evidence of smoking is found upon return, a minimum fine of <strong>4,000 NOK</strong> will be charged, in addition to any deep-cleaning costs.
                  </p>
                </FAQItem>

                <FAQItem question="What should I do in case of an accident or breakdown?">
                  <div className="space-y-2">
                    <p><strong>In case of an accident:</strong></p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Immediately notify the police and NorthVenture</li>
                      <li>Do not leave the scene before the police have arrived</li>
                      <li>Complete an accident statement and submit it to NorthVenture as soon as possible</li>
                    </ul>
                    <p className="mt-3"><strong>In case of a breakdown:</strong></p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Contact NorthVenture immediately</li>
                      <li>Use the roadside assistance number provided during vehicle pickup (Premium+ insurance includes roadside assistance)</li>
                    </ul>
                  </div>
                </FAQItem>
              </div>
            </div>

          </div>
        </section>

        <CTASection
          title="Still have questions?"
          subtitle="We're here to help with your Arctic adventure"
          buttonText="Contact Us"
          buttonHref="mailto:support@arctictrail.no"
          buttonVariant="outline"
        />
      </main>

      <Footer />
    </div>
  );
}
