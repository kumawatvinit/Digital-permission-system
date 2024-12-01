const { body } = require('express-validator');

const meetingValidationRules = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('date').isISO8601().withMessage('Invalid date format'),
    body('time').trim().notEmpty().withMessage('Time is required'),
    body('batches').isArray().withMessage('Batches must be an array'),
  ],
  update: [
    body('title').optional().trim().notEmpty().withMessage('Title is required'),
    body('date').optional().isISO8601().withMessage('Invalid date format'),
    body('time').optional().trim().notEmpty().withMessage('Time is required'),
    body('batches').optional().isArray().withMessage('Batches must be an array'),
  ],
};

module.exports = meetingValidationRules;