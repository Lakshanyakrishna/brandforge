export default function BrandPreviewCard({ brandName, colors, fonts, logoPreviewUrl, toneOfVoice, mockup }) {
  const device = mockup?.device || 'none';
  const bgColor = mockup?.background || '#FFFFFF';
  const showShadow = mockup?.shadow !== false;

  const designContent = (
    <div
      className={`w-full h-full flex flex-col items-center justify-center text-center p-6 relative overflow-hidden transition-colors duration-200 ${
        device === 'none' ? 'rounded-2xl' : 'rounded-xl'
      }`}
      style={{ background: colors.primary, fontFamily: `'${fonts.body}', sans-serif` }}
    >
      {logoPreviewUrl && (
        <img
          src={logoPreviewUrl}
          alt="Logo"
          className="w-10 h-10 rounded-lg object-contain bg-white/20 mb-3"
        />
      )}
      <h2
        className="text-lg font-bold leading-tight mb-1.5 transition-colors duration-200"
        style={{ color: colors.secondary, fontFamily: `'${fonts.heading}', sans-serif` }}
      >
        {brandName || 'Your Headline'}
      </h2>
      <p className="text-xs text-white/90 mb-3 max-w-[90%]">
        Your on-brand caption appears here.
      </p>
      <span
        className="inline-block text-[11px] font-semibold text-white px-3 py-1.5 rounded-full transition-colors duration-200"
        style={{ background: colors.accent }}
      >
        Shop Now
      </span>
      <span className="absolute bottom-3 text-[10px] text-white/70">{brandName || 'Brand Name'}</span>
    </div>
  );

  function renderDeviceFrame() {
    if (device === 'none') {
      return (
        <div className={showShadow ? 'shadow-xl' : ''}>
          {designContent}
        </div>
      );
    }

    const isPhone = device === 'iphone' || device === 'android';
    const isDesktop = device === 'desktop';
    const isTablet = device === 'tablet';

    let frameClass = '';
    let contentClass = '';

    if (isPhone) {
      frameClass = 'rounded-[2rem] border-4 border-gray-800 p-2';
      contentClass = 'rounded-xl overflow-hidden';
    } else if (isTablet) {
      frameClass = 'rounded-[1.5rem] border-4 border-gray-800 p-2';
      contentClass = 'rounded-xl overflow-hidden';
    } else if (isDesktop) {
      frameClass = 'rounded-xl border-4 border-gray-800 p-2';
      contentClass = 'rounded-lg overflow-hidden';
    }

    const aspectRatio = isDesktop ? 'aspect-video' : isTablet ? 'aspect-[4/3]' : 'aspect-[9/16]';
    const maxW = isDesktop ? 'max-w-xs' : isPhone ? 'max-w-[180px]' : 'max-w-[220px]';

    return (
      <div className={`flex justify-center ${showShadow ? 'drop-shadow-2xl' : ''}`}>
        <div className={`${frameClass} bg-gray-900 ${maxW} w-full`}>
          {isPhone && (
            <div className="flex justify-center mb-1">
              <div className="w-20 h-1.5 bg-gray-700 rounded-full" />
            </div>
          )}
          <div className={contentClass}>
            {designContent}
          </div>
          {isDesktop && (
            <div className="flex justify-center mt-1 gap-1">
              <div className="w-2 h-2 bg-gray-700 rounded-full" />
              <div className="w-2 h-2 bg-gray-700 rounded-full" />
              <div className="w-2 h-2 bg-gray-700 rounded-full" />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-6">
      <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide mb-2">Live Preview</p>
      <div
        className="rounded-2xl p-6 flex items-center justify-center min-h-[320px] transition-colors duration-200"
        style={{ background: bgColor }}
      >
        {renderDeviceFrame()}
      </div>
      {toneOfVoice && (
        <p className="text-xs text-on-surface-variant mt-3 italic line-clamp-2">"{toneOfVoice}"</p>
      )}
    </div>
  );
}
