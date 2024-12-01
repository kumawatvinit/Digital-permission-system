const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'forwarded'], required: true },
  type: { type: String, enum: ['leave', 'deadline-extension', 'special', 'custom'], required: true },
  createdAt: { type: Date, default: Date.now },
  remarks: { type: String },
  professorApproval: {
    status: { type: String, enum: ['approved', 'rejected'] },
    remarks: { type: String },
    date: { type: Date },
  },
  hodApproval: {
    status: { type: String, enum: ['approved', 'rejected'] },
    remarks: { type: String },
    date: { type: Date },
  },
});

module.exports = mongoose.model('Request', requestSchema);