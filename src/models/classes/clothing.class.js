"use strict";

const Product = require("./product.class");
const { clothingModal } = require("../product.modal");
const { BadRequestError } = require("../../core/responses/error.response");
const ProductRepository = require("../repositories/product.repo");

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModal.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newClothing) {
      throw new BadRequestError("New clothing creation error");
    }
    const newProduct = await super.createProduct(newClothing._id);
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
        model: clothingModal,
      });
    }
    return await super.updateProduct(productId, payload);
  }
}

module.exports = Clothing;