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
            page === key ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:bg-surface-container'
          }`}
        >
          <Icon className="w-[18px] h-[18px]" />
          {label}
        </button>
      ))}
    </nav>
  );
}

export default function Sidebar({ page, setPage, onLogout, mobileOpen, onCloseMobile }) {
  return (
    <>
      <aside className="hidden md:flex md:flex-col md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 border-r border-surface-variant bg-surface-container-low py-6">
        <div className="px-6 mb-8 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-1">
            <img src="/logo-icon.png" alt="" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-on-background">BrandForge</span>
        </div>
        <NavList page={page} setPage={setPage} />
        <div className="px-3 mt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors duration-150"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Logout
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/60" onClick={onCloseMobile} />
          <aside className="relative w-64 bg-surface-container-low h-full flex flex-col py-6 shadow-xl">
            <div className="px-6 mb-8 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center p-1">
                  <img src="/logo-icon.png" alt="" className="w-full h-full object-contain" />
                </div>
                <span className="font-semibold text-on-background">BrandForge</span>
              </div>
              <button onClick={onCloseMobile} className="text-on-surface-variant hover:text-on-surface">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavList page={page} setPage={setPage} onNavigate={onCloseMobile} />
            <div className="px-3 mt-4">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-error transition-colors duration-150"
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
