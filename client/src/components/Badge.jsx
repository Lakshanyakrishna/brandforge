const TONES = {
  gray: 'bg-gray-100 text-gray-600',
  indigo: 'bg-indigo-50 text-indigo-600',
};

export default function Badge({ icon: Icon, tone = 'gray', children }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${TONES[tone]}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {children}
    </span>
  );
}
