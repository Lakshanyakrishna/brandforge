import { getPalette } from 'colorthief';

// Extracts N dominant colors from a logo File, entirely client-side (a
// blob: object URL never leaves the browser, so this needs no backend
// endpoint and no CORS handling).
export async function extractPaletteFromFile(file, colorCount = 5) {
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = objectUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const colors = await getPalette(img, { colorCount });
    return colors.map((c) => c.hex());
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
