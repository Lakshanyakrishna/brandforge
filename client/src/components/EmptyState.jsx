export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-gray-200 rounded-2xl">
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-indigo-500" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
