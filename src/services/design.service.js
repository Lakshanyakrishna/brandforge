const { v4: uuidv4 } = require('uuid');
const DesignModel = require('../models/design.model');
const brandKitService = require('./brandKit.service');
const { generateDesignContent } = require('./ai.service');
const { renderHtmlToPng } = require('./renderer.service');
const { uploadFile, deleteFile } = require('./storage.service');
const { buildDesignHtml } = require('../templates/design.template');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const DESIGN_FOLDER = 'brandforge/designs';

// Minimal shape check on Gemini's JSON — enough to fail loudly with a
// clear error instead of feeding garbage into the HTML template.
function parseDesignContent(rawText) {
    let parsed;
    try {
        parsed = JSON.parse(rawText);
    } catch (err) {
        throw new ApiError(502, 'AI returned malformed JSON, please try again');
    }

    const { headline, subheadline, cta } = parsed;
    if (!headline || !subheadline || !cta) {
        throw new ApiError(502, 'AI response is missing required fields, please try again');
    }

    return { headline, subheadline, cta };
}

// The pipeline: brand kit -> Gemini JSON -> HTML template -> PNG -> ImageKit -> Design record.
async function generateDesign(userId, { brandKitId, prompt, platform }) {
    const brandKit = await brandKitService.getOwnedBrandKit(brandKitId, userId);

    const generationStart = Date.now();
    const rawContent = await generateDesignContent(prompt, brandKit.toneOfVoice);
    const content = parseDesignContent(rawContent);
    const generationDurationMs = Date.now() - generationStart;

    const html = buildDesignHtml({ brandKit, content });

    const renderStart = Date.now();
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
