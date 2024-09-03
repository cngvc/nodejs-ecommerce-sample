"use strict";

const Product = require("./product.class");
const { electronicModel } = require("../product.model");
const { BadRequestError } = require("../../core/responses/error.response");
const ProductRepository = require("../repositories/product.repo");
const {
  deleteFalsely,
  flattenNestedObject,
} = require("../../utils/mongo.utils");

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("New electronic creation error");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("New product creation error");
    }
    return newProduct;
  }

  async updateProduct(productId) {
    const payload = deleteFalsely(this);
    if (payload.attributes) {
      await ProductRepository.update({
        id: productId,
        payload: flattenNestedObject(payload.attributes),
        model: electronicModel,
      });
    }
    return await super.updateProduct(productId, flattenNestedObject(payload));
  }
}

module.exports = Electronic;
