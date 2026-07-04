import { useEffect, useState } from 'react';
import { Palette, Sparkles, ArrowRight } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <Card className="flex-1">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          {loading ? (
            <Skeleton className="h-7 w-10 mt-1" />
          ) : (
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          )}
        </div>
      </div>
    </Card>
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">A quick overview of your brand and designs.</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <StatCard icon={Palette} label="Brand Kits" value={brandKitCount} loading={brandKitCount === null} />
        <StatCard icon={Sparkles} label="Designs Generated" value={designCount} loading={designCount === null} />
      </div>

      <Card title="Quick actions">
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" icon={Palette} onClick={() => navigate('Brand Kits')}>
            Manage Brand Kits
          </Button>
          <Button icon={Sparkles} onClick={() => navigate('Generate')}>
            Generate a Design
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
