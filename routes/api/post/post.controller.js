const Post = require('../../../models/Post');
const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const fs = require('fs');


const postCreate = async (req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded= await jwt.verify(token, req.app.get('jwt-secret'));
        const id = tokenDecoded.id;
        const text = req.body.text;
        const user = await User.findOne({id:tokenDecoded.id});
        const imageName = req.file.filename;
        if(imageName){
            const path = `http://54.180.116.34/static/images/${imageName}`;
            user.imageName.push(imageName);
            user.imagePath.push(path);
            const post = new Post();
            post.id = id;
            post.text = text;
            post.username = user.username;
            post.imageName = imageName;
            post.imagePath = `http://54.180.116.34/static/images/${imageName}`;
            post.save();
            user.save();
            res.status(200).json({messege:'success'}).end();
        }
        else{
            const post = new Post();
            post.id = id;
            post.text = text;
            post.username = user.username;
            post.save();
            res.status(200).json({messege:'success'}).end();
        }
    }
    catch(e){
        // const file = await fs.exists(req.file.filename);
        // if(file){
        //     fs.unlink(req.file.filename, (err) =>{
        //         if (err) throw err;
        //         console.log('successfully deleted');
        //       });
        // }
        res.json({error: e.stack}).end();
    }
}

const postEdit = async(req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded = await jwt.verify(token, req.app.get('jwt-secret'));
        const post = await Post.findOne({_id: req.params._id});
        if(!post) return res.status(404).json({ error: 'post not found' });
        if(req.body.text) post.text = req.body.text;
        if(req.body.imageName) post.imageName = req.file.filename;
        post.save((err)=>{
            if(err) res.status(500).json({error :'failed update'});
            res.status(200).json(user);
        });

    }catch(e){
        res.json({error: e.stack}).end();
    }
}

const postDelete = async(req,res)=>{
    try{
        const token = req.headers['x-access-token'] || req.query.token;
        const tokenDecoded = await jwt.verify(token, req.app.get('jwt-secret'));

        const user = await User.findOne({id:tokenDecoded.id});
        const post = await Post.findOne({_id:req.params.post_id});
        const Findex = user.imageName.indexOf(post.imageName);
        user.imageName.splice(Findex,0);
        user.imagePath.splice(Findex,0);
        user.save();
        fs.unlink(post.imageName);
        Post.remove({ _id: req.params.post_id }, (err, output)=>{
            if(err) return res.status(500).json({ error: "database failure" });
        });
        res.status(204).end();
    }catch(e){
        res.json({error: e.stack}).end();
    }
    
}

module.exports = {
    postCreate,
    postDelete,
    postEdit,
}       