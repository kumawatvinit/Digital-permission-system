const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const requestValidationRules = () => [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('professorId').notEmpty().withMessage('Professor ID is required'),
  body('type').isIn(['leave', 'deadline-extension', 'special', 'custom'])
    .withMessage('Invalid request type')
];

module.exports = {
  validateRequest,
  requestValidationRules
};