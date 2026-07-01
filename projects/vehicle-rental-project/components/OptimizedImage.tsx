'use client';

import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  className = '',
  containerClassName = '',
  fallback,
  onLoad,
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError || !src) {
    return fallback ? (
      <>{fallback}</>
    ) : (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${containerClassName}`}>
        <span>No image</span>
      </div>
    );
  }

  const imageProps = fill
    ? { fill: true, sizes }
    : { width: width || 400, height: height || 300 };

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={src}
        alt={alt}
        {...imageProps}
        priority={priority}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

// Preset configurations for common use cases
export const VehicleImage = ({ 
  src, 
  alt, 
  className = '',
  priority = false 
}: { 
  src: string; 
  alt: string; 
  className?: string;
  priority?: boolean;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    priority={priority}
    className={`object-cover ${className}`}
    containerClassName="w-full h-48"
    fallback={
      <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-400">
        No image
      </div>
    }
  />
);

export const HeroImage = ({ 
  src, 
  alt,
  className = '' 
}: { 
  src: string; 
  alt: string;
  className?: string;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    sizes="100vw"
    priority={true}
    className={`object-cover ${className}`}
    containerClassName="w-full h-full"
  />
);

export const ThumbnailImage = ({ 
  src, 
  alt,
  size = 64 
}: { 
  src: string; 
  alt: string;
  size?: number;
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className="object-cover rounded"
    containerClassName={`w-[${size}px] h-[${size}px]`}
  />
);
