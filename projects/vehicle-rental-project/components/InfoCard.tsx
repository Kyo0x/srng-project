interface InfoCardProps {
  title: string
  description: string
  borderColor?: 'primary' | 'secondary' | 'accent'
}

export const InfoCard = ({ title, description, borderColor = 'primary' }: InfoCardProps) => {
  const borderColorClass = {
    primary: 'border-primary-600',
    secondary: 'border-secondary-600',
    accent: 'border-accent-600',
  }[borderColor]

  return (
    <div className={`border-l-4 ${borderColorClass} pl-6 py-4`}>
      <h3 className="text-lg font-bold text-aurora-900 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}
