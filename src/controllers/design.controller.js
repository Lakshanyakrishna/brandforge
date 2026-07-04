const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const designService = require('../services/design.service');

const generateDesignController = asyncHandler(async (req, res) => {
    const design = await designService.generateDesign(req.user._id, req.body);
    return res.status(201).json(new ApiResponse(201, design, 'Design generated successfully'));
});

const listDesignsController = asyncHandler(async (req, res) => {
    const designs = await designService.getDesignsForUser(req.user._id);
    return res.status(200).json(new ApiResponse(200, designs, 'Designs fetched successfully'));
});

const deleteDesignController = asyncHandler(async (req, res) => {
    await designService.deleteDesign(req.params.id, req.user._id);
    return res.status(200).json(new ApiResponse(200, null, 'Design deleted successfully'));
});

module.exports = {
    generateDesignController,
    listDesignsController,
    deleteDesignController
};
