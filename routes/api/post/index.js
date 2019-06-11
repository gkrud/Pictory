const controller = require('./post.controller');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const authMiddleware = require('../../../middlewares/auth');

let _storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});
let upload = multer({ storage: _storage });

router.post('/postCreate',authMiddleware,upload.single('myfile'),controller.postCreate);
router.put('/postEdit/:post_id',authMiddleware,upload.single('myfile'),controller.postEdit);
router.delete('/postDelete/:post_id',authMiddleware,controller.postDelete);

module.exports = router;