// Mirrors the layout of the actual generated design (src/templates/design.template.js
// on the backend: dark card, heading in secondary color, body in white,
// pill CTA in accent, logo + brand name) so what the user sees here is an
// honest preview of what a real generated post will look like.
export default function BrandPreviewCard({ brandName, colors, fonts, logoPreviewUrl, toneOfVoice }) {
  return (
    <div className="sticky top-6">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Live Preview</p>
      <div
        className="aspect-square w-full rounded-2xl shadow-sm flex flex-col items-center justify-center text-center p-8 relative overflow-hidden transition-colors duration-200"
        style={{ background: colors.primary, fontFamily: `'${fonts.body}', sans-serif` }}
      >
        {logoPreviewUrl && (
          <img
            src={logoPreviewUrl}
            alt="Logo"
            className="w-12 h-12 rounded-lg object-contain bg-white mb-4"
          />
        )}
        <h2
          className="text-2xl font-bold leading-tight mb-2 transition-colors duration-200"
          style={{ color: colors.secondary, fontFamily: `'${fonts.heading}', sans-serif` }}
        >
          {brandName || 'Your Headline Here'}
        </h2>
        <p className="text-sm text-white/90 mb-4 max-w-[85%]">
          Your on-brand caption will appear here, matching your tone of voice.
        </p>
        <span
          className="inline-block text-xs font-semibold text-white px-4 py-2 rounded-full transition-colors duration-200"
          style={{ background: colors.accent }}
        >
          Shop Now
        </span>
        <span className="absolute bottom-4 text-[11px] text-white/70">{brandName || 'Brand Name'}</span>
      </div>
      {toneOfVoice && (
        <p className="text-xs text-gray-400 mt-3 italic line-clamp-2">"{toneOfVoice}"</p>
      )}
    </div>
  );
}
