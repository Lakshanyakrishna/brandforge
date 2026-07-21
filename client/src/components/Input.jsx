export function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      {label && <span className="block text-sm font-medium text-on-surface mb-1.5">{label}</span>}
      {children}
      {hint && !error && <span className="block text-xs text-on-surface-variant mt-1">{hint}</span>}
      {error && <span className="block text-xs text-error mt-1">{error}</span>}
    </label>
  );
}

const baseInputClasses =
  'w-full rounded-lg border px-3.5 py-2.5 text-sm text-on-background placeholder:text-on-surface-variant/50 transition-colors duration-150 outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-surface-container';

export function Input({ error, className = '', ...props }) {
  return (
    <input
      className={`${baseInputClasses} ${error ? 'border-error' : 'border-surface-variant'} ${className}`}
      {...props}
    />
  );
}

export function Textarea({ error, className = '', ...props }) {
  return (
    <textarea
      className={`${baseInputClasses} resize-none ${error ? 'border-error' : 'border-surface-variant'} ${className}`}
      {...props}
    />
  );
}
