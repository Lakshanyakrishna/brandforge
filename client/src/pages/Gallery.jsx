import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Download, Trash2, Image as ImageIcon, Sparkles } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import Badge from '../components/Badge';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function Gallery({ navigate }) {
  const [designs, setDesigns] = useState(null);
  // Design records only store a brandKit ID, not a populated name — this
  // fetches brand kits alongside designs and joins them client-side rather
  // than touching the backend's populate behavior.
  const [brandKitNames, setBrandKitNames] = useState({});

  function load() {
    Promise.all([api.get('/designs'), api.get('/brandkits')]).then(([designsRes, brandKitsRes]) => {
      setDesigns(designsRes.data.data);
      const names = {};
      brandKitsRes.data.data.forEach((kit) => { names[kit._id] = kit.brandName; });
      setBrandKitNames(names);
    }).catch(() => setDesigns([]));
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id) {
    try {
      await api.delete(`/designs/${id}`);
      toast.success('Design deleted');
      load();
    } catch {
      toast.error('Failed to delete design');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Gallery</h1>
      <p className="text-sm text-gray-500 mb-6">Every design you've generated, in one place.</p>

      {designs === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="aspect-square" />)}
        </div>
      ) : designs.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No designs yet"
          description="Generate your first on-brand design to see it here."
          action={<Button icon={Sparkles} onClick={() => navigate('Generate')}>Generate a Design</Button>}
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {designs.map((design) => (
            <Card key={design._id} bodyClassName="p-0" className="group overflow-hidden">
              <img src={design.imageUrl} alt={design.prompt} className="w-full aspect-square object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {brandKitNames[design.brandKit] && (
                    <Badge tone="indigo">{brandKitNames[design.brandKit]}</Badge>
                  )}
                  {design.platform && <Badge tone="gray">{design.platform}</Badge>}
                </div>
                <p className="text-sm text-gray-700 truncate mb-1">{design.prompt}</p>
                <p className="text-xs text-gray-400 mb-3">{formatDate(design.createdAt)}</p>
                <div className="flex gap-2">
                  <a href={design.imageUrl} download target="_blank" rel="noreferrer" className="flex-1">
                    <Button variant="secondary" size="sm" icon={Download} className="w-full">Download</Button>
                  </a>
                  <Button variant="destructive" size="sm" icon={Trash2} onClick={() => handleDelete(design._id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
