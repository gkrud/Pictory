const controller = require('./feed.controller');
const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middlewares/auth');

router.get('/',authMiddleware,controller.allRead);
router.post('/:post_id/writeComments',authMiddleware,controller.writeComments);
router.get('/:post_id',authMiddleware,controller.readPost);
router.patch('/',authMiddleware,controller.like);

module.exports = router;