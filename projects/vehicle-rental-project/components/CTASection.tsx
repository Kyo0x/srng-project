import Link from 'next/link'

interface CTASectionProps {
  title: string
  subtitle: string
  buttonText: string
  buttonHref?: string
  buttonOnClick?: () => void
  buttonVariant?: 'outline' | 'filled'
}

export const CTASection = ({
  title,
  subtitle,
  buttonText,
  buttonHref,
  buttonOnClick,
  buttonVariant = 'outline',
}: CTASectionProps) => {
  const buttonClass =
    buttonVariant === 'filled'
      ? 'inline-block bg-accent-500 hover:bg-accent-600 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95'
      : 'inline-block border-2 border-white text-white px-10 py-4 rounded-lg font-semibold text-lg transition-all duration-200 hover:bg-white/10 hover:scale-105 active:scale-95'

  return (
    <section className="bg-primary-800 py-16 md:py-20 px-4 md:px-8 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          {title}
        </h2>
        <p className="text-xl mb-8 text-primary-200">
          {subtitle}
        </p>
        {buttonHref ? (
          <Link href={buttonHref} className={buttonClass}>
            {buttonText}
          </Link>
        ) : (
          <button onClick={buttonOnClick} className={buttonClass}>
            {buttonText}
          </button>
        )}
      </div>
    </section>
  )
}
