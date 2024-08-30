"use strict";

const { StatusCodes, ReasonPhrases } = require("http-status-codes");

const STATUS_CODE = {
  FORBIDDEN: StatusCodes.FORBIDDEN,
  CONFLICT: StatusCodes.CONFLICT,
};

const REASON_STATUS_CODE = {
  FORBIDDEN: ReasonPhrases.BAD_REQUEST,
  CONFLICT: ReasonPhrases.CONFLICT,
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
    message = REASON_STATUS_CODE.FORBIDDEN,
    statusCode = STATUS_CODE.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  ConflictRequestError,
  BadRequestError,
};
