"use strict";

const { productModal } = require("../product.modal");
const ProductRepository = require("../repositories/product.repo");

class Product {
  constructor({
    name,
    thumb,
    description,
    price,
    quantity,
    type,
    shop,
    attributes,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.price = price;
    this.quantity = quantity;
    this.type = type;
    this.shop = shop;
    this.attributes = attributes;
  }

  async createProduct(productId) {
    return await productModal.create({ ...this, _id: productId });
  }

  async updateProduct(productId, payload) {
    return await ProductRepository.update({
      id: productId,
      payload,
      model: productModal,
    });
  }
}

module.exports = Product;
