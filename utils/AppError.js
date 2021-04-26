class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; //because we don't want to send programming errors to the client

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
