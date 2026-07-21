export default function Card({ title, description, action, children, className = '', bodyClassName = 'p-6' }) {
  return (
    <div className={`bg-surface-container-low rounded-2xl border border-surface-variant ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between px-6 pt-5 pb-1">
          <div>
            {title && <h3 className="text-base font-semibold text-on-background">{title}</h3>}
            {description && <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </div>
  );
}
