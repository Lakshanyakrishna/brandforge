const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { uploadFile } = require('./storage.service');
const logger = require('../config/logger');

const LOGO_FOLDER = 'brandforge/logos';

// Per-industry visual direction so the generated mark actually matches the
// brand's business instead of a single generic motif.
const INDUSTRY_MOTIFS = {
  technology: 'an abstract geometric mark suggesting circuits, nodes, or a forward-facing arrow',
  food: 'an elegant abstract motif such as a leaf, grain stalk, or utensil silhouette',
  health: 'a clean cross, leaf, or heartbeat-inspired wellness symbol',
  fashion: 'a refined abstract silhouette or monogram in a high-fashion house style',
  finance: 'a strong geometric shape suggesting stability, such as a shield, column, or upward arrow',
  education: 'an open book, graduation cap, or upward-growth symbol',
  realestate: 'an abstract house, rooftop, or skyline silhouette',
  travel: 'a compass, wing, or horizon-inspired symbol',
  ecommerce: 'a shopping bag, box, or cart-arrow abstract icon',
  creative: 'an abstract paintbrush stroke, spark, or artistic geometric shape',
  fitness: 'a dynamic abstract shape suggesting motion or strength',
  music: 'an abstract soundwave, note, or rhythm-inspired symbol',
  legal: 'a balanced scale, column, or shield motif',
  nonprofit: 'an abstract hands, heart, or connection symbol',
  other: 'a clean abstract geometric mark',
};

function describeIndustry(industry) {
  return INDUSTRY_MOTIFS[industry] || INDUSTRY_MOTIFS.other;
}

async function generateLogo(brandName, toneOfVoice, colors, description, industry) {
  const Replicate = require('replicate');
  const replicate = new Replicate({ auth: config.replicate.apiToken });

  const desc = description ? `. ${description}` : '';
  const motif = describeIndustry(industry);

  const prompt = `Professional brand logo mark for "${brandName}". The logo is a minimalist flat vector icon featuring ${motif}. Tone of voice: "${toneOfVoice}". Use a color palette built from ${colors.primary}, ${colors.secondary}, and ${colors.accent}. Clean symmetrical composition, sophisticated, premium corporate branding, sharp crisp lines, solid white background, no text, no cartoon elements, no 3D effects, no gradients, no photographic elements, vector graphics style, high-end modern logo aesthetic.${desc}`;

  logger.info(`Generating logo via Replicate: "${prompt.substring(0, 180)}..."`);

  const output = await replicate.run(
    'black-forest-labs/flux-dev',
    {
      input: {
        prompt,
        num_outputs: 1,
        num_inference_steps: 28,
        guidance_scale: 7.5,
        output_format: 'png',
        output_quality: 100,
        go_fast: false,
      }
    }
  );

  const imageUrl = output[0];

  if (!imageUrl) {
    throw new Error('Replicate did not return any images');
  }

  logger.info(`Downloading generated image from Replicate: ${imageUrl}`);
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadResult = await uploadFile(buffer, `${uuidv4()}.png`, LOGO_FOLDER);

  logger.info(`Logo generated for "${brandName}": ${uploadResult.url}`);

  return { url: uploadResult.url, fileId: uploadResult.fileId };
}

module.exports = { generateLogo };
