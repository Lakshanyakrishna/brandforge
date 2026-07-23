import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Menu } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BrandKit from './pages/BrandKit';
import GenerateDesign from './pages/GenerateDesign';
import Gallery from './pages/Gallery';

// Navigation is plain state, not a router: Axios + a session cookie is
// all the auth this app needs, and a 5-page demo doesn't need URLs.
const PAGES = {
  Dashboard,
  'Brand Kits': BrandKit,
  Generate: GenerateDesign,
  Gallery,
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('isAuthenticated') === 'true'
  );
  const [page, setPage] = useState('Dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [authView, setAuthView] = useState('landing');

  function handleLogin() {
    localStorage.setItem('isAuthenticated', 'true');
    setIsAuthenticated(true);
  }

  function handleLogout() {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return (
      <>
        <Toaster position="top-center" />
        {authView === 'landing' ? (
          <Landing onGetStarted={() => setAuthView('register')} onLogin={() => setAuthView('login')} />
        ) : (
          <Login
            onLogin={handleLogin}
            onBack={() => setAuthView('landing')}
            initialMode={authView === 'register' ? 'register' : 'login'}
          />
        )}
      </>
    );
  }

  const Page = PAGES[page];

  return (
    <div className="md:flex min-h-screen bg-background text-on-background">
      <Toaster position="top-center" toastOptions={{ style: { fontSize: '14px' } }} />
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-surface-variant bg-surface-container-low sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center p-0.5">
              <img src="/logo-icon.png" alt="" className="w-full h-full object-contain" />
            </div>
            <span className="font-semibold text-on-background">BrandForge</span>
          </div>
          <button onClick={() => setMobileNavOpen(true)} className="text-on-surface-variant hover:text-on-surface">
            <Menu className="w-5 h-5" />
          </button>
        </header>

        <main className="p-5 md:p-10 max-w-6xl mx-auto">
          <Page navigate={setPage} />
        </main>
      </div>
    </div>
  );
}
