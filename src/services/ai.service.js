const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config');

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

async function generateCaption(base64ImageFile, mimeType = "image/jpeg") {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent([
    {
      inlineData: {
        data: base64ImageFile,
        mimeType,
      },
    },
    "Generate a short creative caption under 10 words with emojis and hashtags.",
  ]);

  return result.response.text();
}

async function generateDesignContent(prompt, toneOfVoice) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const instruction = `You are a senior social media copywriter. Brand tone of voice: "${toneOfVoice}".
Given the campaign prompt below, return ONLY a JSON object with exactly these keys:
"eyebrow" (max 20 characters, uppercase kicker label above the headline, e.g. "NEW COLLECTION", "LIMITED OFFER", "JUST LAUNCHED"),
"headline" (max 40 characters, punchy),
"subheadline" (max 80 characters),
"cta" (max 20 characters, e.g. "Shop Now").
Do not include markdown, code fences, HTML, or any explanation — only the raw JSON object.

Campaign prompt: "${prompt}"`;

  const result = await model.generateContent(instruction);
  return result.response.text();
}

async function generateLogoDesign(brandName, toneOfVoice, colors, description, industry) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const instruction = `You are a professional logo designer. Design a typography-focused logo for the brand "${brandName}".

Industry: ${industry || 'general'}
Tone: "${toneOfVoice}"
Colors: primary=${colors.primary}, secondary=${colors.secondary}, accent=${colors.accent}
${description ? `Brief: "${description}"` : ''}

Return ONLY a JSON object with these exact keys:
{
  "font": "one of: Playfair Display | Poppins | Inter | Montserrat | Space Grotesk | DM Sans | Plus Jakarta Sans | DM Serif Display | Outfit | Clash Display (if available)",
  "style": "one of: minimal (thin weight, lowercase) | bold (heavy weight, clean) | elegant (serif, refined) | modern (sans-serif, geometric)",
  "accent": "one of: underline (a colored line under text) | dot (a small circle accent) | double-line (two parallel lines) | none",
  "letterSpacing": "tight (-0.02) or wide (0.08)",
  "case": "uppercase or lowercase or title"
}

Pick the font and style that best fits the brand's industry and personality. Only return the raw JSON.`;

  const result = await model.generateContent(instruction);
  const raw = result.response.text();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('AI returned malformed JSON for logo design');
  }

  return parsed;
}

module.exports = { generateCaption, generateDesignContent, generateLogoDesign };
