const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  collegeSlug: String,
  name: String,
  email: String,
  class: String,
  section: String,
  aadhaar: String,
  phone: String,
  fatherName: String,
  motherName: String,
  dob: Date,
  profileImage: String,
  address: String,
  admissionNo: String,
  password: String
});

module.exports = mongoose.model('Student', studentSchema);
