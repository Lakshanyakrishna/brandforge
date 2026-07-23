// The one HTML template the MVP renders. Brand kit values (colors, fonts,
// logo) and Gemini's generated copy are interpolated into a fixed
// 1080x1080 editorial-ad layout, then screenshotted to PNG by
// renderer.service.js. Light background with brand color as accent (not
// full-bleed fill) so the layout reads well regardless of a brand kit's
// specific hex values.
function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildDesignHtml({ brandKit, content, photoDataUri }) {
    const { colors, fonts, logoUrl, brandName } = brandKit;
    const eyebrow = escapeHtml(content.eyebrow || 'NEW');
    const headline = escapeHtml(content.headline);
    const subheadline = escapeHtml(content.subheadline);
    const cta = escapeHtml(content.cta);

    const visual = photoDataUri
        ? `<img class="photo" src="${photoDataUri}" />`
        : `<div class="photo-fallback">${logoUrl ? `<img class="fallback-logo" src="${logoUrl}" />` : `<div class="fallback-mark">${escapeHtml((brandName || 'B').charAt(0).toUpperCase())}</div>`}</div>`;

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 1080px; height: 1080px; }
  .card {
    width: 1080px;
    height: 1080px;
    background: #ffffff;
    display: flex;
    position: relative;
    overflow: hidden;
    font-family: '${fonts.body}', 'Helvetica Neue', Arial, sans-serif;
  }
  .dot-grid {
    position: absolute;
    top: 640px;
    left: 520px;
    width: 140px;
    height: 140px;
    background-image: radial-gradient(${colors.secondary} 3px, transparent 3px);
    background-size: 22px 22px;
    opacity: 0.35;
  }
  .blob {
    position: absolute;
    top: 60px;
    right: -120px;
    width: 620px;
    height: 620px;
    border-radius: 50%;
    background: ${colors.accent};
    opacity: 0.18;
    filter: blur(10px);
  }
  .content {
    position: relative;
    z-index: 2;
    width: 560px;
    padding: 80px 0 80px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  .logo { width: 56px; height: 56px; object-fit: contain; border-radius: 12px; background: #fff; margin-bottom: 48px; }
  .eyebrow {
    font-size: 26px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #1a1a1a;
    margin-bottom: 18px;
  }
  .underline {
    width: 90px;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(90deg, ${colors.secondary}, ${colors.accent});
    margin-bottom: 40px;
  }
  .headline {
    font-family: '${fonts.heading}', 'Helvetica Neue', Arial, sans-serif;
    color: #12141c;
    font-size: 84px;
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.02em;
    margin-bottom: 32px;
  }
  .subheadline {
    color: #4a4d57;
    font-size: 30px;
    line-height: 1.45;
    margin-bottom: 56px;
    max-width: 440px;
  }
  .cta {
    display: inline-flex;
    align-self: flex-start;
    background: #12141c;
    color: #ffffff;
    font-size: 30px;
    font-weight: 700;
    padding: 22px 52px;
    border-radius: 999px;
  }
  .visual {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px;
  }
  .photo {
    max-width: 100%;
    max-height: 780px;
    object-fit: contain;
    filter: drop-shadow(0 30px 40px rgba(0,0,0,0.18));
  }
  .photo-fallback {
    width: 380px;
    height: 380px;
    border-radius: 32px;
    background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 30px 40px rgba(0,0,0,0.15);
  }
  .fallback-logo { width: 160px; height: 160px; object-fit: contain; border-radius: 24px; background: rgba(255,255,255,0.9); padding: 16px; }
  .fallback-mark {
    width: 160px;
    height: 160px;
    border-radius: 24px;
    background: rgba(255,255,255,0.9);
    color: ${colors.primary};
    font-family: '${fonts.heading}', 'Helvetica Neue', Arial, sans-serif;
    font-size: 84px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .brand {
    position: absolute;
    z-index: 2;
    bottom: 40px;
    left: 80px;
    color: #8a8d99;
    font-size: 22px;
    font-weight: 600;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="blob"></div>
    <div class="dot-grid"></div>
    <div class="content">
      ${logoUrl ? `<img class="logo" src="${logoUrl}" />` : ''}
      <div class="eyebrow">${eyebrow}</div>
      <div class="underline"></div>
      <div class="headline">${headline}</div>
      <div class="subheadline">${subheadline}</div>
      <div class="cta">${cta}</div>
    </div>
    <div class="visual">${visual}</div>
    <div class="brand">${escapeHtml(brandName)}</div>
  </div>
</body>
</html>
`;
}

module.exports = { buildDesignHtml };
