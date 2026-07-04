const mongoose = require('mongoose');



const postSchema = new mongoose.Schema({
    imageUrl: String,
    caption: String,
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // id  from User collection
    }


})

const postModel = mongoose.model('Post',postSchema);
module.exports = postModel;