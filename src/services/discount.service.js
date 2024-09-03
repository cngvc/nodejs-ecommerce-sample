"use strict";

const discountModel = require("../models/discount.model");
const {
  BadRequestError,
  NotFoundError,
} = require("../core/responses/error.response");
const ProductRepository = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils/mongo.utils");
const DiscountRepository = require("../models/repositories/discount.repo");

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
    if (new Date(startDate) >= new Date(endDate)) {
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
      products = await ProductRepository.findSelect({
        filter: {},
        limit,
        page,
        select: ["name"],
      });
    } else if (foundDiscount.appliesTo === "specific") {
      products = await ProductRepository.findSelect({
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

  static findDiscountsByShop = async ({ shopId, limit = 50, page = 1 }) => {
    const discounts = await DiscountRepository.findUnselect({
      filter: {
        shop: convertToObjectId(shopId),
      },
      limit,
      page,
      unselect: ["__v", "shop"],
    });
    return discounts;
  };

  static calculateDiscountAmount = async ({
    code,
    userId,
    shopId,
    products,
  }) => {
    const foundDiscount = await DiscountRepository.findOne({
      filter: {
        code,
        shop: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) {
      throw new NotFoundError("Discount not found");
    }
    if (!foundDiscount.isActive) {
      throw new BadRequestError("Discount is inactive");
    }
    if (!foundDiscount.maxUses) {
      throw new BadRequestError("Discount are out");
    }
    if (
      new Date() < new Date(foundDiscount.startDate) ||
      new Date() > new Date(foundDiscount.endDate)
    ) {
      throw new BadRequestError("Discount has expired");
    }

    let totalOrder = 0;
    if (foundDiscount.minOrderValue > 0) {
      totalOrder = products.reduce(
        (pre, prod) => pre + prod.price * prod.quantity,
        0
      );
      if (totalOrder < foundDiscount.minOrderValue) {
        throw new BadRequestError(
          `Discount requires a minium order value of ${foundDiscount.minOrderValue}`
        );
      }
    }

    if (foundDiscount.maxUsesPerUser > 0) {
      const userUsedDiscount = foundDiscount.usersUsed.filter(
        (e) => e === userId
      );
      if (userUsedDiscount.length > foundDiscount.maxUsesPerUser) {
        throw new BadRequestError(
          `You have used this discount more than the allowed number of times`
        );
      }
    }

    const discountAmount =
      foundDiscount.type === "fixed_amount"
        ? foundDiscount.value
        : totalOrder * (foundDiscount.value / 100);

    return {
      totalOrder,
      discountAmount,
      totalPrice: Math.max(0, totalOrder - discountAmount),
    };
  };

  static deleteDiscount = async ({ shopId, code }) => {
    return await DiscountRepository.findOneAndDelete({
      shop: convertToObjectId(shopId),
      code,
    });
  };

  static cancelDiscount = async ({ shopId, userId, code }) => {
    const foundDiscount = await DiscountRepository.findOne({
      shop: convertToObjectId(shopId),
      code,
    });
    if (!foundDiscount) {
      throw new NotFoundError("Discount not found");
    }
    const result = await DiscountRepository.findByIdAndUpdate(
      foundDiscount._id,
      {
        $pull: {
          usersUsed: userId,
        },
        $inc: {
          maxUses: 1,
          usesCount: -1,
        },
      }
    );
    return result;
  };
}

module.exports = DiscountService;
