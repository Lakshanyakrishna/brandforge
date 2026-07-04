// The one HTML template the MVP renders. Brand kit values (colors, fonts,
// logo) and Gemini's generated copy are interpolated into a fixed
// 1080x1080 layout, then screenshotted to PNG by renderer.service.js.
function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildDesignHtml({ brandKit, content }) {
    const { colors, fonts, logoUrl, brandName } = brandKit;
    const headline = escapeHtml(content.headline);
    const subheadline = escapeHtml(content.subheadline);
    const cta = escapeHtml(content.cta);

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
    background: ${colors.primary};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 80px;
    position: relative;
    font-family: '${fonts.body}', 'Helvetica Neue', Arial, sans-serif;
  }
  .logo { width: 120px; height: 120px; object-fit: contain; margin-bottom: 40px; border-radius: 16px; background: #fff; }
  .headline {
    font-family: '${fonts.heading}', 'Helvetica Neue', Arial, sans-serif;
    color: ${colors.secondary};
    font-size: 72px;
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 24px;
  }
  .subheadline {
    color: #ffffff;
    font-size: 34px;
    line-height: 1.4;
    margin-bottom: 48px;
    max-width: 800px;
  }
  .cta {
    display: inline-block;
    background: ${colors.accent};
    color: #ffffff;
    font-size: 32px;
    font-weight: 700;
    padding: 20px 48px;
    border-radius: 999px;
  }
  .brand {
    position: absolute;
    bottom: 48px;
    color: #ffffff;
    opacity: 0.8;
    font-size: 24px;
  }
</style>
</head>
<body>
  <div class="card">
    ${logoUrl ? `<img class="logo" src="${logoUrl}" />` : ''}
    <div class="headline">${headline}</div>
    <div class="subheadline">${subheadline}</div>
    <div class="cta">${cta}</div>
    <div class="brand">${escapeHtml(brandName)}</div>
  </div>
</body>
</html>
`;
}

module.exports = { buildDesignHtml };
