const { body } = require('express-validator');

const requestValidationRules = {
  create: [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('professorId').notEmpty().withMessage('Professor ID is required'),
    body('type').isIn(['leave', 'deadline-extension', 'special', 'custom'])
      .withMessage('Invalid request type')
  ],
  update: [
    body('status').optional().isIn(['pending', 'approved', 'rejected', 'forwarded'])
      .withMessage('Invalid status'),
    body('remarks').optional().trim().isLength({ min: 1, max: 500 })
      .withMessage('Remarks must be between 1 and 500 characters'),
    body('professorApproval.status').optional().isIn(['approved', 'rejected'])
      .withMessage('Invalid approval status'),
    body('professorApproval.remarks').optional().trim().isLength({ max: 500 })
      .withMessage('Approval remarks must not exceed 500 characters')
  ]
};

module.exports = requestValidationRules;