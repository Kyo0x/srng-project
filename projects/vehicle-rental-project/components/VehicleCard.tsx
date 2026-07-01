import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { Vehicle } from '@/lib/types';
import { ImageCarousel } from './ImageCarousel';
import { PriceDisplay } from './PriceDisplay';
import { isPromoActive, isGroupPromoActive, getEffectivePrice } from '@/lib/utils';

interface VehicleCardProps {
  vehicle: Vehicle;
  totalPrice?: number;
  isClickable?: boolean;
  onSelect?: () => void;
  linkTo?: string;
  enableLightbox?: boolean;
  bookingStartDate?: string;
}

export const VehicleCard = ({
  vehicle,
  totalPrice,
  isClickable = false,
  onSelect,
  linkTo,
  enableLightbox = false,
  bookingStartDate,
}: VehicleCardProps) => {
  const router = useRouter();
  const [showLightbox, setShowLightbox] = useState(false);
  const [mounted, setMounted] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const promoDate = bookingStartDate || today;
  const promoActive = isPromoActive(vehicle, promoDate) || isGroupPromoActive(vehicle, promoDate);
  const effectivePrice = getEffectivePrice(vehicle, promoDate);
  const discountPct = promoActive ? Math.round((1 - effectivePrice / vehicle.price_per_day) * 100) : 0;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClick = () => {
    if (isClickable && onSelect) onSelect();
    else if (linkTo) router.push(linkTo);
  };

  const isInteractive = isClickable || !!linkTo;

  const openLightbox = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!showLightbox) {
      setShowLightbox(true);
    }
  };

  const closeLightbox = () => setShowLightbox(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle both old image_url and new image_urls format for backwards compatibility
  const images = vehicle.image_urls?.length
    ? vehicle.image_urls
    : (vehicle as any).image_url
    ? [(vehicle as any).image_url]
    : [];

  return (
    <div
      className={`group border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 ${
        isInteractive ? 'cursor-pointer hover:shadow-[0_4px_16px_rgba(15,58,92,0.15)] hover:border-primary-700' : ''
      }`}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={
        isInteractive
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClick();
            }
          : undefined
      }
      aria-label={`Vehicle: ${vehicle.name}`}
    >
      <ImageCarousel
        images={images}
        alt={vehicle.name}
        className="h-40 sm:h-48"
        onImageClick={enableLightbox ? openLightbox : undefined}
      />
      <div className="p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 tracking-tight">
          {vehicle.name}
        </h3>
        <p className="text-xs text-gray-400 italic mb-2 sm:mb-3">Colors may vary</p>
        <div className="flex flex-wrap gap-x-3 gap-y-1 mb-2 text-xs sm:text-sm text-gray-600">
          <span>{vehicle.seats} seats</span>
          <span>{vehicle.beds} beds</span>
          <span>{vehicle.drive_type}</span>
          <span>{vehicle.transmission}</span>
          {vehicle.has_heating && <span>Heated</span>}
        </div>
        <p className="text-xs text-green-600 font-medium mb-3 sm:mb-4">✓ Basic insurance included</p>
        <div className="flex justify-between items-end">
          <div>
            {promoActive ? (
              <>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm text-gray-400 line-through">{vehicle.price_per_day} kr</span>
                  <span className="px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-md">−{discountPct}%</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-primary-700">
                  {effectivePrice} kr
                </span>
              </>
            ) : (
              <span className="text-xl sm:text-2xl font-bold text-primary-700">
                {vehicle.price_per_day} kr
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">/day</span>
        </div>
        {promoActive && (
          <p className="mt-1.5 text-xs text-green-600 font-medium">+ 10% off for stays of 7+ days</p>
        )}
        {totalPrice !== undefined && (
          <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-primary-200/40">
            <span className="text-base sm:text-lg font-semibold text-primary-700">
              Total: <PriceDisplay amount={totalPrice} className="inline" approxClassName="text-xs text-gray-500 font-normal" />
            </span>
          </div>
        )}
      </div>

      {mounted && showLightbox && images.length > 0 && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 sm:bg-black/80"
          onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
          role="dialog"
          aria-modal="true"
          aria-label={`${vehicle.name} images`}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-2 text-white hover:text-gray-200 transition text-base sm:text-xl font-semibold bg-black/40 sm:bg-transparent px-3 py-2 sm:p-0 rounded-lg z-10"
            aria-label="Close image viewer"
          >
            <span className="text-2xl">✕</span>
            <span className="hidden sm:inline">Close</span>
          </button>

          {/* Image container */}
          <div
            className="w-full max-w-5xl px-2 sm:px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageCarousel
              images={images}
              alt={vehicle.name}
              className="max-h-[80vh]"
              aspectRatio="wide"
              sizes="100vw"
              quality={100}
              unoptimized
              objectFit="contain"
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
