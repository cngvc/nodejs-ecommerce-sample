"use strict";

const ProductService = require("../services/product.service");
const {
  CreatedRequestSuccess,
  OkRequestSuccess,
} = require("../core/responses/success.response");

class ProductController {
  createProduct = async (req, res) => {
    const data = req.body;

    return new CreatedRequestSuccess({
      message: "New product created successfully",
      metadata: await ProductService.createProduct(data.type, {
        ...data,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res) => {
    const data = req.body;
    return new OkRequestSuccess({
      message: "Updated product successfully",
      metadata: await ProductService.updateProduct(data.type, req.params.id, {
        ...data,
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getOne = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.findOne({
        id: req.params.id,
      }),
    }).send(res);
  };

  getMany = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.find(req.query),
    }).send(res);
  };

  getDraftsByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.findDraftByShop({
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getPublishedByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.findPublishedByShop({
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getListSearchProduct = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.searchByUser({
        keySearch: req.query["q"],
      }),
    }).send(res);
  };

  publishByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.publishByShop({
        shopId: req.user.userId,
        id: req.params.id,
      }),
    }).send(res);
  };

  unpublishByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.unpublishByShop({
        shopId: req.user.userId,
        id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
