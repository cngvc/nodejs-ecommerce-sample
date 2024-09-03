"use strict";

const discountModel = require("../models/discount.model");
const { BadRequestError } = require("../core/responses/error.response");
const { Types } = require("mongoose");
const ProductRepository = require("../models/repositories/product.repo");

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
      userId,
      isActive,
      appliesTo,
      productIds,
    } = payload;
    if (
      new Date() > new Date(endDate) ||
      new Date() < new Date(startDate) ||
      new Date(startDate) >= new Date(endDate)
    ) {
      throw new BadRequestError("Discount dates invalid");
    }

    const foundDiscount = await discountModel.findOne({
      code,
      shop: new Types.ObjectId(userId),
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
      shop: new Types.ObjectId(shopId),
      isActive,
      appliesTo,
      productIds,
    });

    return newDiscount;
  };

  // static updateDiscount = () => {};

  static findProductsByDiscount = async ({
    code,
    shopId,
    userId,
    limit,
    page,
  }) => {
    const foundDiscount = await discountModel.find({
      code,
      shop: new Types.ObjectId(shopId),
      isActive: true,
    });
    if (!foundDiscount) {
      throw new BadRequestError("Discount not found");
    }
    let products = [];
    if (foundDiscount.appliesTo === "all") {
      products = await ProductRepository.findAll({
        filter: {
          shopId: req.user.shopId,
        },
      });
    }
  };
}

module.exports = DiscountService;
