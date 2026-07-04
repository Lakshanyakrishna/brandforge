// A curated list of popular Google Fonts (not the full ~1500-family catalog,
// which would need the Google Fonts Developer API + an API key). This keeps
// the font picker fast, dependency-free, and covers what a brand kit tool
// actually needs.
export const GOOGLE_FONTS = [
  { family: 'Inter', category: 'Sans Serif' },
  { family: 'Poppins', category: 'Sans Serif' },
  { family: 'Roboto', category: 'Sans Serif' },
  { family: 'Lato', category: 'Sans Serif' },
  { family: 'Montserrat', category: 'Sans Serif' },
  { family: 'Open Sans', category: 'Sans Serif' },
  { family: 'Nunito', category: 'Sans Serif' },
  { family: 'Work Sans', category: 'Sans Serif' },
  { family: 'Manrope', category: 'Sans Serif' },
  { family: 'DM Sans', category: 'Sans Serif' },
  { family: 'Rubik', category: 'Sans Serif' },
  { family: 'Space Grotesk', category: 'Sans Serif' },
  { family: 'Outfit', category: 'Sans Serif' },
  { family: 'Sora', category: 'Sans Serif' },
  { family: 'Karla', category: 'Sans Serif' },
  { family: 'Mulish', category: 'Sans Serif' },
  { family: 'Barlow', category: 'Sans Serif' },
  { family: 'Urbanist', category: 'Sans Serif' },
  { family: 'Plus Jakarta Sans', category: 'Sans Serif' },
  { family: 'Figtree', category: 'Sans Serif' },
  { family: 'Playfair Display', category: 'Serif' },
  { family: 'Merriweather', category: 'Serif' },
  { family: 'Lora', category: 'Serif' },
  { family: 'PT Serif', category: 'Serif' },
  { family: 'Libre Baskerville', category: 'Serif' },
  { family: 'Cormorant Garamond', category: 'Serif' },
  { family: 'Crimson Text', category: 'Serif' },
  { family: 'Bitter', category: 'Serif' },
  { family: 'Source Serif 4', category: 'Serif' },
  { family: 'Domine', category: 'Serif' },
  { family: 'Oswald', category: 'Display' },
  { family: 'Bebas Neue', category: 'Display' },
  { family: 'Anton', category: 'Display' },
  { family: 'Archivo Black', category: 'Display' },
  { family: 'Abril Fatface', category: 'Display' },
  { family: 'Righteous', category: 'Display' },
  { family: 'Paytone One', category: 'Display' },
  { family: 'Fraunces', category: 'Display' },
  { family: 'Unbounded', category: 'Display' },
  { family: 'Bricolage Grotesque', category: 'Display' },
  { family: 'Caveat', category: 'Handwriting' },
  { family: 'Pacifico', category: 'Handwriting' },
  { family: 'Dancing Script', category: 'Handwriting' },
  { family: 'Sacramento', category: 'Handwriting' },
  { family: 'JetBrains Mono', category: 'Monospace' },
  { family: 'Space Mono', category: 'Monospace' },
  { family: 'IBM Plex Mono', category: 'Monospace' },
  { family: 'Fira Code', category: 'Monospace' },
];

let injected = false;

// Loads every curated font family in one combined stylesheet request, so
// the font picker can render live previews with zero per-item flicker.
// Called once, lazily, only by the page that needs it (BrandKit).
export function ensureGoogleFontsLoaded() {
  if (injected) return;
  injected = true;

  const families = GOOGLE_FONTS.map(
    (f) => `family=${f.family.replace(/ /g, '+')}:wght@400;600;700`
  ).join('&');

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}
