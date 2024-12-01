const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  batch: { type: String, required: true },
  course: { type: String, required: true },
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  status: { type: String, enum: ['active', 'closed'], required: true },
  students: [
    {
      studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['present', 'late', 'NA'] },
      submittedAt: { type: Date },
    },
  ],
});

module.exports = mongoose.model('Attendance', attendanceSchema);