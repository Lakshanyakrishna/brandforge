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

// Generates the structured copy for a social design. responseMimeType:
// "application/json" puts Gemini in JSON mode so it reliably returns a raw
// JSON object instead of prose or markdown-fenced JSON.
async function generateDesignContent(prompt, toneOfVoice) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: { responseMimeType: "application/json" }
  });

  const instruction = `You are a senior social media copywriter. Brand tone of voice: "${toneOfVoice}".
Given the campaign prompt below, return ONLY a JSON object with exactly these keys: "headline" (max 40 characters, punchy), "subheadline" (max 80 characters), "cta" (max 20 characters, e.g. "Shop Now").
Do not include markdown, code fences, HTML, or any explanation — only the raw JSON object.

Campaign prompt: "${prompt}"`;

  const result = await model.generateContent(instruction);
  return result.response.text();
}

module.exports = { generateCaption, generateDesignContent };
