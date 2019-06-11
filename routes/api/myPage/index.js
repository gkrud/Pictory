const express = require('express');
const router = express.Router();
const controller = require('./myPage.controller');
const authMiddleware = require('../../../middlewares/auth');
const multer = require('multer');

let _storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

let upload = multer({ storage: _storage });
router.get('/',authMiddleware,controller.ReadMypage);
router.put('/update_info',authMiddleware,controller.UpdateMypage_info);
router.post('/update_info/update_profileIMG',authMiddleware,upload.single('myfile')
,controller.UpdateMypage_profileIMG);
router.get('/:userId',authMiddleware,controller.readOthers);

module.exports = router;