const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const brandKitService = require('../services/brandKit.service');
const { generateLogo } = require('../services/logo.service');

// Controllers stay thin: parse the request, delegate to the service layer,
// format the response. All business rules (ownership, ImageKit orchestration)
// live in brandKit.service.js so they're reusable outside the HTTP layer too.

const createBrandKitController = asyncHandler(async (req, res) => {
    const brandKit = await brandKitService.createBrandKit(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, brandKit, 'Brand kit created successfully'));
});

const getBrandKitsController = asyncHandler(async (req, res) => {
    const brandKits = await brandKitService.getBrandKitsForUser(req.user._id);
    return res.status(200).json(new ApiResponse(200, brandKits, 'Brand kits fetched successfully'));
});

const getBrandKitController = asyncHandler(async (req, res) => {
    const brandKit = await brandKitService.getOwnedBrandKit(req.params.id, req.user._id);
    return res.status(200).json(new ApiResponse(200, brandKit, 'Brand kit fetched successfully'));
});

const updateBrandKitController = asyncHandler(async (req, res) => {
    const brandKit = await brandKitService.updateBrandKit(req.params.id, req.user._id, req.body);
    return res.status(200).json(new ApiResponse(200, brandKit, 'Brand kit updated successfully'));
});

const deleteBrandKitController = asyncHandler(async (req, res) => {
    await brandKitService.deleteBrandKit(req.params.id, req.user._id);
    return res.status(200).json(new ApiResponse(200, null, 'Brand kit deleted successfully'));
});

const generateLogoController = asyncHandler(async (req, res) => {
    const { brandName, toneOfVoice, primaryColor, secondaryColor, accentColor, description, industry } = req.body;

    if (!brandName || !toneOfVoice) {
        return res.status(422).json(new ApiResponse(422, null, 'Brand name and tone of voice are required'));
    }

    const result = await generateLogo(brandName, toneOfVoice, { primary: primaryColor || '#0F172A', secondary: secondaryColor || '#2563EB', accent: accentColor || '#38BDF8' }, description, industry);
    return res.status(200).json(new ApiResponse(200, result, 'Logo generated successfully'));
});

module.exports = {
    createBrandKitController,
    getBrandKitsController,
    getBrandKitController,
    updateBrandKitController,
    deleteBrandKitController,
    generateLogoController
};
