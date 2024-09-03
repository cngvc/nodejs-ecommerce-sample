"use strict";

const Product = require("./product.class");
const { clothingModel } = require("../product.model");
const { BadRequestError } = require("../../core/responses/error.response");
const ProductRepository = require("../repositories/product.repo");

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
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
    const payload = deleteFalsely(this);
    if (payload.attributes) {
      await ProductRepository.update({
        id: productId,
        payload: flattenNestedObject(payload.attributes),
        model: clothingModel,
      });
    }
    return await super.updateProduct(productId, flattenNestedObject(payload));
  }
}

module.exports = Clothing;
