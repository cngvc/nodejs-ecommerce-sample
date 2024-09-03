"use strict";

const Product = require("./product.class");
const { furnitureModal } = require("../../models/product.modal");
const { BadRequestError } = require("../../core/responses/error.response");
const ProductRepository = require("../repositories/product.repo");
const { flattenNestedObject } = require("../../utils/mongo.utils");

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModal.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("New furniture creation error");
    }
    const newProduct = await super.createProduct(newFurniture._id);
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
        model: furnitureModal,
      });
    }
    return await super.updateProduct(productId, flattenNestedObject(payload));
  }
}

module.exports = Furniture;
