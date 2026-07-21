const { v4: uuidv4 } = require('uuid');
const config = require('../config');
const { uploadFile } = require('./storage.service');
const logger = require('../config/logger');

const LOGO_FOLDER = 'brandforge/logos';

async function generateLogo(brandName, toneOfVoice, colors, description, industry) {
  const Replicate = require('replicate');
  const replicate = new Replicate({ auth: config.replicate.apiToken });

  const desc = description ? `. ${description}` : '';

  const prompt = `Professional brand logo for "${brandName}", a premium food restaurant and catering business. The logo is a minimalist flat vector illustration featuring an elegant traditional Indian motif combined with food elements like rice bowls, spices, or curry leaves. Clean symmetrical composition, sophisticated color palette, premium corporate branding, mature professional design, sharp crisp lines, solid white background, no cartoon elements, no 3D effects, no gradients, vector graphics style, high-end restaurant logo aesthetic, suitable for a premium food brand.${desc}`;

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
