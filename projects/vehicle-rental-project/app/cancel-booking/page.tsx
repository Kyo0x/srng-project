'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CancelBookingPage() {
  return (
    <Suspense>
      <CancelBookingRedirect />
    </Suspense>
  );
}

function CancelBookingRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const target = token ? `/modify-booking?token=${token}` : '/modify-booking';
    router.replace(target);
  }, [router, searchParams]);

  return null;
}
