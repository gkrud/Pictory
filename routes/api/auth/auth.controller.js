const jwt = require('jsonwebtoken');
const User = require('../../../models/User');
const Post = require('../../../models/Post');

const register = (req, res) => {
    const { username,id,pw,birth,active } = req.body;
    const profileIMG = req.file.filename;
    const imageName = req.file.filename;
    const profilePath = `http://54.180.116.34/static/images/${imageName}`
    const imagePath = [];
    imagePath.push(`http://54.180.116.34/static/images/${imageName}`)

    // create a new user if does not exist
    const userCreate = (user) => {
        if(user) {
            throw new Error('username exists');
        } else {
            return User.create(username,id,pw,birth,active,profileIMG,imageName,profilePath,imagePath);
        }
    }
    
    const postCreate = (user)=>{
        let post = new Post();
        post.username = user.username;
        post.id = user.id;
        post.imageName = user.imageName;
        post.text = '';
        post.imagePath = `http://54.180.116.34/static/images/${user.imageName}`;

        post.save((err)=>{
            if(err){
                console.error(err);
                return;
            }
            return err;
        });
    }
    // respond to the client
    const respond = (post) => {
        res.json({
            message: 'registered successfully',
        })
    }

    // run when there is an error (username exists)
    const onError = (error) => {
        res.status(409).json({
            message: error.stack
        })
    }

    // check username duplication
    User.findOneById(username)
    .then(userCreate)
    .then(postCreate)
    .then(respond)
    .catch(onError)
}

const login = (req,res)=>{
    const {id,pw} = req.body;
    const secret = req.app.get('jwt-secret');

    const check = (user) => {
        
        if(!user) {
            // user does not exist
            throw new Error('You must signup');
        } else {
            // user exists, check the password
            if(user.verify(pw)) {
                // create a promise that generates jwt asynchronously
                const p = new Promise((resolve, reject) => {
                    jwt.sign(
                        {
                            pw:user.pw,
                            id:user.id
                        }, 
                        secret, 
                        {
                            expiresIn: '100h',
                            issuer: 'me',
                            subject: 'user_info'
                        }, (err, token) => {
                            if (err) reject(err)
                            resolve(token)
                        });
                }); 
                return p;
            } else {
                throw new Error('login failed');
            }
        }
    }

    // respond the token 
    const respond = (token) => {
        res.json({
            message: 'logged in successfully',
            token,
        });
    }

    // error occured
    const onError = (error) => {
        res.status(403).json({
            message: error.message
        });
    }

    // find the user
    User.findOneById(id)
    .then(check)
    .then(respond)
    .catch(onError)
}

module.exports = {
    login,
    register,
}