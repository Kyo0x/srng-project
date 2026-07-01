interface HeroSectionProps {
  title: string
  subtitle: string
  backgroundImage?: string
  backgroundGradient?: string
  height?: '40vh' | '50vh' | '60vh'
}

export const HeroSection = ({
  title,
  subtitle,
  backgroundImage,
  backgroundGradient,
  height = '40vh',
}: HeroSectionProps) => {
  const backgroundStyle = backgroundImage
    ? { backgroundImage: `url(${backgroundImage})` }
    : backgroundGradient
    ? {}
    : {}

  const backgroundClass = backgroundGradient
    ? backgroundGradient
    : backgroundImage
    ? 'bg-cover bg-center bg-no-repeat'
    : 'bg-gradient-to-br from-aurora-900 via-primary-800 to-primary-900'

  return (
    <section
      className={`relative flex items-center justify-center overflow-hidden ${backgroundClass}`}
      style={{ height, ...backgroundStyle }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-lg md:text-2xl text-white font-light drop-shadow">
          {subtitle}
        </p>
      </div>
    </section>
  )
}
