"use strict";

const { Types } = require("mongoose");
const { productModel } = require("../product.model");
const {
  selectData,
  unselectData,
  convertToObjectId,
} = require("../../utils/mongo.utils");

const queryProducts = async ({ query, limit, skip }) => {
  return await productModel
    .find(query)
    .populate("shop", "-_id name email")
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

class ProductRepository {
  static findSelect = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = productModel
      .find({ ...filter, isPublished: true, isDraft: false })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(selectData(select))
      .lean();

    return products;
  };

  static findOneUnselect = async ({ id, unselect }) => {
    return await productModel
      .findOne({ _id: convertToObjectId(id) })
      .select(unselectData(unselect))
      .lean();
  };

  static findOneById = async ({ id }) => {
    return await productModel.findOne({ _id: convertToObjectId(id) }).lean();
  };

  static find = async ({ query, limit, skip }) => {
    return await queryProducts({ query, limit, skip });
  };

  static searchByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch);
    const results = await productModel
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

  static publishByShop = async ({ shopId, id }) => {
    const foundShop = await productModel.findOne({
      shop: convertToObjectId(shopId),
      _id: convertToObjectId(id),
    });
    if (!foundShop) return null;
    foundShop.isDraft = false;
    foundShop.isPublished = true;
    await foundShop.save();
    return foundShop;
  };

  static unpublishByShop = async ({ shopId, id }) => {
    const foundShop = await productModel.findOne({
      shop: convertToObjectId(shopId),
      _id: convertToObjectId(id),
    });
    if (!foundShop) return null;
    foundShop.isDraft = true;
    foundShop.isPublished = false;
    await foundShop.save();
    return foundShop;
  };

  static update = async ({ id, payload, model, isNew = true }) => {
    return await model.findByIdAndUpdate(id, payload, {
      new: isNew,
    });
  };
}

module.exports = ProductRepository;
