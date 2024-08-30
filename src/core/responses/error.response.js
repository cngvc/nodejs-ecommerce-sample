"use strict";

const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const STATUS_CODE = {
  FORBIDDEN: StatusCodes.FORBIDDEN,
  CONFLICT: StatusCodes.CONFLICT,
  BAD_REQUEST: StatusCodes.BAD_REQUEST,
  UNAUTHORIZED: StatusCodes.UNAUTHORIZED,
  NOT_FOUND: StatusCodes.NOT_FOUND,
};

const REASON_STATUS_CODE = {
  FORBIDDEN: ReasonPhrases.BAD_REQUEST,
  CONFLICT: ReasonPhrases.CONFLICT,
  BAD_REQUEST: ReasonPhrases.BAD_REQUEST,
  UNAUTHORIZED: ReasonPhrases.UNAUTHORIZED,
  NOT_FOUND: ReasonPhrases.NOT_FOUND,
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.CONFLICT,
    statusCode = STATUS_CODE.CONFLICT
  ) {
    super(message, statusCode);
  }
}

class BadRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.BAD_REQUEST,
    statusCode = STATUS_CODE.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}

class AuthFailedError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.UNAUTHORIZED,
    statusCode = STATUS_CODE.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.NOT_FOUND,
    statusCode = STATUS_CODE.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = REASON_STATUS_CODE.FORBIDDEN,
    statusCode = STATUS_CODE.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
  AuthFailedError,
  NotFoundError,
  ForbiddenRequestError,
};
