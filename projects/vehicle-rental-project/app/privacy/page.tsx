import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how NorthVenture collects, uses, and protects your personal information when you use our campervan rental services.',
  openGraph: {
    title: 'Privacy Policy | NorthVenture',
    description: 'How we handle your personal information.',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection
          title="Privacy Policy"
          subtitle="How we collect, use, and protect your information"
          backgroundImage="/hero-image.jpg"
          height="40vh"
        />

        {/* CONTENT SECTION */}
        <section className="bg-white py-16 md:py-24 px-4 md:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <p className="text-gray-500 mb-8 text-sm">
              Last updated: 18 March 2026
            </p>

            {/* 1. Introduction */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-6">
              NorthVenture (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), operated by Alex Nordström, Strandgaten 123, 5013 Bergen, Norway, is the data controller responsible for your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and campervan rental services, in accordance with the EU General Data Protection Regulation (GDPR) and the Norwegian Personal Data Act (<em>personopplysningsloven</em>).
            </p>

            {/* 2. Information We Collect */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">2. Information we collect</h2>
            <p className="text-gray-700 mb-4">
              We collect the following categories of personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Identity data:</strong> full name, date of birth</li>
              <li><strong>Contact data:</strong> email address, phone number, postal address</li>
              <li><strong>Driver information:</strong> driver&apos;s license number, issuing country, license category</li>
              <li><strong>Booking data:</strong> rental dates, vehicle, selected extras, booking history</li>
              <li><strong>Payment data:</strong> billing address, last four digits of card (full card details are processed directly by Stripe and never stored by us)</li>
              <li><strong>Communications:</strong> emails and messages you send us</li>
              <li><strong>Technical data:</strong> IP address, browser type, and pages visited, collected automatically when you use our website</li>
            </ul>

            {/* 3. Legal Basis for Processing */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">3. Legal basis for processing</h2>
            <p className="text-gray-700 mb-4">
              We process your personal data on the following legal grounds under GDPR Article 6:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Performance of a contract (Art. 6(1)(b)):</strong> processing your booking, managing your rental, and handling payments</li>
              <li><strong>Legal obligation (Art. 6(1)(c)):</strong> retaining accounting records, complying with insurance requirements, and cooperating with law enforcement when required</li>
              <li><strong>Legitimate interests (Art. 6(1)(f)):</strong> preventing fraud, improving our services, and maintaining the security of our systems</li>
              <li><strong>Consent (Art. 6(1)(a)):</strong> sending promotional communications — you may withdraw consent at any time</li>
            </ul>

            {/* 4. How We Use Your Information */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">4. How we use your information</h2>
            <p className="text-gray-700 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li>Process and manage your campervan rental bookings</li>
              <li>Send booking confirmations, reminders, and updates</li>
              <li>Process payments and issue refunds</li>
              <li>Verify your identity and driving licence eligibility</li>
              <li>Handle modifications, cancellations, and disputes</li>
              <li>Comply with legal and regulatory obligations</li>
              <li>Detect and prevent fraud or misuse</li>
              <li>Send promotional communications (only with your consent)</li>
            </ul>

            {/* 5. Data Processors and Third Parties */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">5. Data processors and third parties</h2>
            <p className="text-gray-700 mb-4">
              We do not sell your personal information. We share data only where necessary with the following processors and parties, each bound by appropriate data protection agreements:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Stripe (USA):</strong> payment processing. Stripe is certified under the EU–US Data Privacy Framework. See <a href="https://stripe.com/privacy" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></li>
              <li><strong>Resend (USA):</strong> transactional email delivery (booking confirmations, reminders). Data is processed under standard contractual clauses</li>
              <li><strong>Insurance providers:</strong> your driver and booking details are shared when required to arrange or process insurance claims</li>
              <li><strong>Law enforcement and authorities:</strong> when required by applicable law or a court order</li>
            </ul>

            {/* 6. International Data Transfers */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">6. International data transfers</h2>
            <p className="text-gray-700 mb-6">
              Some of our data processors (Stripe, Resend) are based in the United States. Where personal data is transferred outside the European Economic Area, we ensure appropriate safeguards are in place — either through an adequacy decision, the EU–US Data Privacy Framework, or Standard Contractual Clauses approved by the European Commission.
            </p>

            {/* 7. Data Security */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">7. Data security</h2>
            <p className="text-gray-700 mb-6">
              We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. Payment card data is processed entirely by Stripe and is never stored on our servers. Access to booking data is restricted to authorised personnel only.
            </p>

            {/* 8. Data Retention */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">8. Data retention</h2>
            <p className="text-gray-700 mb-6">
              We retain your personal information only for as long as necessary for the purposes described in this policy. Specifically:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Booking and payment records:</strong> 7 years, as required by Norwegian accounting law (<em>bokføringsloven</em>)</li>
              <li><strong>Driver&apos;s licence information:</strong> deleted within 30 days of the rental end date</li>
              <li><strong>Marketing consent records:</strong> retained until you withdraw consent</li>
              <li><strong>Technical/log data:</strong> up to 90 days</li>
            </ul>

            {/* 9. Automated Decision-Making */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">9. Automated decision-making</h2>
            <p className="text-gray-700 mb-6">
              We do not use automated decision-making or profiling that produces legal or similarly significant effects on you. Booking eligibility is assessed by our team, not by automated systems.
            </p>

            {/* 10. Cookies */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">10. Cookies</h2>
            <p className="text-gray-700 mb-6">
              Our website uses only essential cookies required for core functionality (such as session management and payment processing). We do not use tracking cookies, analytics cookies, or third-party advertising cookies without your explicit consent.
            </p>

            {/* 11. Your Rights */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">11. Your rights</h2>
            <p className="text-gray-700 mb-4">
              Under GDPR and Norwegian privacy law, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
              <li><strong>Access:</strong> request a copy of the personal data we hold about you</li>
              <li><strong>Rectification:</strong> request correction of inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> request deletion of your data where we no longer have a legal basis to retain it</li>
              <li><strong>Restriction:</strong> request that we limit how we process your data in certain circumstances</li>
              <li><strong>Portability:</strong> receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> object to processing based on legitimate interests</li>
              <li><strong>Withdraw consent:</strong> withdraw marketing consent at any time without affecting prior processing</li>
            </ul>
            <p className="text-gray-700 mb-6">
              To exercise any of these rights, contact us at <a href="mailto:support@northventure-demo.com" className="text-primary-600 hover:underline">support@northventure-demo.com</a>. We will respond within 30 days. We may need to verify your identity before acting on a request.
            </p>

            {/* 12. Changes to This Policy */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">12. Changes to this policy</h2>
            <p className="text-gray-700 mb-6">
              We may update this Privacy Policy from time to time. When we do, we will update the &quot;Last updated&quot; date at the top of this page. For significant changes, we will notify affected customers by email where possible.
            </p>

            {/* 13. Contact and Complaints */}
            <h2 className="text-2xl font-bold text-aurora-900 mt-12 mb-4">13. Contact and complaints</h2>
            <p className="text-gray-700 mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, contact us:
            </p>
            <p className="text-gray-700 mb-6">
              <strong>NorthVenture</strong><br />
              Strandgaten 123, 5013 Bergen, Norway<br />
              Email: <a href="mailto:support@northventure-demo.com" className="text-primary-600 hover:underline">support@northventure-demo.com</a><br />
              Phone: <a href="tel:+4755512345" className="text-primary-600 hover:underline">+47 555 12 345</a>
            </p>
            <p className="text-gray-700 mb-6">
              If you are not satisfied with our response, you have the right to lodge a complaint with the Norwegian Data Protection Authority:
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Datatilsynet</strong><br />
              Postboks 458 Sentrum, 0105 Oslo, Norway<br />
              <a href="https://www.datatilsynet.no" className="text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">www.datatilsynet.no</a><br />
              Email: <a href="mailto:postkasse@datatilsynet.no" className="text-primary-600 hover:underline">postkasse@datatilsynet.no</a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
