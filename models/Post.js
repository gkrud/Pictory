const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Post = new Schema({
    username: String,
    id: String,
    liker:[{
        liker_id:{type:String}
    }],
    imageName: String,
    imagePath: String,
    text:String,
    comments: [{
        body: {type: String},
        author:{type:String},
        date:{type:Date,default:Date.now}
    }],
    date: {type:Date,default:Date.now},
});

module.exports = mongoose.model('Post', Post);