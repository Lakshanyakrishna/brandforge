const { v4: uuidv4 } = require('uuid');
const DesignModel = require('../models/design.model');
const brandKitService = require('./brandKit.service');
const { generateDesignContent } = require('./ai.service');
const { uploadFile, deleteFile } = require('./storage.service');
const { buildDesignHtml } = require('../templates/design.template');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const DESIGN_FOLDER = 'brandforge/designs';
const ALLOWED_PHOTO_MIME_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/gif']);

// Minimal shape check on Gemini's JSON — enough to fail loudly with a
// clear error instead of feeding garbage into the HTML template.
function parseDesignContent(rawText) {
    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch (err) {
        throw new ApiError(502, 'AI returned malformed JSON, please try again');
    }

    const { headline, subheadline, cta, eyebrow } = parsed;
    if (!headline || !subheadline || !cta) {
        throw new ApiError(502, 'AI response is missing required fields, please try again');
    }

    // Eyebrow is a decorative kicker label — default it rather than failing
    // the whole generation over a cosmetic field the model omitted.
    return { headline, subheadline, cta, eyebrow: eyebrow || 'NEW' };
}

// The pipeline: brand kit -> Gemini JSON -> HTML template -> PNG -> ImageKit -> Design record.
async function generateDesign(userId, { brandKitId, prompt, platform }, photoFile) {
    const brandKit = await brandKitService.getOwnedBrandKit(brandKitId, userId);

    const generationStart = Date.now();
    const rawContent = await generateDesignContent(prompt, brandKit.toneOfVoice);
    const content = parseDesignContent(rawContent);
    const generationDurationMs = Date.now() - generationStart;

    // The uploaded product photo only needs to exist for the duration of
    // the render — it's baked into the output PNG as pixels, so it's
    // embedded as a data URI rather than uploaded to ImageKit separately.
    // The mime type is interpolated into that URI, so it's checked against
    // an allowlist rather than trusted as-is from the multipart request.
    if (photoFile && !ALLOWED_PHOTO_MIME_TYPES.has(photoFile.mimetype)) {
        throw new ApiError(400, 'Product photo must be a PNG, JPEG, WebP, or GIF image');
    }
    const photoDataUri = photoFile
        ? `data:${photoFile.mimetype};base64,${photoFile.buffer.toString('base64')}`
        : undefined;

    const html = buildDesignHtml({ brandKit, content, photoDataUri });

    const renderStart = Date.now();
    const { renderHtmlToPng } = require('./renderer.service');
    const pngBuffer = await renderHtmlToPng(html);
    const renderDurationMs = Date.now() - renderStart;

    const uploadResult = await uploadFile(pngBuffer, `${uuidv4()}.png`, DESIGN_FOLDER);

    return DesignModel.create({
        user: userId,
        brandKit: brandKit._id,
        prompt,
        generatedContent: content,
        renderedHtml: html,
        template: 'modern',
        renderDurationMs,
        generationDurationMs,
        imageUrl: uploadResult.url,
        imageFileId: uploadResult.fileId,
        platform: platform || 'instagram-post'
    });
}

async function getDesignsForUser(userId) {
    return DesignModel.find({ user: userId }).sort({ createdAt: -1 });
}

async function deleteDesign(designId, userId) {
    const design = await DesignModel.findById(designId).select('+imageFileId');

    if (!design) {
        throw new ApiError(404, 'Design not found');
    }
    if (design.user.toString() !== userId.toString()) {
        throw new ApiError(403, 'You do not have access to this design');
    }

    if (design.imageFileId) {
        await deleteFile(design.imageFileId).catch((err) => {
            logger.error(`Failed to delete design image from ImageKit: ${err.message}`);
        });
    }

    await design.deleteOne();
}

module.exports = {
    generateDesign,
    getDesignsForUser,
    deleteDesign
};
