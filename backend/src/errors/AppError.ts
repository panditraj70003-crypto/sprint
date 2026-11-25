export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = "APP_ERROR";
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}
