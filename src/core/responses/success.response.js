"use strict";

const STATUS_CODE = {
  OK: 200,
  CREATED: 201,
};

const REASON_STATUS_CODE = {
  OK: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    status = STATUS_CODE.OK,
    reasonStatusCode = REASON_STATUS_CODE.OK,
    metadata = {},
  }) {
    this.message = message ? message : reasonStatusCode;
    this.status = status;
    this.metadata = metadata;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OkRequestSuccess extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedRequestSuccess extends SuccessResponse {
  constructor({ message, metadata }) {
    super({
      message,
      status: STATUS_CODE.CREATED,
      reasonStatusCode: REASON_STATUS_CODE.CREATED,
      metadata,
    });
  }
}

module.exports = {
  OkRequestSuccess,
  CreatedRequestSuccess,
};
