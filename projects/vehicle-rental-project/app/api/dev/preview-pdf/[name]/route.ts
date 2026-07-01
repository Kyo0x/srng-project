import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const SAMPLE_EXTRAS = { cleaning: 1, wifi: 2 };

const generators: Record<string, () => Promise<Buffer>> = {
  'booking-confirmation': async () => {
    const { generateBookingConfirmationPdf } = await import('@/lib/pdf');
    return generateBookingConfirmationPdf({
      bookingId: 42,
      customerName: 'Ola Nordmann',
      vehicleName: 'Arctic Explorer X1',
      startDate: '2026-06-01',
      endDate: '2026-06-10',
      insurance: 'premium',
      selectedExtras: SAMPLE_EXTRAS,
      totalPrice: 14500,
    });
  },
  'booking-updated': async () => {
    const { generateBookingUpdatedPdf } = await import('@/lib/pdf');
    return generateBookingUpdatedPdf({
      bookingId: 42,
      customerName: 'Ola Nordmann',
      vehicleName: 'Arctic Explorer X1',
      oldStartDate: '2026-06-01',
      oldEndDate: '2026-06-10',
      newStartDate: '2026-06-05',
      newEndDate: '2026-06-15',
      oldTotalPrice: 14500,
      newTotalPrice: 16000,
      priceDiff: 1500,
    });
  },
  'new-booking': async () => {
    const { generateAdminNewBookingPdf } = await import('@/lib/pdf');
    return generateAdminNewBookingPdf({
      bookingId: 42,
      customerName: 'Ola Nordmann',
      customerEmail: 'ola@example.com',
      vehicleName: 'Arctic Explorer X1',
      startDate: '2026-06-01',
      endDate: '2026-06-10',
      pickupTime: '10:00',
      insurance: 'premium',
      selectedExtras: SAMPLE_EXTRAS,
      totalPrice: 14500,
    });
  },
  'booking-cancellation': async () => {
    const { generateCancellationPdf } = await import('@/lib/pdf');
    return generateCancellationPdf({
      bookingId: 42,
      customerName: 'Ola Nordmann',
      vehicleName: 'Arctic Explorer X1',
      startDate: '2026-06-01',
      endDate: '2026-06-10',
      totalPrice: 14500,
      refundAmount: 7250,
      refundPercentage: 50,
      daysUntilStart: 24,
      cancelledBy: 'customer',
    });
  },
  'driver-registration': async () => {
    const { generateDriverReminderPdf } = await import('@/lib/pdf');
    return generateDriverReminderPdf({
      bookingId: 42,
      customerName: 'Ola Nordmann',
      vehicleName: 'Arctic Explorer X1',
      startDate: '2026-06-01',
      endDate: '2026-06-10',
    });
  },
  'booking-modified': async () => {
    const { generateAdminModificationPdf } = await import('@/lib/pdf');
    return generateAdminModificationPdf({
      bookingId: 42,
      customerName: 'Ola Nordmann',
      vehicleName: 'Arctic Explorer X1',
      oldStartDate: '2026-06-01',
      oldEndDate: '2026-06-10',
      newStartDate: '2026-06-05',
      newEndDate: '2026-06-15',
      oldTotalPrice: 14500,
      newTotalPrice: 16000,
      priceDiff: 1500,
      oldInsuranceType: 'basic',
      newInsuranceType: 'premium',
      oldSelectedExtras: { cleaning: 1 },
      newSelectedExtras: SAMPLE_EXTRAS,
    });
  },
};

export async function GET(_req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  if (process.env.NODE_ENV === 'production') {
    return new NextResponse('Not found', { status: 404 });
  }

  const { name } = await params;
  const generate = generators[name];

  if (!generate) {
    const available = Object.keys(generators).join(', ');
    return new NextResponse(`Unknown PDF "${name}". Available: ${available}`, { status: 404 });
  }

  try {
    const buffer = await generate();
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${name}.pdf"`,
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('Failed to generate PDF', { status: 500 });
  }
}
