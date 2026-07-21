import { useEffect, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';
import { UploadCloud, X, Pencil, Trash2, Palette, Type as TypeIcon, MessageSquare, Sparkles, Smartphone, Monitor, Tablet, Sun, RefreshCw } from 'lucide-react';
import api from '../api';
import Card from '../components/Card';
import Button from '../components/Button';
import Skeleton from '../components/Skeleton';
import EmptyState from '../components/EmptyState';
import { Field, Input, Textarea } from '../components/Input';
import FontPicker from '../components/FontPicker';
import BrandPreviewCard from '../components/BrandPreviewCard';
import { PRESET_PALETTES } from '../lib/palettes';
import { ensureGoogleFontsLoaded } from '../lib/fonts';
import { INDUSTRIES } from '../lib/industries';
const DEFAULT_COLORS = { primary: '#0F172A', secondary: '#2563EB', accent: '#38BDF8' };
const DEFAULT_FONTS = { heading: 'Poppins', body: 'Inter' };
const TONE_SUGGESTIONS = [
  'Bold, energetic, and confident',
  'Elegant, warm, and confident',
  'Fun, playful, and youthful',
  'Professional and trustworthy',
];

const emptyForm = () => ({
  brandName: '',
  colors: { ...DEFAULT_COLORS },
  fonts: { ...DEFAULT_FONTS },
  toneOfVoice: '',
  mockup: { device: 'none', background: '#FFFFFF', shadow: true },
});

export default function BrandKit() {
  const [brandKits, setBrandKits] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [activeSlot, setActiveSlot] = useState('primary');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    ensureGoogleFontsLoaded();
    loadBrandKits();
  }, []);

  function loadBrandKits() {
    api.get('/brandkits').then((res) => setBrandKits(res.data.data)).catch(() => setBrandKits([]));
  }

  const [logoDescription, setLogoDescription] = useState('');
  const [logoIndustry, setLogoIndustry] = useState('food');

  async function handleGenerateLogo() {
    if (!form.brandName.trim()) {
      toast.error('Enter a brand name first');
      return;
    }
    setGeneratingLogo(true);
    try {
      const res = await api.post('/brandkits/generate-logo', {
        brandName: form.brandName,
        toneOfVoice: form.toneOfVoice || 'Professional and trustworthy',
        primaryColor: form.colors.primary,
        secondaryColor: form.colors.secondary,
        accentColor: form.colors.accent,
        description: logoDescription,
        industry: logoIndustry,
      });
      setLogoPreviewUrl(res.data.data.url);
      toast.success('Logo generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate logo');
    } finally {
      setGeneratingLogo(false);
    }
  }

  function removeLogo() {
    setLogoPreviewUrl(null);
    setLogoDescription('');
    setLogoIndustry('food');
  }

  function applyPalette(palette) {
    setForm((f) => ({
      ...f,
      colors: { primary: palette.primary, secondary: palette.secondary, accent: palette.accent },
    }));
    toast.success(`${palette.name} palette applied`);
  }

  function setSlotColor(hex) {
    setForm((f) => ({ ...f, colors: { ...f.colors, [activeSlot]: hex } }));
  }

  function startEdit(kit) {
    setEditingId(kit._id);
    setForm({
      brandName: kit.brandName,
      colors: { ...kit.colors },
      fonts: { ...kit.fonts },
      toneOfVoice: kit.toneOfVoice,
      mockup: kit.mockup || { device: 'none', background: '#FFFFFF', shadow: true },
    });
    setLogoPreviewUrl(kit.logoUrl || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm());
    removeLogo();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.brandName.trim() || !form.toneOfVoice.trim()) {
      toast.error('Brand name and tone of voice are required');
      return;
    }

    setSubmitting(true);
    try {
      const data = {
        brandName: form.brandName,
        primaryColor: form.colors.primary,
        secondaryColor: form.colors.secondary,
        accentColor: form.colors.accent,
        headingFont: form.fonts.heading,
        bodyFont: form.fonts.body,
        toneOfVoice: form.toneOfVoice,
        mockupDevice: form.mockup.device,
        mockupBackground: form.mockup.background,
        mockupShadow: form.mockup.shadow,
      };
      if (logoPreviewUrl) data.logoUrl = logoPreviewUrl;

      if (editingId) {
        await api.put(`/brandkits/${editingId}`, data);
        toast.success('Brand kit updated');
      } else {
        await api.post('/brandkits', data);
        toast.success('Brand kit created');
      }
      cancelEdit();
      loadBrandKits();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save brand kit');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.delete(`/brandkits/${id}`);
      toast.success('Brand kit deleted');
      if (editingId === id) cancelEdit();
      loadBrandKits();
    } catch {
      toast.error('Failed to delete brand kit');
    }
  }

  const slots = useMemo(() => ['primary', 'secondary', 'accent'], []);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-on-background mb-1">Brand Kits</h1>
      <p className="text-sm text-on-surface-variant mb-6">
        Define your colors, fonts, and voice once — every generated design will stay on-brand.
      </p>

      <div className="grid lg:grid-cols-3 gap-6 mb-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <Card title="Brand Information">
            <Field label="Brand Name">
              <Input
                placeholder="e.g. Acme Corp"
                value={form.brandName}
                onChange={(e) => setForm((f) => ({ ...f, brandName: e.target.value }))}
                required
              />
            </Field>
          </Card>

          <Card title="Logo" description="Describe the logo you want and let AI generate it.">
            {logoPreviewUrl ? (
              <div className="flex items-center gap-4">
                <img src={logoPreviewUrl} alt="Logo preview" className="w-16 h-16 rounded-xl object-contain border border-surface-variant bg-surface-container" />
                <div className="flex-1">
                  <p className="text-xs text-on-surface-variant">AI-generated logo</p>
                </div>
                <Button type="button" variant="ghost" size="sm" icon={RefreshCw} onClick={handleGenerateLogo} loading={generatingLogo}>
                  Regenerate
                </Button>
                <Button type="button" variant="ghost" size="sm" icon={X} onClick={removeLogo}>
                  Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Industry">
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {INDUSTRIES.map((ind) => (
                      <button
                        key={ind.value}
                        type="button"
                        onClick={() => setLogoIndustry(ind.value)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg border-2 text-center transition-colors duration-150 ${
                          logoIndustry === ind.value ? 'border-primary bg-primary-container/20' : 'border-surface-variant hover:border-on-surface-variant'
                        }`}
                      >
                        <span className="text-lg">{ind.icon}</span>
                        <span className="text-[10px] font-medium text-on-surface leading-tight">{ind.label}</span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Description (optional)">
                  <Textarea
                    rows={2}
                    placeholder="e.g. A mountain peak with a rising sun, minimalist style"
                    value={logoDescription}
                    onChange={(e) => setLogoDescription(e.target.value)}
                  />
                </Field>
                <div className="flex flex-col items-center gap-3 rounded-xl py-4 border border-dashed border-surface-variant">
                  <UploadCloud className="w-8 h-8 text-on-surface-variant" />
                  <p className="text-sm text-on-surface-variant text-center max-w-xs">
                    Generate a unique logo for <span className="font-semibold text-on-surface">{form.brandName || 'your brand'}</span>.
                  </p>
                  <Button type="button" icon={Sparkles} onClick={handleGenerateLogo} loading={generatingLogo}>
                    Generate Logo
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <Card title="Colors" description="Pick a preset, use your logo's colors, or fine-tune manually.">
            <div className="grid grid-cols-3 gap-3 mb-5">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setActiveSlot(slot)}
                  className={`rounded-xl border-2 p-2.5 text-left transition-colors duration-150 ${
                    activeSlot === slot ? 'border-primary' : 'border-surface-variant hover:border-on-surface-variant'
                  }`}
                >
                  <div className="w-full h-9 rounded-lg mb-2" style={{ background: form.colors[slot] }} />
                  <p className="text-xs font-medium text-on-surface capitalize">{slot}</p>
                  <p className="text-[11px] text-on-surface-variant uppercase">{form.colors[slot]}</p>
                </button>
              ))}
            </div>

            <p className="text-xs font-medium text-on-surface-variant mb-2">Presets</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
              {PRESET_PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPalette(p)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-surface-variant hover:border-on-surface-variant transition-colors duration-150"
                >
                  <span className="flex -space-x-1 shrink-0">
                    <span className="w-3.5 h-3.5 rounded-full border border-surface-container" style={{ background: p.primary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-surface-container" style={{ background: p.secondary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-surface-container" style={{ background: p.accent }} />
                  </span>
                  <span className="text-xs text-on-surface truncate">{p.name}</span>
                </button>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-on-surface-variant mb-2">
                Custom — editing <span className="capitalize font-semibold">{activeSlot}</span>
              </p>
              <HexColorPicker
                color={form.colors[activeSlot]}
                onChange={setSlotColor}
                style={{ width: '100%', height: 140 }}
              />
              <Input
                className="mt-2 font-mono uppercase"
                value={form.colors[activeSlot]}
                onChange={(e) => setSlotColor(e.target.value)}
              />
            </div>
          </Card>

          <Card title="Typography">
            <div className="grid sm:grid-cols-2 gap-4">
              <FontPicker
                label="Heading Font"
                value={form.fonts.heading}
                onChange={(family) => setForm((f) => ({ ...f, fonts: { ...f.fonts, heading: family } }))}
              />
              <FontPicker
                label="Body Font"
                value={form.fonts.body}
                onChange={(family) => setForm((f) => ({ ...f, fonts: { ...f.fonts, body: family } }))}
              />
            </div>
          </Card>

          <Card title="Mockup" description="Choose how your designs are presented.">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-medium text-on-surface-variant mb-2">Device Frame</p>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { key: 'none', label: 'None', icon: UploadCloud },
                    { key: 'iphone', label: 'iPhone', icon: Smartphone },
                    { key: 'android', label: 'Android', icon: Smartphone },
                    { key: 'desktop', label: 'Desktop', icon: Monitor },
                    { key: 'tablet', label: 'Tablet', icon: Tablet },
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, mockup: { ...f.mockup, device: key } }))}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors duration-150 ${
                        form.mockup.device === key ? 'border-primary bg-primary-container/20' : 'border-surface-variant hover:border-on-surface-variant'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${form.mockup.device === key ? 'text-primary' : 'text-on-surface-variant'}`} />
                      <span className="text-[11px] font-medium text-on-surface">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-on-surface-variant mb-2">Background Color</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={form.mockup.background}
                      onChange={(e) => setForm((f) => ({ ...f, mockup: { ...f.mockup, background: e.target.value } }))}
                      className="w-10 h-10 rounded-lg border border-surface-variant cursor-pointer bg-transparent"
                    />
                    <Input
                      className="font-mono uppercase"
                      value={form.mockup.background}
                      onChange={(e) => setForm((f) => ({ ...f, mockup: { ...f.mockup, background: e.target.value } }))}
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-on-surface-variant mb-2">Shadow</p>
                  <div className="flex items-center gap-3 h-10">
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, mockup: { ...f.mockup, shadow: !f.mockup.shadow } }))}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-colors duration-150 ${
                        form.mockup.shadow ? 'border-primary bg-primary-container/20' : 'border-surface-variant'
                      }`}
                    >
                      <Sun className={`w-4 h-4 ${form.mockup.shadow ? 'text-primary' : 'text-on-surface-variant'}`} />
                      <span className="text-xs font-medium text-on-surface">{form.mockup.shadow ? 'On' : 'Off'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Tone of Voice">
            <Textarea
              rows={3}
              placeholder="e.g. Bold, energetic, and confident"
              value={form.toneOfVoice}
              onChange={(e) => setForm((f) => ({ ...f, toneOfVoice: e.target.value }))}
              required
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {TONE_SUGGESTIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, toneOfVoice: t }))}
                  className="text-xs px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors duration-150"
                >
                  {t}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex gap-3">
            <Button type="submit" loading={submitting} icon={editingId ? Pencil : Sparkles}>
              {editingId ? 'Save Changes' : 'Create Brand Kit'}
            </Button>
            {editingId && (
              <Button type="button" variant="secondary" onClick={cancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>

        <BrandPreviewCard
          brandName={form.brandName}
          colors={form.colors}
          fonts={form.fonts}
          logoPreviewUrl={logoPreviewUrl}
          toneOfVoice={form.toneOfVoice}
          mockup={form.mockup}
        />
      </div>

      <h2 className="text-lg font-semibold text-on-background mb-4">Your Brand Kits</h2>
      {brandKits === null ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : brandKits.length === 0 ? (
        <EmptyState
          icon={Palette}
          title="No brand kits yet"
          description="Create one above to start generating on-brand designs."
        />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {brandKits.map((kit) => (
            <Card key={kit._id} bodyClassName="p-0">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  {kit.logoUrl ? (
                    <img src={kit.logoUrl} alt={kit.brandName} className="w-10 h-10 rounded-lg object-contain border border-surface-variant" />
                  ) : (
                    <div className="flex -space-x-1">
                      <span className="w-4 h-4 rounded-full border border-surface-container" style={{ background: kit.colors.primary }} />
                      <span className="w-4 h-4 rounded-full border border-surface-container" style={{ background: kit.colors.secondary }} />
                      <span className="w-4 h-4 rounded-full border border-surface-container" style={{ background: kit.colors.accent }} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-on-background truncate">{kit.brandName}</p>
                    <p className="text-xs text-on-surface-variant truncate flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" /> {kit.fonts.heading} / {kit.fonts.body}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant flex items-start gap-1 line-clamp-2">
                  <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" /> {kit.toneOfVoice}
                </p>
              </div>
              <div className="flex border-t border-surface-variant">
                <button
                  onClick={() => startEdit(kit)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-on-surface-variant hover:bg-surface-container py-2.5 transition-colors duration-150"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(kit._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-error hover:bg-surface-container py-2.5 transition-colors duration-150 border-l border-surface-variant"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
