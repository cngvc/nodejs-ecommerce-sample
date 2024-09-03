"use strict";

const Product = require("./product.class");
const { electronicModal } = require("../../models/product.modal");
const { BadRequestError } = require("../../core/responses/error.response");
const ProductRepository = require("../repositories/product.repo");

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModal.create({
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
    const payload = this;
    if (payload.attributes) {
      await ProductRepository.update({
        id: productId,
        payload,
        model: electronicModal,
      });
    }
    return await super.updateProduct(productId, payload);
  }
}

module.exports = Electronic;
