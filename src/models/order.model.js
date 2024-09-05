"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";

const orderSchema = new Schema(
  {
    userId: { type: Number, required: true },
    checkoutOrder: {
      type: Object,
      default: {},
    },
    shipping: {
      type: Object,
      default: {},
    },
    payment: {
      type: Object,
      default: {},
    },
    products: {
      type: Array,
      required: true,
    },
    trackingNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "cancelled"],
      default: "pending ",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, orderSchema);
