const mongoose = require('mongoose');

const CourseMaterialSchema = new mongoose.Schema({
  grade: { type: String, required: true },
  subject: { type: String, required: true },
  resourceType: { type: String, required: true },
  year: { type: String, required: true },
  link: { type: String, required: true },
  uploadedBy: { type: String, default: 'admin' }
}, { timestamps: true });

module.exports = mongoose.model('CourseMaterial', CourseMaterialSchema);
