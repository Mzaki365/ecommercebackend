const { body, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const productValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  handleValidationErrors,
];

module.exports = { productValidator };
