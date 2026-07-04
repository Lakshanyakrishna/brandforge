const mongoose = require('mongoose');

// A generated social design: the prompt that produced it, the brand kit it
// was rendered against, the validated Gemini JSON, and where the final PNG
// lives in ImageKit.
const designSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        brandKit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BrandKit',
            required: true
        },
        prompt: {
            type: String,
            required: true,
            trim: true
        },
        generatedContent: {
            headline: String,
            subheadline: String,
            cta: String
        },
        // Kept for debugging/re-rendering, not needed in normal list responses.
        renderedHtml: {
            type: String,
            select: false
        },
        template: {
            type: String,
            default: 'modern'
        },
        renderDurationMs: Number,
        generationDurationMs: Number,
        imageUrl: String,
        // ImageKit file id, needed only to delete the asset later.
        imageFileId: {
            type: String,
            select: false
        },
        platform: {
            type: String,
            default: 'instagram-post'
        }
    },
    { timestamps: true }
);

const DesignModel = mongoose.model('Design', designSchema);

module.exports = DesignModel;
