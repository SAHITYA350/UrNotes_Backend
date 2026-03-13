const express = require('express');
const { registerUser, loginUser, updateProfile } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');
const multer = require('multer');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, upload.single('avatar'), updateProfile);

module.exports = router;
