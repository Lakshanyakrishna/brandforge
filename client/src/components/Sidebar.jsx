import { LayoutDashboard, Palette, Sparkles, Image, LogOut, X } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'Brand Kits', label: 'Brand Kits', icon: Palette },
  { key: 'Generate', label: 'Generate', icon: Sparkles },
  { key: 'Gallery', label: 'Gallery', icon: Image },
];

function NavList({ page, setPage, onNavigate }) {
  return (
    <nav className="flex-1 px-3 space-y-1">
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => {
            setPage(key);
            onNavigate?.();
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
            page === key ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Icon className="w-[18px] h-[18px]" />
          {label}
        </button>
      ))}
    </nav>
  );
}

// Desktop: fixed left sidebar. Mobile: slide-over drawer triggered by a
// hamburger button rendered in each page's mobile top bar (see App.jsx).
export default function Sidebar({ page, setPage, onLogout, mobileOpen, onCloseMobile }) {
  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-gray-100 bg-white py-6">
        <div className="px-6 mb-8 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-gray-900">BrandForge</span>
        </div>
        <NavList page={page} setPage={setPage} />
        <div className="px-3 mt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-gray-900/40" onClick={onCloseMobile} />
          <aside className="relative w-64 bg-white h-full flex flex-col py-6 shadow-xl">
            <div className="px-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">BrandForge</span>
              </div>
              <button onClick={onCloseMobile} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavList page={page} setPage={setPage} onNavigate={onCloseMobile} />
            <div className="px-3 mt-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150"
              >
                <LogOut className="w-[18px] h-[18px]" />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
