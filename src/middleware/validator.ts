import logger from '../configs/logger';

const { body, validationResult } = require('express-validator');

const validatePayload = [
  body('bookedWeeks').isArray().withMessage('Booked weeks must be an array'),
  body('bookedWeeks.*.name').isString().withMessage('Week name must be a string').escape(),
  body('bookedWeeks.*.bookedDays').isArray().withMessage('Booked days must be an array'),
  body('bookedWeeks.*.bookedDays.*').isString().withMessage('Each booked day must be a string').escape(),
  body('bookedWeeks.*.maxDays').isInt().withMessage('Max days must be an integer'),

  body('firstChild.firstChild').isBoolean().withMessage('firstChild must be a boolean'),
  body('firstChild.firstName').isString().withMessage('firstName must be a string').escape(),
  body('firstChild.lastName').isString().withMessage('lastName must be a string').escape(),
  body('firstChild.birthday').isISO8601().withMessage('birthday must be a valid ISO8601 date'),
  body('firstChild.gender').isString().withMessage('gender must be a string').escape(),
  body('firstChild.allowanceToGoHomeAlone').isBoolean().withMessage('allowanceToGoHomeAlone must be a boolean'),
  body('firstChild.allergies').isString().withMessage('allergies must be a string').escape(),

  body('secondChild').custom((value) => {
    if (Object.keys(value).length === 0) return true; // Allow empty object for secondChild
    return true;
  }),
  body('secondChild.firstChild').optional().isBoolean().withMessage('firstChild must be a boolean'),
  body('secondChild.firstName').optional().isString().withMessage('firstName must be a string').escape(),
  body('secondChild.lastName').optional().isString().withMessage('lastName must be a string').escape(),
  body('secondChild.birthday').optional().isISO8601().withMessage('birthday must be a valid ISO8601 date'),
  body('secondChild.gender').optional().isString().withMessage('gender must be a string').escape(),
  body('secondChild.allowanceToGoHomeAlone').optional().isBoolean().withMessage('allowanceToGoHomeAlone must be a boolean'),
  body('secondChild.allergies').optional().isString().withMessage('allergies must be a string').escape(),

  body('customer.firstName').isString().withMessage('firstName must be a string').escape(),
  body('customer.lastName').isString().withMessage('lastName must be a string').escape(),
  body('customer.street').isString().withMessage('street must be a string').escape(),
  body('customer.streetNumber').isString().withMessage('streetNumber must be a string').escape(),
  body('customer.zipCode')
    .matches(/^[0-9]{5}$/)
    .withMessage('zipCode must be 5 digits'),
  body('customer.city').isString().withMessage('city must be a string').escape(),
  body('customer.email').isEmail().withMessage('Invalid email format').normalizeEmail(),
  body('customer.firstPhoneNumber').isString().withMessage('firstPhoneNumber must be a string').escape(),
  body('customer.secondPhoneNumber').isString().withMessage('secondPhoneNumber must be a string').escape(),
  body('customer.optionalMessage').optional().isString().withMessage('optionalMessage must be a string').escape(),
  body('customer.agreementAGB').isBoolean().withMessage('agreementAGB must be a boolean'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn(`Validation errors: ${JSON.stringify(errors.array())}`);
      return res.status(422).end();
    }
    next();
  },
];

export default validatePayload;
