"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "ApiKey";
const COLLECTION_NAME = "ApiKeys";

const apiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    permissions: {
      type: [Number],
      required: true,
      enum: [1, 2, 3, 4],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, apiKeySchema);
