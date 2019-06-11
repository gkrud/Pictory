const auth = require('./auth');
const Mypage = require('./myPage');
const post = require('./post');
const router = require('express').Router();
const feed = require('./feed')
router.use('/docs', require('./docs'));

router.use('/auth',auth);
router.use('/Mypage',Mypage);
router.use('/post',post);
router.use('/feed',feed);

module.exports = router;