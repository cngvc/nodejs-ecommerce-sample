"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";

const discountSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "fixed_amount", // percentage
    },
    value: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    maxUses: {
      type: Number,
      required: true,
    },
    usesCount: {
      type: Number,
      required: true,
    },
    usersUsed: {
      type: Array,
      default: [],
    },
    maxUsesPerUser: {
      type: Number,
      require: true,
    },
    minOrderValue: {
      type: Number,
      require: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    appliesTo: {
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    productIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, discountSchema);
