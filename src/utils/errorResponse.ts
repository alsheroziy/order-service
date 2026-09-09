export class ErrorResponse extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg: string = 'bad request'): ErrorResponse {
    return new ErrorResponse(msg, 400);
  }

  static unauthorized(msg: string = 'unauthorized'): ErrorResponse {
    return new ErrorResponse(msg, 401);
  }

  static forbidden(msg: string = 'forbidden'): ErrorResponse {
    return new ErrorResponse(msg, 403);
  }

  static notFound(msg: string = 'not found'): ErrorResponse {
    return new ErrorResponse(msg, 404);
  }

  static conflict(msg: string = 'conflict'): ErrorResponse {
    return new ErrorResponse(msg, 409);
  }

  static unprocessable(msg: string = 'unprocessable entity'): ErrorResponse {
    return new ErrorResponse(msg, 422);
  }

  static internal(msg: string = 'internal server error'): ErrorResponse {
    return new ErrorResponse(msg, 500);
  }
}
