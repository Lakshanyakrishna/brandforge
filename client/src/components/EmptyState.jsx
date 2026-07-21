export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-surface-variant rounded-2xl">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-on-primary-container" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-on-background">{title}</h3>
      {description && <p className="text-sm text-on-surface-variant mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
