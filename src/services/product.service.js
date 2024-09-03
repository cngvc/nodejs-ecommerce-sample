"use strict";

const ProductFactory = require("../factories/product.factory");
const ProductRepository = require("../models/repositories/product.repo");

class ProductService {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static createProduct = async (type, payload) => {
    const product = ProductFactory.createProductInstance(type, payload);
    return await product.createProduct();
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

  static publishByShop = async ({ shop, id }) => {
    return await ProductRepository.publishByShop({ shop, id });
  };

  static unpublishByShop = async ({ shop, id }) => {
    return await ProductRepository.unpublishByShop({ shop, id });
  };
}

module.exports = ProductService;
