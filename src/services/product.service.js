"use strict";

const ProductFactory = require("../factories/product.factory");
const ProductRepository = require("../models/repositories/product.repo");
const InventoryRepository = require("../models/repositories/inventory.repo");

class ProductService {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static createProduct = async (type, payload) => {
    const productInstance = ProductFactory.createProductInstance(type, payload);
    const newProduct = await productInstance.createProduct();
    if (newProduct) {
      await InventoryRepository.createInventory({
        productId: newProduct._id,
        shopId: newProduct.shop,
        stock: newProduct.quantity,
      });
    }
    return newProduct;
  };

  static updateProduct = async (type, id, payload) => {
    const product = ProductFactory.createProductInstance(type, payload);
    return await product.updateProduct(id);
  };

  static searchByUser = async ({ keySearch }) => {
    return await ProductRepository.searchByUser({ keySearch });
  };

  static findOne = async ({ id }) => {
    return await ProductRepository.findOne({
      id,
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

  static publishByShop = async ({ shopId, id }) => {
    return await ProductRepository.publishByShop({ shopId, id });
  };

  static unpublishByShop = async ({ shopId, id }) => {
    return await ProductRepository.unpublishByShop({ shopId, id });
  };
}

module.exports = ProductService;
