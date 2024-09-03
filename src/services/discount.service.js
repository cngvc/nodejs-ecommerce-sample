"use strict";

const discountModel = require("../models/discount.model");
const { BadRequestError } = require("../core/responses/error.response");
const ProductRepository = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils/mongo.utils");

class DiscountService {
  static createDiscount = async (payload) => {
    const {
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      shop,
      isActive,
      appliesTo,
      productIds,
    } = payload;
    if (
      new Date() > new Date(endDate) ||
      new Date(startDate) >= new Date(endDate)
    ) {
      throw new BadRequestError("Discount dates invalid");
    }

    const foundDiscount = await discountModel.findOne({
      code,
      shop,
      isActive: true,
    });
    if (foundDiscount) {
      throw new BadRequestError("Discount exists");
    }

    const newDiscount = await discountModel.create({
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      maxUses,
      maxUsesPerUser,
      minOrderValue,
      shop,
      isActive,
      appliesTo,
      productIds,
      usesCount: 0,
    });

    return newDiscount;
  };

  // static updateDiscount = () => {};

  static findProductsByDiscount = async ({
    code,
    shopId,
    limit = 50,
    page = 1,
  }) => {
    const foundDiscount = await discountModel.findOne({
      code,
      shop: convertToObjectId(shopId),
      isActive: true,
    });
    if (!foundDiscount) {
      throw new BadRequestError("Discount not found");
    }
    let products = [];
    if (foundDiscount.appliesTo === "all") {
      products = await ProductRepository.findAll({
        filter: {},
        limit,
        page,
        select: ["name"],
      });
    } else if (foundDiscount.appliesTo === "specific") {
      products = await ProductRepository.findAll({
        filter: {
          _id: {
            $in: convertToObjectId(foundDiscount.productIds),
          },
          shop: req.user.shopId,
        },
        limit,
        page,
        select: ["name"],
      });
    }
    return products;
  };
}

module.exports = DiscountService;
