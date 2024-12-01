const { body } = require('express-validator');

const userValidationRules = {
  register: [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['student', 'professor']).withMessage('Invalid role'),
    body('batch').optional().isString().withMessage('Invalid batch'),
    body('batches').optional().isArray().withMessage('Invalid batches')
  ],
  login: [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
  ]
};

module.exports = userValidationRules;