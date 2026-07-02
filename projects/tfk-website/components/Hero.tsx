import Image from 'next/image'

export default function Hero() {
  // the current image works fine on mobile
  // but might be nice to have a portrait version someday
  return (
    <div className="relative h-[60vh] min-h-[400px] max-h-[600px] flex items-center justify-center">
      <Image
        src="/homepage-picture.jpg"
        alt="Fuglehund i jaktterreng"
        fill
        priority
        fetchPriority="high"
        quality={90}
        sizes="100vw"
        className="object-cover"
        loading="eager"
        style={{ objectPosition: 'center 40%' }}
      />
      <div className="absolute inset-0 bg-black/40 z-[1]" />
      
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Velkommen til Demo Hunting Club
        </h1>
        <p className="text-xl md:text-2xl">
          Din arena for jakt, trening og fellesskap
        </p>
      </div>
    </div>
  )
}
