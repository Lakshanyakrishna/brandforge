import { useEffect, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import toast from 'react-hot-toast';
import { UploadCloud, X, Pencil, Trash2, Palette, Type as TypeIcon, MessageSquare, Sparkles } from 'lucide-react';
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
import { extractPaletteFromFile } from '../lib/extractColors';

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
});

export default function BrandKit() {
  const [brandKits, setBrandKits] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState(null);
  const [extractedColors, setExtractedColors] = useState(null);
  const [extracting, setExtracting] = useState(false);
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

  async function handleLogoChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
    setExtractedColors(null);
    setExtracting(true);
    try {
      const palette = await extractPaletteFromFile(file, 5);
      setExtractedColors(palette);
    } catch {
      // Extraction is a nice-to-have; a failure just means no suggestions.
    } finally {
      setExtracting(false);
    }
  }

  function removeLogo() {
    setLogoFile(null);
    setLogoPreviewUrl(null);
    setExtractedColors(null);
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
    });
    setLogoFile(null);
    setLogoPreviewUrl(kit.logoUrl || null);
    setExtractedColors(null);
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
      const data = new FormData();
      data.append('brandName', form.brandName);
      data.append('primaryColor', form.colors.primary);
      data.append('secondaryColor', form.colors.secondary);
      data.append('accentColor', form.colors.accent);
      data.append('headingFont', form.fonts.heading);
      data.append('bodyFont', form.fonts.body);
      data.append('toneOfVoice', form.toneOfVoice);
      if (logoFile) data.append('logo', logoFile);

      if (editingId) {
        await api.put(`/brandkits/${editingId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Brand kit updated');
      } else {
        await api.post('/brandkits', data, { headers: { 'Content-Type': 'multipart/form-data' } });
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Brand Kits</h1>
      <p className="text-sm text-gray-500 mb-6">
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

          <Card title="Logo" description="Upload a logo to get color suggestions automatically.">
            {logoPreviewUrl ? (
              <div className="flex items-center gap-4">
                <img src={logoPreviewUrl} alt="Logo preview" className="w-16 h-16 rounded-xl object-contain border border-gray-100 bg-white" />
                <div className="flex-1">
                  {extracting && <p className="text-xs text-gray-400">Extracting colors…</p>}
                  {!extracting && extractedColors && (
                    <p className="text-xs text-gray-500">Suggested colors ready below.</p>
                  )}
                </div>
                <Button type="button" variant="ghost" size="sm" icon={X} onClick={removeLogo}>
                  Remove
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 border border-dashed border-gray-200 rounded-xl py-8 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors duration-150">
                <UploadCloud className="w-6 h-6 text-gray-400" />
                <span className="text-sm text-gray-500">Click to upload a logo</span>
                <span className="text-xs text-gray-400">PNG or JPG, up to 5MB</span>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
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
                    activeSlot === slot ? 'border-indigo-500' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="w-full h-9 rounded-lg mb-2" style={{ background: form.colors[slot] }} />
                  <p className="text-xs font-medium text-gray-600 capitalize">{slot}</p>
                  <p className="text-[11px] text-gray-400 uppercase">{form.colors[slot]}</p>
                </button>
              ))}
            </div>

            <p className="text-xs font-medium text-gray-500 mb-2">Presets</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
              {PRESET_PALETTES.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => applyPalette(p)}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg border border-gray-100 hover:border-gray-300 transition-colors duration-150"
                >
                  <span className="flex -space-x-1 shrink-0">
                    <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: p.primary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: p.secondary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white" style={{ background: p.accent }} />
                  </span>
                  <span className="text-xs text-gray-600 truncate">{p.name}</span>
                </button>
              ))}
            </div>

            {extractedColors && (
              <div className="mb-5">
                <p className="text-xs font-medium text-gray-500 mb-2">
                  Suggested from your logo — click to set <span className="capitalize font-semibold">{activeSlot}</span>
                </p>
                <div className="flex gap-2">
                  {extractedColors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      title={hex}
                      onClick={() => setSlotColor(hex)}
                      className="w-8 h-8 rounded-full border border-gray-200 hover:scale-110 transition-transform duration-150"
                      style={{ background: hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">
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
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-150"
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
        />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Brand Kits</h2>
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
                    <img src={kit.logoUrl} alt={kit.brandName} className="w-10 h-10 rounded-lg object-contain border border-gray-100" />
                  ) : (
                    <div className="flex -space-x-1">
                      <span className="w-4 h-4 rounded-full border border-white" style={{ background: kit.colors.primary }} />
                      <span className="w-4 h-4 rounded-full border border-white" style={{ background: kit.colors.secondary }} />
                      <span className="w-4 h-4 rounded-full border border-white" style={{ background: kit.colors.accent }} />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{kit.brandName}</p>
                    <p className="text-xs text-gray-400 truncate flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" /> {kit.fonts.heading} / {kit.fonts.body}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 flex items-start gap-1 line-clamp-2">
                  <MessageSquare className="w-3 h-3 mt-0.5 shrink-0" /> {kit.toneOfVoice}
                </p>
              </div>
              <div className="flex border-t border-gray-100">
                <button
                  onClick={() => startEdit(kit)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 py-2.5 transition-colors duration-150"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(kit._id)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-red-600 hover:bg-red-50 py-2.5 transition-colors duration-150 border-l border-gray-100"
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
