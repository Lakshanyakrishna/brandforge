export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>}
      {children}
      {hint && !error && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
      {error && <span className="block text-xs text-red-600 mt-1">{error}</span>}
    </label>
  );
}

const baseInputClasses =
  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400';

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`${baseInputClasses} ${error ? 'border-red-300' : 'border-gray-200'} ${className}`}
      {...props}
    />
  );
}

export function Textarea({ error, className = '', ...props }) {
  return (
    <textarea
      className={`${baseInputClasses} resize-none ${error ? 'border-red-300' : 'border-gray-200'} ${className}`}
      {...props}
    />
  );
}
