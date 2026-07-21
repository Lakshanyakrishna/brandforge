import { useEffect, useState } from 'react';
import { Palette, Sparkles, Folder, Bolt, Grid2x2 } from 'lucide-react';
import api from '../api';
import Skeleton from '../components/Skeleton';

function MetricCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="bg-surface-container-low rounded-2xl border border-surface-variant p-6 flex flex-col justify-between h-44 relative overflow-hidden group hover:bg-surface-container transition-colors">
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-xl bg-primary-container flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-on-primary-container" />
        </div>
        <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest">{label}</p>
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        {loading ? (
          <Skeleton className="h-9 w-12 bg-surface-container-highest" />
        ) : (
          <span className="text-4xl font-bold text-on-background">{value}</span>
        )}
        <span className="text-sm text-on-surface-variant">Total</span>
      </div>
    </div>
  );
}

function QuickActionCard({ icon: Icon, title, description, variant, onClick }) {
  const isPrimary = variant === 'primary';
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-4 p-5 rounded-xl text-left transition-all active:scale-[0.98] ${
        isPrimary
          ? 'bg-primary-container text-on-primary-container shadow-lg hover:brightness-110'
          : 'bg-surface-container border border-surface-variant hover:bg-surface-container-high'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform ${
          isPrimary ? 'bg-white/10' : 'bg-surface-container-highest'
        }`}
      >
        <Icon className={`w-5 h-5 ${isPrimary ? 'text-on-primary-container' : 'text-primary'}`} />
      </div>
      <div>
        <p className={`font-semibold text-sm mb-1 ${isPrimary ? 'text-on-primary-container' : 'text-on-surface'}`}>{title}</p>
        <p className={`text-xs ${isPrimary ? 'opacity-80' : 'text-on-surface-variant'}`}>{description}</p>
      </div>
    </button>
  );
}

export default function Dashboard({ navigate }) {
  const [brandKitCount, setBrandKitCount] = useState(null);
  const [designCount, setDesignCount] = useState(null);

  useEffect(() => {
    api.get('/brandkits').then((res) => setBrandKitCount(res.data.data.length)).catch(() => setBrandKitCount(0));
    api.get('/designs').then((res) => setDesignCount(res.data.data.length)).catch(() => setDesignCount(0));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-background">Dashboard</h1>
        <p className="text-sm text-on-surface-variant mt-1">A quick overview of your brand and designs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <MetricCard icon={Palette} label="Brand Kits" value={brandKitCount} loading={brandKitCount === null} />
        <MetricCard icon={Sparkles} label="Designs Generated" value={designCount} loading={designCount === null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-surface-container-low rounded-2xl border border-surface-variant p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-on-background">Quick actions</h3>
            <Bolt className="w-5 h-5 text-on-surface-variant/30" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickActionCard
              icon={Folder}
              title="Manage Brand Kits"
              description="Organize and update your visual identity assets."
              onClick={() => navigate('Brand Kits')}
            />
            <QuickActionCard
              variant="primary"
              icon={Sparkles}
              title="Generate a Design"
              description="Start a new creative project with AI-powered tools."
              onClick={() => navigate('Generate')}
            />
          </div>
        </div>

        <div className="bg-surface-container-low rounded-2xl border border-surface-variant p-6 flex flex-col items-center justify-center text-center">
          <div className="w-full h-36 bg-surface-container rounded-xl flex items-center justify-center mb-4">
            <Grid2x2 className="w-12 h-12 text-surface-variant" />
          </div>
          <p className="text-sm font-semibold text-on-background mb-1">No activity yet</p>
          <p className="text-xs text-on-surface-variant max-w-[180px]">
            Your latest designs and brand updates will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
