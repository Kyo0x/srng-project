'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
  aspectRatio?: 'video' | 'square' | 'wide';
  onImageClick?: (e: React.MouseEvent, index: number) => void;
  sizes?: string;
  quality?: number;
  unoptimized?: boolean;
  objectFit?: 'cover' | 'contain';
}

export const ImageCarousel = ({
  images,
  alt,
  className = '',
  aspectRatio = 'video',
  onImageClick,
  sizes,
  quality = 100,
  unoptimized = false,
  objectFit = 'cover',
}: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter out empty strings
  const validImages = images.filter((img) => img && img.trim() !== '');

  // Minimum swipe distance (in px)
  const minSwipeDistance = 30;

  const goToNext = useCallback(() => {
    if (validImages.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  }, [validImages.length]);

  const goToPrevious = useCallback(() => {
    if (validImages.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
  }, [validImages.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Touch handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const currentX = e.targetTouches[0].clientX;
    setTouchEnd(currentX);
    // Mark as swiping if moved more than 10px
    if (touchStart && Math.abs(currentX - touchStart) > 10) {
      setIsSwiping(true);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart) return;

    if (touchEnd !== null) {
      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        goToNext();
      } else if (isRightSwipe) {
        goToPrevious();
      }
    }

    // Reset touch state after a short delay to allow click to check isSwiping
    setTimeout(() => {
      setIsSwiping(false);
    }, 100);
    setTouchStart(null);
    setTouchEnd(null);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't trigger click if user was swiping
    if (isSwiping) {
      return;
    }
    // Only trigger if we have a click handler
    if (onImageClick) {
      onImageClick(e, currentIndex);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return;

      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const aspectRatioClass = {
    video: 'aspect-video',
    square: 'aspect-square',
    wide: 'aspect-[16/9]',
  }[aspectRatio];

  if (validImages.length === 0) {
    return (
      <div
        className={`relative bg-gradient-to-br from-gray-100 to-gray-200 ${aspectRatioClass} w-full flex items-center justify-center ${className}`}
      >
        <span className="text-gray-400">No images</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative group ${aspectRatioClass} w-full overflow-hidden ${onImageClick ? 'cursor-pointer' : ''} ${className}`}
      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
      onClick={handleClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
      role="region"
      aria-label={`Image carousel for ${alt}`}
      aria-roledescription="carousel"
    >
      {/* Images */}
      <div
        className="flex transition-transform duration-300 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {validImages.map((src, index) => (
          <div
            key={index}
            className="relative w-full h-full flex-shrink-0"
            aria-hidden={index !== currentIndex}
          >
            <Image
              src={src}
              alt={`${alt} - Image ${index + 1}`}
              fill
              sizes={sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              className={objectFit === 'contain' ? 'object-contain' : 'object-cover'}
              priority={index === 0}
              quality={quality}
              unoptimized={unoptimized}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows - only show if more than 1 image */}
      {validImages.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.blur();
              goToPrevious();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary-700 hover:text-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:bg-primary-700 active:text-white outline-none focus:outline-none"
            aria-label="Previous image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.currentTarget.blur();
              goToNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-primary-700 hover:text-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg opacity-70 sm:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:bg-primary-700 active:text-white outline-none focus:outline-none"
            aria-label="Next image"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToIndex(index);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-white w-4'
                    : 'bg-white/60 hover:bg-white/80'
                }`}
                aria-label={`Go to image ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
              />
            ))}
          </div>

          {/* Image Counter */}
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {validImages.length}
          </div>
        </>
      )}
    </div>
  );
};
