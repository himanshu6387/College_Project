const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cloudinary = require('../cloudinary/cloudinary');
const fs = require('fs');

exports.studentSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      class: studentClass,
      section,
      aadhaar,
      phone,
      fatherName,
      motherName,
      dob,
      address,
      admissionNo,
      password
    } = req.body;

    const collegeSlug = req.params.slug;

    // Upload image to Cloudinary if file exists
    let imageUrl = '';
    if (req.file) {
      const cloudResult = await cloudinary.uploader.upload(req.file.path, {
        folder: 'student_profiles'
      });
      imageUrl = cloudResult.secure_url;

      // Delete the uploaded file from local disk
      fs.unlinkSync(req.file.path);
    }

    const hash = await bcrypt.hash(password, 10);

    const student = new Student({
      collegeSlug,
      name,
      email,
      class: studentClass,
      section,
      aadhaar,
      phone,
      fatherName,
      motherName,
      dob,
      address,
      admissionNo,
      profileImage: imageUrl,  // ✅ Save Cloudinary URL
      password: hash,
    });

    await student.save();
    res.json({ message: 'Registered successfully' });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};



exports.studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
