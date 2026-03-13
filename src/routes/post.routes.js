const express = require('express');
const { createPost, getPosts, updatePost, deletePost } = require('../controllers/post.controller');
const { protect } = require('../middlewares/auth.middleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getPosts);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;
