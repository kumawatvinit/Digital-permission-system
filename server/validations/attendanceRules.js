const { body } = require('express-validator');

const attendanceValidationRules = {
  create: [
    body('batch').trim().notEmpty().withMessage('Batch is required'),
    body('course').trim().notEmpty().withMessage('Course is required'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('expiresAt').isISO8601().withMessage('Invalid expiration date format'),
  ],
  submit: [
    body('status').isIn(['present', 'late']).withMessage('Invalid status'),
  ],
};

module.exports = attendanceValidationRules;