import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';
import { HeroSection } from '@/components/HeroSection';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Read the complete terms and conditions for renting RVs from NorthVenture. Includes rental requirements, insurance, cancellation policy, driving restrictions, and vehicle use guidelines.',
  openGraph: {
    title: 'Terms and Conditions | NorthVenture',
    description: 'Complete rental terms and conditions for NorthVenture RV rentals in Northern Norway.',
  },
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection
          title="Terms and Conditions"
          subtitle="Please read these terms carefully before using our services"
          backgroundImage="/hero-image.jpg"
          height="40vh"
        />

        {/* TABLE OF CONTENTS */}
        <section className="bg-gray-50 py-8 px-4 md:px-8 border-b">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-aurora-900 mb-4">Table of Contents</h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <a href="#general" className="text-primary-700 hover:underline">1. General</a>
              <a href="#driver-requirements" className="text-primary-700 hover:underline">2. Driver Requirements</a>
              <a href="#payment-cancellation" className="text-primary-700 hover:underline">3. Payment &amp; Cancellation</a>
              <a href="#pickup-return" className="text-primary-700 hover:underline">4. Vehicle Pick-Up and Return</a>
              <a href="#driving-restrictions" className="text-primary-700 hover:underline">5. Driving Restrictions &amp; Vehicle Use</a>
              <a href="#driver-responsibility" className="text-primary-700 hover:underline">6. Driver&apos;s Responsibility</a>
              <a href="#lessor-obligations" className="text-primary-700 hover:underline">7. Obligations of the Lessor</a>
              <a href="#insurance" className="text-primary-700 hover:underline">8. Insurance</a>
              <a href="#general-provisions" className="text-primary-700 hover:underline">9. General Provisions</a>
              <a href="#contact" className="text-primary-700 hover:underline">10. Contact Details</a>
            </nav>
          </div>
        </section>

        {/* CONTENT SECTION */}
        <section className="bg-white py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              Last updated: May 2026
            </p>

            {/* SECTION 1: GENERAL */}
            <h2 id="general" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">1. General</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">1.1. Definitions</h3>

            <p className="text-gray-700 mb-4">
              <strong>1.1.1. Lessor:</strong> NorthVenture, Kvaløya, Tromsø, Norway.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>1.1.2. Driver:</strong> The driver of the vehicle. Any additional co-driver is also considered a driver.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>1.1.3. Vehicle:</strong> Any camper van rented out by the lessor.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>1.1.4. Campervan:</strong> A motorized vehicle designed for recreational use, equipped with comprehensive living amenities, including sleeping, cooking, and bathroom facilities (toilet and shower).
            </p>

            <p className="text-gray-700 mb-4">
              <strong>1.1.5. Period of Rental:</strong> The rental period begins when the vehicle is handed over and ends once the lessor confirms its return during business hours, after the checkout process is completed on time—even if the driver returned the vehicle outside of business hours.
            </p>

            <p className="text-gray-700 mb-6">
              <strong>1.1.6. Acknowledgment:</strong> The driver has read, understood, and agreed to comply with these terms by NorthVenture processing full or partial payment of the rental fee or by the driver signing the rental contract. A copy of the contract, including these terms, is provided to the driver.
            </p>

            {/* SECTION 2: DRIVER REQUIREMENTS */}
            <h2 id="driver-requirements" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">2. Driver Requirements</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">2.1. Age</h3>
            <p className="text-gray-700 mb-6">
              The driver must be at least 21 years old on the day of pick-up of the rented vehicle.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">2.2. Licence</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The driver must present a physical, standard, unrestricted driving licence that has been valid for at least 2 years. Digital presentations will only be accepted if they originate from Norway. Licences that do not meet these requirements will not be accepted.</li>
              <li>The licence must be equivalent to a European Category B licence or higher to be eligible to drive our campervans.</li>
              <li>The licence must use the Latin alphabet. If not, an international driving permit is required.</li>
              <li>The driver of larger vehicles that, according to law, require an extended driver&apos;s licence must present the appropriate licence at the start of the rental.</li>
              <li>It is the driver&apos;s responsibility to ensure that their licence permits them to operate the vehicle. Failure to comply will result in full liability for any damages incurred.</li>
              <li>It is the driver&apos;s responsibility to ensure that the number of passengers does not exceed the maximum capacity of the rented vehicle, as specified on the NorthVenture website.</li>
            </ul>

            {/* SECTION 3: PAYMENT & CANCELLATION */}
            <h2 id="payment-cancellation" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">3. Payment &amp; Cancellation</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">3.1. Payment Methods</h3>
            <p className="text-gray-700 mb-4">
              The vehicle rental fee must be paid by credit card or bank transfer. The full rental amount is charged at the time of booking.
            </p>
            <p className="text-gray-700 mb-4">
              The card information will be used and stored for the payment process and accountancy by NorthVenture and our payment provider Stripe. The same payment card must be used for the deposit and must remain valid. It may be charged at any time in accordance with the current terms and conditions.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Accepted Cards:</strong> Visa, Mastercard, Google Pay, and Apple Pay.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">3.2. Deposit</h3>
            <p className="text-gray-700 mb-4">
              A deposit covering the driver&apos;s deductible fee is required at pickup based on the chosen insurance. Each separate incident that occurs during the rental period requires a separate deposit payment.
            </p>
            <p className="text-gray-700 mb-4">
              A travel deposit may be taken in addition to cover expenses such as: ferry, private road fees, as well as parking-related charges not settled by the renter during the rental period.
            </p>
            <p className="text-gray-700 mb-4">
              Deposits are generally released within 10 business days following the vehicle&apos;s return, provided no deductions are required for damages or additional charges. In cases where costs arise that must be covered by the deposit, the final settlement may be subject to delays. The processing time for such deductions is contingent upon factors including, but not limited to, the resolution of insurance claims and the receipt of final workshop invoices.
            </p>
            <p className="text-gray-700 mb-6">
              In the event of damage where an accident statement is provided, including the licence plate number of the other party, the deposit return timeline depends on insurance claim processing. NorthVenture is legally required to wait for the insurance provider to determine liability before returning deposits. This process typically takes 2–3 months but may extend longer in complex cases.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">3.3. Additional Costs</h3>
            <p className="text-gray-700 mb-6">
              Any unforeseen costs incurred during the rental period, including but not limited to rental fees, insurance fees, damages, toll charges, refuelling costs, and fines, shall be the sole responsibility of the driver and will be charged accordingly. Additionally, administration fees may apply where applicable.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">3.4. Cancellation Policy</h3>
            <p className="text-gray-700 mb-4">
              A cancellation made within 24 hours of the initial booking is free of charge (100% refund).
            </p>
            <p className="text-gray-700 mb-4">
              All cancellation requests must be submitted via email to <a href="mailto:hello@northventure-demo.com" className="text-primary-600 hover:underline">hello@northventure-demo.com</a> or through our online cancellation system.
            </p>
            <p className="text-gray-700 mb-4">
              For cancellations made after 24 hours, refunds are calculated based on the time remaining before the start of the rental period:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li><strong>More than 30 days before rental:</strong> Full refund (100%)</li>
              <li><strong>22 to 30 days before rental:</strong> 50% refund</li>
              <li><strong>15 to 21 days before rental:</strong> 25% refund</li>
              <li><strong>14 days or less before rental:</strong> No refund (0%)</li>
            </ul>
            <p className="text-gray-700 mb-4">
              <strong>Please note:</strong>
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The cancellation fee includes all rental charges, additional fees, booked extras, and insurance costs.</li>
              <li>Once a cancellation has been processed, it is deemed final and irreversible. Should the driver wish to proceed with a booking after cancellation, a new reservation must be submitted through the online booking system.</li>
            </ul>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">3.5. Cancellation by the Lessor</h3>
            <p className="text-gray-700 mb-6">
              The lessor reserves the right to cancel any reservation in the event of overbooking or for any other reason. In such cases, the driver will receive a full refund of all payments made. The lessor shall not be liable for any additional costs, losses, or inconveniences incurred as a result of the cancellation.
            </p>

            {/* SECTION 4: VEHICLE PICK-UP AND RETURN */}
            <h2 id="pickup-return" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">4. Vehicle Pick-Up and Return Conditions</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">4.1. Pick-Up Condition</h3>
            <p className="text-gray-700 mb-4">
              It is recommended to document the vehicle&apos;s condition by taking satisfactory pictures of the vehicle&apos;s exterior (both sides, front, back, and roof) and its interior (dashboard, front seats, and back seats), so that they can be presented to the owner upon request.
            </p>
            <p className="text-gray-700 mb-6">
              Any undocumented damage must be reported to the lessor through the online system or in person prior to leaving the premises at the time of vehicle pick-up. Failure to report such damage will result in the driver assuming full financial responsibility for the cost of repairs.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">4.2. Return Requirements</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The vehicle and any additional extras rented must be returned with all original attachments in its original condition and clean, except for normal wear and tear.</li>
              <li>Missing or damaged parts will be charged to the driver.</li>
              <li>The driver is obligated to return the vehicle with a full tank of fuel (diesel) or fully charged in the case of electric vehicles. If otherwise, the lessor will be authorised to refill the vehicle and charge the amount for the missing fuel with an additional processing fee.</li>
              <li>The driver is required to report any damage sustained to the vehicle during the rental period to an NorthVenture representative at the time of checkout, via email or phone.</li>
              <li>The driver must set aside time to examine the vehicle upon return. If there is no representative from NorthVenture present to inspect the vehicle upon return, we recommend documenting the vehicle&apos;s condition by taking satisfactory pictures.</li>
              <li>The driver carries full responsibility for the vehicle until the vehicle is returned in accordance with Section 1.1.5.</li>
              <li>The final damage check by the lessor is considered completed when the vehicle has been cleaned, at the latest 48 hours after the vehicle has been returned during regular business hours.</li>
            </ul>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">4.3. Return Timing</h3>
            <p className="text-gray-700 mb-4">
              <strong>The vehicle must be returned by 12:00 (noon) on the final day of the rental period</strong>, unless a Late Return upgrade (until 18:00) has been added to the booking. Extending the rental beyond the agreed return time is subject to the lessor's consent.
            </p>
            <p className="text-gray-700 mb-6">
              For every started 30-minute period after the agreed return time, a fee of <strong>400 NOK</strong> will be charged. This applies regardless of the reason for the delay.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">4.4. Repossession Rights</h3>
            <p className="text-gray-700 mb-6">
              The lessor or law enforcement authorities may repossess the vehicle at the driver&apos;s cost if the driver violates the terms of the rental agreement, fails to return the vehicle as agreed, or is found to be in breach of applicable Norwegian laws and regulations.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">4.5. Vehicle Recovery</h3>
            <p className="text-gray-700 mb-4">
              In case of a technical malfunction inherent to the vehicle itself, which is not caused by the driver&apos;s actions, negligence, misuse, or external factors (such as accidents, improper fuelling, or off-road driving), the lessor will cover the recovery costs.
            </p>
            <p className="text-gray-700 mb-4">
              In contrast, if any technical malfunction occurs after an incident, the driver will be fully responsible for covering any costs related to the recovery of the vehicle to the rental station as agreed in the contract, regardless of the incident or vehicle&apos;s condition, road conditions, or weather.
            </p>
            <p className="text-gray-700 mb-6">
              Additionally, if the driver becomes unfit to drive due to illness or the loss of their driving licence, the recovery costs will be the driver&apos;s responsibility.
            </p>

            {/* SECTION 5: DRIVING RESTRICTIONS */}
            <h2 id="driving-restrictions" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">5. Driving Restrictions</h2>

            <p className="text-gray-700 mb-4">
              The vehicle must be handled with care and driven only by authorised drivers: the main driver (the driver) or any additional drivers listed as &quot;Extra Driver&quot; in the agreement before departure. The &quot;Extra Driver&quot; option must be purchased before departure.
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Violating the following terms will result in the loss of insurance coverage, and the driver will be responsible for covering all costs, losses, and fees related to the incident and its consequences.</strong>
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">5.1. Prohibited Driving Actions and Negligent Handling</h3>
            <p className="text-gray-700 mb-4">
              The driver must operate the vehicle responsibly and in accordance with Norwegian traffic laws.
            </p>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">Prohibited Terrain and Surfaces</h4>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Off-road driving (paths, beaches, trackless areas, tidal zones)</li>
              <li>Driving on uncleared or unmaintained snow-covered roads</li>
              <li>Driving on roads officially closed by barriers or maintenance vehicles</li>
              <li>Driving across rivers or watercourses</li>
              <li>Driving on snow banks, frozen lakes, rivers, or fjords</li>
              <li>Driving into areas with insufficient height or weight clearance</li>
              <li>Parking in potential avalanche zones (beneath steep slopes)</li>
              <li>Towing, pushing, or moving other vehicles</li>
              <li>Driving with excessively low tyre pressure, such that the tyre or rim is damaged</li>
              <li>Incorrect use of jumper cables to start the vehicle</li>
              <li>Dangerous driving practices</li>
              <li>Driving under the influence of alcohol or drugs (zero tolerance)</li>
              <li>Carrying more passengers or cargo than the vehicle is registered for</li>
              <li>Any violation of Norwegian traffic laws</li>
              <li>Driving outside of Norway without prior written consent</li>
              <li>Transporting hazardous materials</li>
              <li>Subletting or lending the vehicle to unauthorized persons</li>
            </ul>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">Weather-Related Driving Restrictions</h4>
            <p className="text-gray-700 mb-4">The driver must not operate the vehicle when:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Red Weather Warning (Rødt nivå)</strong> is active for the driving area. Red warnings indicate extreme danger with high risk of widespread damage. Check Yr.no or Varsom.no before and during travel. If a red warning is issued while driving, seek safe shelter immediately.</li>
              <li><strong>Orange Weather Warning (Oransje nivå)</strong> applies AND road authorities have advised against travel. Check Norwegian Public Roads Administration (Statens vegvesen) travel advisories at vegvesen.no/trafikk.</li>
              <li><strong>Avalanche Warning at Red or &quot;Very High&quot; level (Level 5)</strong> applies to the planned route. Check Varsom.no before mountain travel.</li>
              <li>Visibility is severely reduced (under 50 metres) due to fog, snow, or blizzard conditions.</li>
              <li>The driver cannot maintain safe control due to ice, standing water, or other hazardous road conditions.</li>
            </ul>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">Weather Information Resources</h4>
            <p className="text-gray-700 mb-4">Drivers are required to check weather conditions before and during travel using:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><a href="https://yr.no/en" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Yr.no/en</a> (English language weather forecasts and warnings)</li>
              <li><a href="https://varsom.no/en" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Varsom.no/en</a> (Avalanche, flood, and landslide warnings)</li>
              <li><a href="https://vegvesen.no/trafikk" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">Vegvesen.no/trafikk</a> (Road conditions and closures)</li>
            </ul>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-2">Note for International Drivers</h4>
              <p className="text-blue-800">
                Norwegian weather can change rapidly, especially in winter and mountain areas. Weather that seems moderate in your home country may constitute dangerous conditions in Norway. When in doubt, do not drive. Contact NorthVenture for guidance.
              </p>
            </div>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">Definition of Negligence</h4>
            <p className="text-gray-700 mb-4">
              &quot;Negligence&quot; means failing to exercise reasonable care expected of a responsible driver, resulting in damage. Examples include (but are not limited to):
            </p>
            <p className="text-gray-700 mb-2"><strong>Clear Negligence (Insurance may be denied):</strong></p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Ignoring persistent warning lights (oil, coolant, brake system) and continuing to drive</li>
              <li>Driving with critically low tyre pressure causing tyre/rim damage</li>
              <li>Using wrong fuel type (diesel in petrol vehicle or vice versa)</li>
              <li>Failing to secure the fuel cap, causing engine damage</li>
              <li>Overloading the vehicle beyond posted capacity</li>
              <li>Improper use of jumper cables causing electrical damage</li>
              <li>Driving on roads marked with &quot;Stengt&quot; (Closed) signs</li>
            </ul>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">5.2. Smoking and Animals</h3>
            <p className="text-gray-700 mb-4">
              <strong>Smoking and vaping of any kind is strictly prohibited inside the vehicle.</strong> This applies to all occupants at all times during the rental period, including when the vehicle is stationary.
            </p>
            <p className="text-gray-700 mb-6">
              If evidence of smoking is found upon return, a minimum fine of <strong>4,000 NOK</strong> will be charged, in addition to any special deep-cleaning costs and other applicable charges.
            </p>
            <p className="text-gray-700 mb-6">
              Bringing animals into the vehicle is permitted only if the <strong>Pet Fee</strong> extra has been added to the booking. Unauthorised animals may result in additional deep-cleaning charges.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">5.3. In Case of Incident / Accident</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The driver must immediately notify the police and the lessor in case of an accident, and the driver may not leave the scene before the police have arrived.</li>
              <li>In the event of an accident, a completed accident statement must be submitted to NorthVenture as soon as possible, either via email or phone.</li>
              <li>In cases where the insurance provider is involved in the resolution of the situation, all parties must adhere to the decision made by the insurer.</li>
              <li>If the driver did not cause the accident and the cause is not found, the driver is responsible for the damage to the lessor&apos;s vehicle.</li>
              <li>If the driver is found to be at fault for an incident, they will be held liable for any damage caused to a third-party vehicle or property during the rental period, subject to the limits of the insurance coverage selected at the time of booking.</li>
            </ul>

            {/* SECTION 6: DRIVER'S RESPONSIBILITY */}
            <h2 id="driver-responsibility" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">6. Driver&apos;s Responsibility</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">6.1. Driver&apos;s Responsibility at Booking Time</h3>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>It is the driver&apos;s responsibility to ensure that the number of passengers does not exceed the maximum capacity of the rented vehicle, as specified on the NorthVenture website. NorthVenture accepts no liability if this information is overlooked during the booking process.</li>
              <li>It is the responsibility of the driver to acquire knowledge about Norwegian traffic laws and weather conditions for the duration of their rental period.</li>
            </ul>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">6.2. Driver&apos;s Responsibility for Payment</h3>
            <p className="text-gray-700 mb-4">The driver is required to make payments for the following:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>The total amount of the rent as agreed in the rental agreement. Deviations from the rental agreement will result in changes to the total amount.</li>
              <li>Unfilled fuel or uncharged battery, with additional administration fees.</li>
              <li>Costs associated with return of the vehicle to a location other than the agreed location.</li>
              <li>Any cost associated with tolls, road user charges, parking, or the like, in addition to administration fees. The driver is responsible for paying parking fees directly to the parking operator.</li>
              <li>Parking fines, automatic traffic control fees, unpaid parking fees, or other fines due to the driver, and the owner&apos;s associated management fees.</li>
              <li>Any damage that occurs to the vehicle during the rental period, including vandalism, theft, and towing; however, liability is limited to the agreed deductible. The deductible is calculated per incident.</li>
              <li>Any costs or damages related to locking the keys inside the vehicle will be the driver&apos;s responsibility.</li>
              <li>Missing or damaged equipment and accessories such as charging cables, parcel shelves, spare wheels, child seats, etc.</li>
              <li>Special cleaning (inside and outside) of especially soiled vehicles and accessories, e.g., cleaning after animals or smoking, cleaning of seats or seat covers, or cleaning after driving on oil, gravel, fresh asphalt/road marking, clay, mud, or other dirt requiring extraordinary work.</li>
              <li>In the event a tyre replacement is required during the rental period, the driver is responsible for covering the cost of replacing both tyres on the same axle. For four-wheel drive vehicles, the driver may be responsible for the replacement cost of all four tyres.</li>
              <li>Road assistance/towing not due to faults or defects for which the lessor is responsible.</li>
              <li>In the event of breach of the rental agreement, the Road Traffic Act, or negligent behaviour in the event of injury, the driver may be required to pay more than the agreed deductible.</li>
              <li>In the event of wilful misconduct, gross negligence, or gross violation of rental conditions or road traffic law, the driver will be fully financially responsible for all incident-related costs incurred during the rental period.</li>
              <li>The driver is responsible for covering any costs incurred by the lessor in recovering outstanding payments, including all fees related to debt collection or legal action.</li>
            </ul>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">6.3. Payment Authorisation and Notification</h3>
            <p className="text-gray-700 mb-4">
              By signing this agreement, the driver authorises NorthVenture to charge the payment card on file for all amounts owed under this rental agreement, subject to the notification requirements below.
            </p>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">a) Immediate Charges (No Advance Notice Required)</h4>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Security deposits collected or blocked on the card at vehicle pickup</li>
              <li>Pre-authorised rental fees and extras</li>
              <li>Charges acknowledged and signed by the driver during pickup or return</li>
              <li>Ferry fees, parking fees, and parking fines, including any applicable administration and processing fees</li>
            </ul>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">b) Delayed Charges (7-Day Notice)</h4>
            <p className="text-gray-700 mb-4">For charges that arise after the rental period:</p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>Additional toll road fees, parking charges, traffic fines, or administrative fees</li>
              <li>Repair costs for damages to the rented vehicle</li>
            </ul>
            <p className="text-gray-700 mb-4">
              NorthVenture will send itemised notification via email at least 7 days before processing the charge. Drivers may dispute charges within 5 days by providing supporting documentation.
            </p>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">c) Disputed Charges</h4>
            <p className="text-gray-700 mb-6">
              If a driver disputes a charge in writing within the notification period, NorthVenture will respond with supporting documentation within 10 business days. Undisputed portions of charges may be processed according to the original timeline. All notifications will be sent to the email address provided in the booking.
            </p>

            {/* SECTION 7: OBLIGATIONS OF THE LESSOR */}
            <h2 id="lessor-obligations" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">7. Obligations of the Lessor</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">7.1. Vehicle Provision</h3>
            <p className="text-gray-700 mb-6">
              The lessor agrees to supply the vehicle at the agreed time and ensure it meets the required specifications.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">7.2. Vehicle Malfunctions</h3>
            <p className="text-gray-700 mb-4">
              Due to the nature of mechanical and electronic systems, occasional malfunctions or failures may occur despite NorthVenture&apos;s commitment to regular maintenance and vehicle preparation. The driver acknowledges that such technical issues may arise and that NorthVenture cannot be held responsible for every instance of unexpected technical failure.
            </p>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">a) Replacement Vehicle Provision</h4>
            <p className="text-gray-700 mb-4">
              In the event of a vehicle malfunction, NorthVenture will provide a comparable replacement vehicle as soon as reasonably possible, subject to vehicle availability and operational capacity. If a comparable vehicle is not available, a vehicle from a different category may be offered as a suitable alternative.
            </p>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">b) Vehicle-Inherent Malfunctions</h4>
            <p className="text-gray-700 mb-4">
              If a technical malfunction occurs that is inherent to the vehicle and not caused by the driver&apos;s actions, negligence, misuse, or external factors, NorthVenture will arrange delivery of a replacement vehicle to the nearest location accessible by public transportation.
            </p>
            <p className="text-gray-700 mb-4">
              However, if subsequent investigation determines that the malfunction was in fact caused by the driver&apos;s negligence, misuse, or wrongdoing, the driver shall be liable for all delivery and transportation costs, all repair costs, and rental fees for the replacement vehicle for the affected period.
            </p>

            <h4 className="text-lg font-semibold text-aurora-700 mt-6 mb-2">c) Acceptance of Known Malfunctions at Pick-Up</h4>
            <p className="text-gray-700 mb-6">
              If a malfunction or defect is identified on the vehicle at the time of pick-up, and NorthVenture offers an alternative vehicle, but the driver voluntarily chooses to proceed with the vehicle displaying the known malfunction, the driver expressly waives any right to make claims related to that malfunction or any problems arising from it during the rental period.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">7.3. Vehicle Restrictions and Accessories</h3>
            <p className="text-gray-700 mb-4">
              If the lessor wishes to limit the vehicle&apos;s use, it will be documented in writing at the time the lease is signed. The lessor has no responsibility for installing accessories such as roof racks, ski boxes, bike racks, child seats, GPS, etc. The driver is responsible for ensuring that the equipment is correctly and properly installed.
            </p>
            <p className="text-gray-700 mb-6">
              The lessor shall not be held liable for the loss, disappearance, or damage of any personal property left in or transported with the vehicle by the driver.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">7.4. Refund of Expenditure</h3>
            <p className="text-gray-700 mb-6">
              In the event a refund is to be issued, the driver must provide NorthVenture with a valid tax receipt in order for the refund to be processed. The receipt must clearly state the MVA (VAT), and no other form of proof will be accepted. Additionally, the receipt must include only the items relevant to the refund.
            </p>

            {/* SECTION 8: INSURANCE */}
            <h2 id="insurance" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">8. Insurance</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.1. Liability Insurance</h3>
            <p className="text-gray-700 mb-6">
              The lessor maintains valid liability insurance for its operations.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.2. Rental Insurance</h3>
            <p className="text-gray-700 mb-4">
              The rental fee includes mandatory vehicle insurance, which covers liability and accident insurance for the driver and vehicle owner.
            </p>
            <p className="text-gray-700 mb-6">
              It is strongly recommended that all drivers obtain separate deductible insurance and travel insurance to cover potential out-of-pocket expenses not included in the rental agreement.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.3. Third-Party Insurance</h3>
            <p className="text-gray-700 mb-6">
              Third-party liability insurance covers the minimum amount required by Norwegian law.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.4. Roadside Assistance</h3>
            <p className="text-gray-700 mb-6">
              Roadside assistance services are exclusively available through our insurance provider and should be accessed via the phone number provided during the handover procedure. If the driver uses a roadside assistance company not contracted by our insurance provider, the driver must cover the full cost.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.5. Insurance Options</h3>
            <p className="text-gray-700 mb-4">
              The driver has the option to purchase alternative insurance beyond Basic, such as Premium and Premium+, with specific deductibles applicable to each incident. The deductible equals the security deposit.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <h4 className="text-lg font-semibold text-aurora-800 mb-4">Insurance Tiers</h4>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="font-semibold text-gray-800">Basic Insurance (Included)</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                    <li>Included in rental price</li>
                    <li>Security deposit: 16,000 kr</li>
                    <li>Deductible equals security deposit</li>
                    <li>Liability coverage included</li>
                    <li className="text-red-600">Windshield damage not covered</li>
                    <li className="text-red-600">Roadside assistance not included</li>
                  </ul>
                </div>
                <div className="border-b pb-4">
                  <p className="font-semibold text-gray-800">Premium Insurance (200 kr/day)</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                    <li>Security deposit: 12,000 kr</li>
                    <li>Deductible equals security deposit</li>
                    <li>Free extra driver included</li>
                    <li className="text-red-600">Windshield damage not covered</li>
                    <li className="text-red-600">Roadside assistance not included</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Premium+ Insurance (400 kr/day)</p>
                  <ul className="list-disc pl-6 text-gray-700 mt-2 space-y-1">
                    <li>Security deposit: 7,000 kr</li>
                    <li>Deductible equals security deposit</li>
                    <li>Free extra driver included</li>
                    <li className="text-green-600">Windshield damage covered</li>
                    <li className="text-green-600">Roadside assistance included</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.6. Exclusions from Insurance Coverage</h3>
            <p className="text-gray-700 mb-4">
              Insurance plans do not cover the following:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Damage resulting from racing, war, or civil unrest</li>
              <li>Water or sand damage</li>
              <li>Damage to solar panels (not covered under glass damage)</li>
              <li>Damage to the battery alone (without other related damage)</li>
              <li>Damage caused by overheating, corrosion, or rust</li>
              <li>Damage resulting from driving in closed areas or on race tracks</li>
              <li>Holes burned into seats, carpets, or mats</li>
              <li>Damage affecting only wheels, tyres, suspension, radios, or loss/theft of parts of the vehicle</li>
              <li>Damage to the vehicle&apos;s transmission, drive system, or components attached to the chassis, resulting from driving on rough roads</li>
              <li>Damage caused by sea spray or seawater during transportation on a boat</li>
              <li>Damage caused by unauthorised drivers</li>
              <li>Damage caused by driving in extreme weather conditions if official warnings were issued</li>
              <li>Loss of the vehicle&apos;s licence plate, including all related fines and replacement costs</li>
              <li>Damage to the door, fender, or hinges caused by wind catching the doors</li>
              <li>Damage related to locking the keys inside the vehicle</li>
              <li>Damage caused by incorrect fuelling or introducing substances into the water tank</li>
            </ul>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.7. Special Limitation: Roof Damage Coverage</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6">
              <p className="font-semibold text-amber-800 mb-2">IMPORTANT: Roof Damage</p>
              <p className="text-amber-800">
                This section applies ONLY to damage to the roof area of the campervans. All other vehicle damage is covered normally under your insurance tier with only your deductible applying.
              </p>
            </div>
            <p className="text-gray-700 mb-4">
              <strong>Definition of roof area:</strong> The uppermost external structural surface of a vehicle that covers and protects the interior from weather, impact, and environmental exposure. It typically spans from the top of the windshield to the rear window and may support accessories such as roof racks, solar panels, skylights, or awning systems.
            </p>
            <p className="text-gray-700 mb-4">
              Due to the high cost and frequency of roof damage, NorthVenture provides a roof clearance and awareness pamphlet at vehicle pickup identifying known low-clearance areas in the Tromsø region.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Driver&apos;s Responsibilities for Roof Damage:</strong> In the event of roof damage, the driver shall be responsible for taking all necessary measures to protect the vehicle from water ingress or any additional damage arising from the incident. Any costs incurred as a result of failure to do so shall be borne solely by the driver.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">8.8. Loss of Vehicle</h3>
            <p className="text-gray-700 mb-6">
              The lessor is not liable for the theft or complete loss of the vehicle.
            </p>

            {/* SECTION 9: GENERAL PROVISIONS */}
            <h2 id="general-provisions" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">9. General Provisions</h2>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">9.1. Confirmation of Vehicle Condition</h3>
            <p className="text-gray-700 mb-6">
              The driver confirms, upon signing the agreement, that they have received the vehicle and any attachments in good condition.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">9.2. Credit Card Transactions</h3>
            <p className="text-gray-700 mb-6">
              Signing the agreement authorises the lessor to charge the driver&apos;s credit card for any applicable costs outlined in this rental agreement.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">9.3. Keeping the Agreement</h3>
            <p className="text-gray-700 mb-6">
              The driver agrees to keep a copy of the rental agreement in the vehicle throughout the rental period.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">9.4. Amendments</h3>
            <p className="text-gray-700 mb-4">
              NorthVenture reserves the right to modify, update, or amend these Terms and Conditions at any time. Changes take effect immediately for new bookings made after publication on our website.
            </p>
            <p className="text-gray-700 mb-4">
              For drivers with existing bookings, changes will only apply if:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
              <li>The driver is notified by email at least 21 days before their rental start date, AND</li>
              <li>The driver does not exercise their right to cancel within 14 days of notification.</li>
            </ul>
            <p className="text-gray-700 mb-6">
              If material changes are made that affect existing bookings, the driver may cancel without penalty and receive a full refund. Changes required by law or regulation take effect immediately and apply to all bookings.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">9.5. Governing Law</h3>
            <p className="text-gray-700 mb-6">
              This agreement is governed by Norwegian law. Any legal disputes will be resolved in the lessor&apos;s legal venue.
            </p>

            <h3 className="text-xl font-semibold text-aurora-800 mt-8 mb-3">9.6. Dispute Resolution</h3>
            <p className="text-gray-700 mb-6">
              Disputes may be submitted to the Norwegian Consumer Authority&apos;s Arbitration Committee, or the Norwegian Travel Industry Association for mediation or resolution.
            </p>

            {/* SECTION 10: CONTACT */}
            <h2 id="contact" className="text-2xl font-bold text-aurora-900 mt-12 mb-4">10. Contact Details</h2>

            <div className="bg-gray-50 rounded-lg p-6 my-6">
              <p className="text-gray-800 font-semibold text-lg mb-4">NorthVenture</p>
              <p className="text-gray-700 mb-2">Ropnesvegen 43, 9107 Kvaløya, Norway</p>
              <p className="text-gray-700 mb-2">
                Phone: <a href="tel:+4755512345" className="text-primary-600 hover:underline">+47 555 12 345</a>
              </p>
              <p className="text-gray-700 mb-2">
                Email: <a href="mailto:hello@northventure-demo.com" className="text-primary-600 hover:underline">hello@northventure-demo.com</a>
              </p>
              <p className="text-gray-700">
                Website: <a href="https://northventure-demo.com" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">northventure-demo.com</a>
              </p>
            </div>

            <p className="text-gray-600 mt-8 text-sm">
              If you have any questions about these Terms and Conditions, please contact us before making your booking.
            </p>
          </div>
        </section>

        <CTASection
          title="Ready to Book?"
          subtitle="Start your Arctic adventure today"
          buttonText="Browse Our Fleet"
          buttonHref="/"
          buttonVariant="outline"
        />
      </main>

      <Footer />
    </div>
  );
}
