interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, icon }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      {icon && (
        <div className="mx-auto w-16 h-16 mb-4 text-gray-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-600">{description}</p>
      )}
    </div>
  );
}
