const mongoose = require('mongoose');

const HEX_COLOR_REGEX = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const brandKitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        brandName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 60
        },
        colors: {
            primary: {
                type: String,
                required: true,
                match: HEX_COLOR_REGEX
            },
            secondary: {
                type: String,
                required: true,
                match: HEX_COLOR_REGEX
            },
            accent: {
                type: String,
                required: true,
                match: HEX_COLOR_REGEX
            }
        },
        fonts: {
            heading: {
                type: String,
                required: true,
                trim: true,
                maxlength: 60
            },
            body: {
                type: String,
                required: true,
                trim: true,
                maxlength: 60
            }
        },
        toneOfVoice: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 160
        },
        logoUrl: {
            type: String,
            default: null
        },
        // Internal bookkeeping only (needed to delete/replace the file in
        // ImageKit later) — excluded from queries by default so it never
        // leaks into API responses.
        logoFileId: {
            type: String,
            default: null,
            select: false
        }
    },
    { timestamps: true }
);

const BrandKitModel = mongoose.model('BrandKit', brandKitSchema);

module.exports = BrandKitModel;
