  const Admin = require('../models/Admin');
  const College = require('../models/College');
  const Student = require('../models/Student');
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');

  exports.adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: 'Admin not found' });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return res.status(401).json({ message: 'Wrong password' });

      const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

  exports.createCollege = async (req, res) => {
    try {
      const { name } = req.body;
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      const college = await College.create({ name, slug });
      res.json({ 
  message: 'College Created', 
  link: `http://localhost:5173/student/register/${slug}`, // FULL LINK WITH CORRECT PORT
  slug 
});

    } catch (err) {
      res.status(500).json({ message: 'Failed to create college', error: err.message });
    }
  };

  exports.getAllStudentData = async (req, res) => {
    try {
      const colleges = await College.find();
      const result = {};

      for (let college of colleges) {
        const students = await Student.find({ collegeSlug: college.slug });
        result[college.name] = students;
      }

      res.json(result);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch data', error: err.message });
    }
  };
