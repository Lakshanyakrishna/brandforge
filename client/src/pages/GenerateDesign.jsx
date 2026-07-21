import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Camera, Briefcase, Users, MessageCircle, Check, Sparkles, Download, RotateCcw, Palette } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import { Input } from '../components/Input';
import EmptyState from '../components/EmptyState';

const PLATFORMS = [
  { key: 'instagram', label: 'Instagram', icon: Camera },
  { key: 'linkedin', label: 'LinkedIn', icon: Briefcase },
  { key: 'facebook', label: 'Facebook', icon: Users },
  { key: 'twitter', label: 'Twitter', icon: MessageCircle },
];

const PROMPT_EXAMPLES = ['Diwali Sale, 30% OFF', 'New product launch', 'Weekend flash sale', 'Black Friday mega discount'];

const PROGRESS_MESSAGES = [
  'Reading your brand guidelines…',
  'Writing on-brand copy…',
  'Rendering your design…',
  'Almost ready…',
];

const STEPS = ['Brand Kit', 'Platform', 'Prompt'];

function Stepper({ step }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
              i < step ? 'bg-primary-container text-on-primary-container' : i === step ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
          </div>
          <span className={`text-sm ${i === step ? 'text-on-background font-medium' : 'text-on-surface-variant'}`}>{label}</span>
          {i < STEPS.length - 1 && <div className="w-8 h-px bg-surface-variant mx-1" />}
        </div>
      ))}
    </div>
  );
}

export default function GenerateDesign({ navigate }) {
  const [brandKits, setBrandKits] = useState(null);
  const [brandKitId, setBrandKitId] = useState(null);
  const [platform, setPlatform] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState(PROGRESS_MESSAGES[0]);
  const [result, setResult] = useState(null);
  const progressTimer = useRef(null);

  useEffect(() => {
    api.get('/brandkits').then((res) => setBrandKits(res.data.data)).catch(() => setBrandKits([]));
  }, []);

  useEffect(() => () => clearInterval(progressTimer.current), []);

  const step = brandKitId === null ? 0 : platform === null ? 1 : 2;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    let i = 0;
    setProgressMsg(PROGRESS_MESSAGES[0]);
    progressTimer.current = setInterval(() => {
      i = Math.min(i + 1, PROGRESS_MESSAGES.length - 1);
      setProgressMsg(PROGRESS_MESSAGES[i]);
    }, 3000);

    try {
      const res = await api.post('/generate', { brandKitId, prompt, platform });
      setResult(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Generation failed');
    } finally {
      clearInterval(progressTimer.current);
      setLoading(false);
    }
  }

  function generateAgain() {
    setResult(null);
    setPrompt('');
  }

  if (brandKits !== null && brandKits.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-semibold text-on-background mb-6">Generate Design</h1>
        <EmptyState
          icon={Palette}
          title="You need a brand kit first"
          description="Create a brand kit with your colors, fonts, and tone before generating designs."
          action={<Button icon={Palette} onClick={() => navigate('Brand Kits')}>Create a Brand Kit</Button>}
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-on-background mb-1">Generate Design</h1>
      <p className="text-sm text-on-surface-variant mb-6">Pick a brand kit, a platform, and describe what you want.</p>

      {!result && !loading && <Stepper step={step} />}

      {!result && !loading && (
        <div className="space-y-5 max-w-2xl">
          <Card title="1. Choose Brand Kit">
            {brandKits === null ? (
              <p className="text-sm text-on-surface-variant">Loading…</p>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {brandKits.map((kit) => (
                  <button
                    key={kit._id}
                    type="button"
                    onClick={() => setBrandKitId(kit._id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors duration-150 ${
                      brandKitId === kit._id ? 'border-primary bg-primary-container/20' : 'border-surface-variant hover:border-on-surface-variant'
                    }`}
                  >
                    <div className="flex -space-x-1 shrink-0">
                      <span className="w-4 h-4 rounded-full border border-surface-container" style={{ background: kit.colors.primary }} />
                      <span className="w-4 h-4 rounded-full border border-surface-container" style={{ background: kit.colors.secondary }} />
                      <span className="w-4 h-4 rounded-full border border-surface-container" style={{ background: kit.colors.accent }} />
                    </div>
                    <span className="text-sm font-medium text-on-surface truncate">{kit.brandName}</span>
                  </button>
                ))}
              </div>
            )}
          </Card>

          {brandKitId && (
            <Card title="2. Choose Platform">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLATFORMS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPlatform(key)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors duration-150 ${
                      platform === key ? 'border-primary bg-primary-container/20' : 'border-surface-variant hover:border-on-surface-variant'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${platform === key ? 'text-primary' : 'text-on-surface-variant'}`} />
                    <span className="text-xs font-medium text-on-surface">{label}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {brandKitId && platform && (
            <Card title="3. Enter Prompt">
              <form onSubmit={handleSubmit}>
                <Input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Diwali Sale, 30% OFF"
                  required
                />
                <div className="flex flex-wrap gap-2 mt-2 mb-4">
                  {PROMPT_EXAMPLES.map((ex) => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setPrompt(ex)}
                      className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors duration-150"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
                <Button type="submit" icon={Sparkles} size="lg" className="w-full sm:w-auto">
                  Generate Design
                </Button>
              </form>
            </Card>
          )}
        </div>
      )}

      {loading && (
        <Card className="max-w-lg">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-12 h-12 rounded-full border-4 border-surface-variant border-t-primary animate-spin mb-5" />
            <p className="text-sm font-medium text-on-background">{progressMsg}</p>
            <p className="text-xs text-on-surface-variant mt-1">This usually takes 10-20 seconds.</p>
          </div>
        </Card>
      )}

      {result && (
        <div className="max-w-lg">
          <Card>
            <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-1">Original Prompt</p>
            <p className="text-sm text-on-surface mb-4">{result.prompt}</p>
            <img src={result.imageUrl} alt="Generated design" className="w-full rounded-xl border border-surface-variant mb-5" />
            <div className="flex gap-3">
              <a href={result.imageUrl} download target="_blank" rel="noreferrer" className="flex-1">
                <Button icon={Download} className="w-full">Download</Button>
              </a>
              <Button variant="secondary" icon={RotateCcw} onClick={generateAgain}>
                Generate Again
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
