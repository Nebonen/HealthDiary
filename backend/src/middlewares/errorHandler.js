import {validationResult} from 'express-validator';

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500); // default is 500 if err.status is not defined
  res.json({
    message: err.message || 'Internal Server Error',
    status: err.status || 500,
    errors: err.errors,
  });
};

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error); // forward error to error handler
};

/**
 * Custom middleware for handling and formatting validation errors
 * @param {object} req - request object
 * @param {object} res - response object
 * @param {function} next - next function
 * @return {*} next function call
 */
const validationErrorHandler = (req, res, next) => {
  const errors = validationResult(req, {strictParams: ['body']});
  if (!errors.isEmpty()) {
    const error = new Error('Bad Request');
    error.status = 400;
    error.errors = errors.array({onlyFirstError: true}).map((error) => {
      return {field: error.path, message: error.msg};
    });
    return next(error);
  }
  next();
};

export {errorHandler, notFoundHandler, validationErrorHandler};
