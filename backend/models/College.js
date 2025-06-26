const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
  name: String,
  slug: String // for dynamic form route
});

module.exports = mongoose.model('College', collegeSchema);
