const Post = require('../../../models/Post');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const fs = require('fs');


const allRead = async (req,res)=>{
    try{
        const posts = await Post.find();
        posts.reverse();
        res.json(posts);
    }catch(e){
        res.json({error: e.stack}).end();
    }
}

const writeComments = async(req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded = await jwt.verify(token, req.app.get('jwt-secret'));
        const post = await Post.findOne({_id:req.params.post_id});
        const user = await User.findOne({id:tokenDecoded.id});
        const arr = {
            body:req.body.comments,
            author:user.username,
        }
        post.comments.unshift(arr);
        post.save();
        res.json(post);
    }catch(e){
        res.json({error: e.stack}).end();
    }
}

const readPost = async(req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded = await jwt.verify(token, req.app.get('jwt-secret'));
        const post  = await Post.findOne({_id:req.params.post_id});
        const user = await User.findOne({id:tokenDecoded.id});
        post.reverse();
        res.status(200).json({
            post,
            profilePath: user.profilePath
        });
    }catch(e){
        res.json({error:e.stack}).end();
    }
}

const like = async(req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded = await jwt.verify(token, req.app.get('jwt-secret'));

        const likeCheck = req.body.likeCheck;
        const postId = req.body.postId;
        const post = await Post.findOne({_id:postId});
        const user = await User.findOne({id:tokenDecoded.id});
        if(likeCheck){
            post.liker.push(user._id);
            user.likedPost.push(postId);
            post.save();
            user.save();
        }else{
            if(post.liker.includes(user._id)){
                const index = post.liker.indexOf(user._id);
                post.splice(index,0);
                post.save();
            }
            if(user.likedPost.includes(postId)){
                const index = user.likedPost.indexOf(postId);
                user.splice(index,0);
                user.save();
            }
            res.status(200).json({"messege":"success"});
        }
    }catch(e){
        res.json({error:e.stack}).end();
    }
}

module.exports = {
    allRead,
    writeComments,
    readPost,
    like
}