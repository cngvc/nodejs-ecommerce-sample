"use strict";

const { BadRequestError } = require("../core/responses/error.response");
const {
  productModal,
  clothingModal,
  electronicModal,
  furnitureModal,
} = require("../models/product.modal");
const ProductRepository = require("../models/repositories/product.repo");

class ProductFactory {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static createProduct = async (type, payload) => {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type");
    }
    return new productClass(payload).createProduct();
  };

  static searchByUser = async ({ keySearch }) => {
    return await ProductRepository.searchByUser({ keySearch });
  };

  static findOne = async ({ product }) => {
    return await ProductRepository.findOne({
      product,
      unselect: ["__v"],
    });
  };

  static findAll = async ({ limit = 50, sort = "ctime", page = 1, filter }) => {
    return await ProductRepository.findAll({
      limit,
      sort,
      page,
      filter,
      select: ["name", "price", "thumb"],
    });
  };

  static findAllDraftByShop = async ({ shop, limit = 50, skip = 0 }) => {
    const query = { shop, isDraft: true };
    return await ProductRepository.find({ query, limit, skip });
  };

  static findAllPublishedByShop = async ({ shop, limit = 50, skip = 0 }) => {
    const query = { shop, isPublished: true };
    return await ProductRepository.find({ query, limit, skip });
  };

  static publishByShop = async ({ shop, product }) => {
    return await ProductRepository.publishByShop({ shop, product });
  };

  static unpublishByShop = async ({ shop, product }) => {
    return await ProductRepository.unpublishByShop({ shop, product });
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

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModal.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newFurniture) {
      throw new BadRequestError("New furniture created error");
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new BadRequestError("New product created error");
    }
    return newProduct;
  }
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
