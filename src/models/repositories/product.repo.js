"use strict";

const { Types } = require("mongoose");
const { productModal } = require("../product.modal");
const { selectData, unselectData } = require("../../utils/mongo.utils");

const queryProducts = async ({ query, limit, skip }) => {
  return await productModal
    .find(query)
    .populate("shop", "-_id name email")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

class ProductRepository {
  static findAll = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = productModal
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(selectData(select))
      .lean();

    return products;
  };

  static findOne = async ({ product, unselect }) => {
    return await productModal
      .findOne({ _id: new Types.ObjectId(product) })
      .select(unselectData(unselect))
      .lean();
  };

  static find = async ({ query, limit, skip }) => {
    return await queryProducts({ query, limit, skip });
  };

  static searchByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await productModal
      .find(
        {
          $text: { $search: regexSearch },
          isDraft: false,
          isPublished: true,
        },
        {
          score: {
            $meta: "textScore",
          },
        }
      )
      .lean();
    return results;
  };

  static publishByShop = async ({ shop, product }) => {
    const foundShop = await productModal.findOne({
      shop: new Types.ObjectId(shop),
      _id: new Types.ObjectId(product),
    });
    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    await foundShop.save();
    return foundShop;
  };

  static unpublishByShop = async ({ shop, product }) => {
    const foundShop = await productModal.findOne({
      shop: new Types.ObjectId(shop),
      _id: new Types.ObjectId(product),
    });
    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    await foundShop.save();
    return foundShop;
  };
}

module.exports = ProductRepository;