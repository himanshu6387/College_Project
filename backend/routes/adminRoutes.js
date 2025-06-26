const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const adminController = require('../controllers/admin.Controller');

// Admin login
router.post('/login', adminController.adminLogin);

// Create college
router.post('/create-college', auth, adminController.createCollege);

// Get all student data
router.get('/data', auth, adminController.getAllStudentData);

module.exports = router;
