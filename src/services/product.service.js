"use strict";

const { BadRequestError } = require("../core/responses/error.response");
const {
  productModal,
  clothingModal,
  electronicModal,
} = require("../models/product.modal");

class ProductFactory {
  static createProduct = async (type, payload) => {
    switch (type) {
      case "Electronic":
        return new Electronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError("Invalid product type");
    }
  };
}

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

  async createProduct(_id) {
    return await productModal.create({ ...this, _id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModal.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newClothing) {
      throw new BadRequestError("New clothing created error");
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new BadRequestError("New product created error");
    }
    return newProduct;
  }
}

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModal.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newElectronic) {
      throw new BadRequestError("New electronic created error");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("New product created error");
    }
    return newProduct;
  }
}

module.exports = ProductFactory;
