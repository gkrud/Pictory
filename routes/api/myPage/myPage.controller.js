const jwt = require('jsonwebtoken');
const Post = require('../../../models/Post');
const User = require('../../../models/User');

const UpdateMypage_info = async(req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));
    
        User.findOne({id:tokenDecoded.id},(err,user)=>{
            if(err){
                console.log(err);
                return res.status(500).end();
            }
            if(req.body.birth) user.birth = req.body.birth;
            if(req.body.username) user.username = req.body.username;
            user.save((err)=>{
                if(err) res.status(500).json({error :'failed update'});
                res.status(200).json(user);
            });
        });
    }catch(e){
        res.json({error: e.stack}).end();
    }
}

const UpdateMypage_profileIMG = async (req,res)=>{
    try{
        let post = new Post();
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));
        const imageName = req.file.filename;
        const user = await User.findOne({id:tokenDecoded.id});
        user.imageName.push(imageName);
        user.profileIMG = imageName;
        user.profilePath = `http://54.180.116.34/static/images/${imageName}`
        user.imagePath.push(`http://54.180.116.34/static/images/${user.imageName}`);
        post.username = user.username;
        post.text =  req.body.text;
        post.id = user.id;
        post.imageName = imageName;
        post.imagePath = `http://54.180.116.34/static/images/${user.imageName}`;
        post.save();
        user.save();
        res.status(200).json({messege:'success changeprofile'});
    }catch(e){
        res.json({error: e.stack}).end();
    }
}

const ReadMypage = async (req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token

        let tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));
    
        User.findOne({id:tokenDecoded.id},{_id:0,__v:0},async (err,user)=>{
            if(!user) res.status(404).json({messege: "Not found"});
            
            const posts = await Post.find({id:tokenDecoded.id});
            res.status(200).json({
                posts,
                user
            }).end();
        });
    }catch(e){
         res.json({error: e.stack}).end();
    }
}

const readOthers = async(req,res)=>{
    try{
        const user = findOne({id:req.params.userId});
        const post = findOne({id:user.id});
        res.status(200).json({
            user,
            post
        });

    }catch(e){
        res.json({error: e.stack}).end();
    }
}


module.exports = {
    UpdateMypage_info,
    ReadMypage,
    UpdateMypage_profileIMG,
    readOthers
}