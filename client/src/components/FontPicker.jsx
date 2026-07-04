import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { GOOGLE_FONTS } from '../lib/fonts';

// A searchable Google Fonts dropdown — every option renders in its own
// actual typeface so the user sees the font before picking it, instead of
// typing a name blind and hoping it's spelled/supported correctly.
export default function FontPicker({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return GOOGLE_FONTS;
    return GOOGLE_FONTS.filter((f) => f.family.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="relative" ref={rootRef}>
      {label && <span className="block text-sm font-medium text-gray-700 mb-1.5">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-lg border border-gray-200 px-3.5 py-2.5 text-sm text-left bg-white hover:border-gray-300 transition-colors duration-150"
      >
        <span style={{ fontFamily: `'${value}', sans-serif` }}>{value || 'Select a font'}</span>
        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search fonts…"
              className="w-full text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <p className="text-sm text-gray-400 px-3.5 py-3">No fonts match "{query}"</p>
            )}
            {filtered.map((f) => (
              <button
                key={f.family}
                type="button"
                onClick={() => {
                  onChange(f.family);
                  setOpen(false);
                  setQuery('');
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-gray-50 text-left"
              >
                <span className="text-[15px]" style={{ fontFamily: `'${f.family}', sans-serif` }}>
                  {f.family}
                </span>
                {value === f.family ? (
                  <Check className="w-4 h-4 text-indigo-600 shrink-0" />
                ) : (
                  <span className="text-xs text-gray-400 shrink-0">{f.category}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
