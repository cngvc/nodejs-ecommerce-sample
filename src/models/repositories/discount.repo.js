"use strict";

const discountModel = require("../discount.model");
const { selectData, unselectData } = require("../../utils/mongo.utils");

class DiscountRepository {
  static findSelect = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = discountModel
      .find({ ...filter, isActive: true })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(selectData(select))
      .lean();

    return products;
  };

  static findUnselect = async ({ limit, sort, page, filter, unselect }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    const products = discountModel
      .find({ ...filter, isActive: true })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(unselectData(unselect))
      .lean();

    return products;
  };

  static findOne = async ({ filter }) => {
    return await discountModel.findOne(filter).lean();
  };

  static findOneAndDelete = async ({ filter }) => {
    return await discountModel.findOneAndDelete(filter);
  };

  static findByIdAndUpdate = async (id, filter) => {
    return await discountModel.findByIdAndUpdate(id, filter);
  };
}

module.exports = DiscountRepository;
