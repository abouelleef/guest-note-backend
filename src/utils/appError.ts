export default class AppError extends Error {

  status: string = 'error';
  isOperational = true;

  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }

}

