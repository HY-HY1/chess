import { NextResponse } from "next/server";

export class RequestError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode = 400, details?: any) {
    super(message);
    this.name = "RequestError";
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  private static createResponse(
    message: string,
    statusCode: number,
    details?: any
  ) {
    return NextResponse.json(
      { error: message, details },
      { status: statusCode }
    );
  }

  static BadRequest(message = "Bad Request", details?: any) {
    return this.createResponse(message, 400, details);
  }

  static Unauthorized(message = "Unauthorized", details?: any) {
    return this.createResponse(message, 401, details);
  }

  static Forbidden(message = "Forbidden", details?: any) {
    return this.createResponse(message, 403, details);
  }

  static NotFound(message = "Not Found", details?: any) {
    return this.createResponse(message, 404, details);
  }

  static Conflict(message = "Conflict", details?: any) {
    return this.createResponse(message, 409, details);
  }

  static UnprocessableEntity(message = "Unprocessable Entity", details?: any) {
    return this.createResponse(message, 422, details);
  }

  static TooManyRequests(message = "Too Many Requests", details?: any) {
    return this.createResponse(message, 429, details);
  }

  static ServerError(message = "Server-Side Error", details?: any) {
    return this.createResponse(message, 500, details);
  }
}
