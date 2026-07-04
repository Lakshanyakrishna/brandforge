const ImageKit = require("imagekit");
const config = require('../config');

const imagekit = new ImageKit({
  publicKey: config.imagekit.publicKey,
  privateKey: config.imagekit.privateKey,
  urlEndpoint: config.imagekit.urlEndpoint
});

async function uploadFile(file, fileName, folder = "cohort-ai-social"){
    const response = await imagekit.upload({
        file : file,
        fileName : fileName,
        folder : folder
    })
    return response;
}

async function deleteFile(fileId){
    if (!fileId) return;
    await imagekit.deleteFile(fileId);
}

module.exports = {
    uploadFile,
    deleteFile
}