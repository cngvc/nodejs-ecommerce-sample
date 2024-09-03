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

    return new CreatedRequestSuccess({
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

  getAll = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.findAll(req.query),
    }).send(res);
  };

  getAllDraftsByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.findAllDraftByShop({
        shop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublishedByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.findAllPublishedByShop({
        shop: req.user.userId,
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
        shop: req.user.userId,
        id: req.params.id,
      }),
    }).send(res);
  };

  unpublishByShop = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await ProductService.unpublishByShop({
        shop: req.user.userId,
        id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
