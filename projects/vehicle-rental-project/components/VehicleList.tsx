'use client';

import { VehicleCard } from './VehicleCard';
import { useVehicles } from '@/hooks';
import { ErrorDisplay } from './ErrorDisplay';
import { VehicleListSkeleton } from './Skeleton';

export const VehicleList = () => {
  const { data: vehicles, loading, error, refetch } = useVehicles();

  if (loading) {
    return <VehicleListSkeleton count={6} />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={refetch} />;
  }

  if (!Array.isArray(vehicles) || vehicles.length === 0) {
    return (
      <div className="p-4 text-gray-500 text-center">
        No vehicles available. Please check back later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} linkTo="/our-cars" enableLightbox />
      ))}
    </div>
  );
};
