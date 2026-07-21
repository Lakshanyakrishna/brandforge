const { v4: uuidv4 } = require('uuid');
const BrandKitModel = require('../models/brandKit.model');
const { uploadFile, deleteFile } = require('./storage.service');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const LOGO_FOLDER = 'brandforge/logos';

// Maps the flat multipart form fields the API accepts into the nested
// shape the BrandKit schema stores (colors/fonts as sub-objects), which is
// also the shape Stage 2's colorAssignments ("primary"/"secondary"/"accent")
// will read from directly during rendering.
function buildBrandKitFields({ brandName, primaryColor, secondaryColor, accentColor, headingFont, bodyFont, toneOfVoice, mockupDevice, mockupBackground, mockupShadow, logoUrl }) {
    const fields = {};

    if (brandName !== undefined) fields.brandName = brandName;
    if (toneOfVoice !== undefined) fields.toneOfVoice = toneOfVoice;
    if (logoUrl !== undefined) fields.logoUrl = logoUrl;

    fields.colors = {
        primary: primaryColor || '#0F172A',
        secondary: secondaryColor || '#2563EB',
        accent: accentColor || '#38BDF8'
    };

    fields.fonts = {
        heading: headingFont || 'Poppins',
        body: bodyFont || 'Inter'
    };

    if (mockupDevice !== undefined || mockupBackground !== undefined || mockupShadow !== undefined) {
        fields.mockup = {};
        if (mockupDevice !== undefined) fields.mockup.device = mockupDevice;
        if (mockupBackground !== undefined) fields.mockup.background = mockupBackground;
        if (mockupShadow !== undefined) fields.mockup.shadow = mockupShadow;
    }

    return fields;
}

async function createBrandKit(userId, formFields, logoFile) {
    const fields = buildBrandKitFields(formFields);

    if (logoFile) {
        const uploadResult = await uploadFile(logoFile.buffer, uuidv4(), LOGO_FOLDER);
        fields.logoUrl = uploadResult.url;
        fields.logoFileId = uploadResult.fileId;
    }

    return BrandKitModel.create({ ...fields, user: userId });
}

async function getBrandKitsForUser(userId) {
    return BrandKitModel.find({ user: userId }).sort({ createdAt: -1 });
}

// withLogoFileId opts into the normally-hidden logoFileId field, needed
// internally when replacing/deleting the logo in ImageKit.
async function getOwnedBrandKit(brandKitId, userId, { withLogoFileId = false } = {}) {
    const query = BrandKitModel.findById(brandKitId);
    if (withLogoFileId) query.select('+logoFileId');

    const brandKit = await query;

    if (!brandKit) {
        throw new ApiError(404, 'Brand kit not found');
    }

    if (brandKit.user.toString() !== userId.toString()) {
        throw new ApiError(403, 'You do not have access to this brand kit');
    }

    return brandKit;
}

async function updateBrandKit(brandKitId, userId, formFields, logoFile) {
    const brandKit = await getOwnedBrandKit(brandKitId, userId, { withLogoFileId: true });
    const fields = buildBrandKitFields(formFields);

    if (fields.colors) {
        fields.colors = { ...brandKit.colors.toObject(), ...fields.colors };
    }
    if (fields.fonts) {
        fields.fonts = { ...brandKit.fonts.toObject(), ...fields.fonts };
    }
    if (fields.mockup) {
        fields.mockup = { ...brandKit.mockup.toObject(), ...fields.mockup };
    }

    if (logoFile) {
        const uploadResult = await uploadFile(logoFile.buffer, uuidv4(), LOGO_FOLDER);
        const previousLogoFileId = brandKit.logoFileId;

        fields.logoUrl = uploadResult.url;
        fields.logoFileId = uploadResult.fileId;

        // Best-effort cleanup: a transient ImageKit failure here shouldn't
        // block the user from saving their update, so we log and continue
        // rather than failing the whole request over an orphaned file.
        if (previousLogoFileId) {
            deleteFile(previousLogoFileId).catch((err) => {
                logger.error(`Failed to delete previous logo from ImageKit: ${err.message}`);
            });
        }
    }

    Object.assign(brandKit, fields);
    await brandKit.save();
    return brandKit;
}

async function deleteBrandKit(brandKitId, userId) {
    const brandKit = await getOwnedBrandKit(brandKitId, userId, { withLogoFileId: true });

    if (brandKit.logoFileId) {
        await deleteFile(brandKit.logoFileId).catch((err) => {
            logger.error(`Failed to delete logo from ImageKit: ${err.message}`);
        });
    }

    await brandKit.deleteOne();
}

module.exports = {
    createBrandKit,
    getBrandKitsForUser,
    getOwnedBrandKit,
    updateBrandKit,
    deleteBrandKit
};
