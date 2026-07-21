import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary: 'bg-primary-container text-on-primary-container hover:brightness-110 disabled:opacity-50',
  secondary: 'bg-surface-container text-on-surface border border-surface-variant hover:bg-surface-container-high disabled:opacity-50',
  ghost: 'text-on-surface-variant hover:bg-surface-container disabled:opacity-50',
  destructive: 'text-error hover:bg-surface-container disabled:opacity-50',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className = '',
  disabled,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  );
}
