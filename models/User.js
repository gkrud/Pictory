const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = new Schema({
    username: String,
    id: String,
    pw: String,
    birth: Number,
    active:Boolean,
    profileIMG:String,
    profilePath:String,
    following: [{
        user_id: String,
        username: String,
    }],
    follower: [{
        user_id:String,
        username:String,
    }],
    likedPost:[{
        post_id:String,
    }],
    imageName:[String],
    imagePath:[String],
});

User.statics.create = function(username,id,pw,birth,active,profileIMG,imageName,profilePath,imagePath) {
    const user = new this({
        username,
        id,
        pw,
        birth,
        active,
        profileIMG,
        imageName,
        profilePath,
        imagePath,
    });
    return user.save();
}

User.statics.findOneById = function(id) {
    return this.findOne({
        id
    }).exec();
}

User.methods.verify = function(pw) {

    return this.pw=== pw
}

module.exports = mongoose.model('User', User);