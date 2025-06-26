const express = require('express');
const router = express.Router();

const upload = require('../middlewares/multer'); // ✅ Your custom multer config with fileFilter
const studentController = require('../controllers/student.Controller');

// Student Signup with image upload and Cloudinary integration
router.post('/signup/:slug', upload.single('image'), studentController.studentSignup);

// Student Login
router.post('/login', studentController.studentLogin);

module.exports = router;
