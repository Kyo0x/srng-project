import { generateBookingConfirmationPdf } from '../lib/pdf';
import { writeFileSync } from 'fs';

async function main() {
  const pdf = await generateBookingConfirmationPdf({
    bookingId: 42,
    uploadToken: 'BK-PREVIEW123',
    customerName: 'Ola Nordmann',
    vehicleName: 'Arctic Explorer Pro',
    startDate: '2026-05-01',
    endDate: '2026-05-08',
    insurance: 'premium',
    selectedExtras: { cleaning: 1, bedding: 2, towels: 2 },
    babySeats: 0,
    extraDriver: false,
    totalPrice: 15750,
  });

  writeFileSync('/tmp/receipt-preview.pdf', pdf);
  console.log('PDF written to /tmp/receipt-preview.pdf');
}

main();
