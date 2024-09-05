"use strict";

const CartRepository = require("../models/repositories/cart.repo");
const ProductRepository = require("../models/repositories/product.repo");
const DiscountService = require("../services/discount.service");
const InventoryService = require("../services/inventory.service");
const { convertToObjectId } = require("../utils/mongo.utils");
const { BadRequestError } = require("../core/responses/error.response");
const redisServiceInstance = require("../services/redis.service");
const orderModel = require("../models/order.model");

class CheckoutService {
  static checkoutReview = async ({ cartId, userId, shopOrders = [] }) => {
    const foundCart = await CartRepository.findOne({
      _id: convertToObjectId(cartId),
    });
    if (!foundCart) {
      throw new BadRequestError("Cart not found");
    }

    const checkoutOrder = {
      totalPrice: 0,
      feeShip: 0,
      totalDiscount: 0,
      totalCheckout: 0,
    };
    const newShopOrders = [];

    // calculate total price of the bill
    for (const shopOrder of shopOrders) {
      const { shopId, discounts = [], itemProducts = [] } = shopOrder;

      const productsForCheckout =
        await ProductRepository.findProductsForCheckout(itemProducts);

      if (productsForCheckout.some((e) => !e)) {
        throw new BadRequestError("Some of products was wrong");
      }
      const checkoutPrices = productsForCheckout.reduce(
        (prev, product) => prev + product.price * product.quantity,
        0
      );
      checkoutOrder.totalPrice += checkoutPrices;
      const itemCheckout = {
        shopId,
        discounts,
        priceInit: checkoutPrices,
        priceApplyDiscount: checkoutPrices,
        itemProducts: productsForCheckout,
      };

      if (discounts.length > 0) {
        for (const discount of discounts) {
          const { discountAmount = 0 } =
            await DiscountService.calculateDiscountAmount({
              code: discount.code,
              userId,
              shopId,
              products: productsForCheckout,
            });
          checkoutOrder.totalDiscount += discountAmount;
          if (discountAmount) {
            itemCheckout.priceApplyDiscount -= discountAmount;
          }
        }
      }
      checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount;
      newShopOrders.push(itemCheckout);
    }

    return {
      checkoutOrder,
      newShopOrders,
    };
  };

  static orderByUser = async ({
    shopOrders,
    cardId,
    userId,
    userAddress,
    userPayment,
  }) => {
    const { checkoutOrder, newShopOrders } = CheckoutService.checkoutReview({
      cartId,
      userId,
      shopOrders,
    });
    const products = checkoutOrder.flapMap((order) => order.itemProducts);

    const acquireProducts = [];
    for await (const product of products) {
      const { id, quantity } = product;
      const keyLock = await redisServiceInstance.acquireLock(
        id,
        quantity,
        cardId
      );
      acquireProducts.push(!!keyLock);
      if (keyLock) {
        await redisServiceInstance.releaseLock(keyLock);
      }
    }

    if (acquireProducts.includes(false)) {
      throw new BadRequestError(
        "Some of goods have been updated, please check your cart again"
      );
    }

    const newOrder = await orderModel.create({
      userId,
      checkoutOrder,
      shipping: userAddress,
      payment: userPayment,
      products: newShopOrders,
    });

    if (newOrder) {
    }

    return newOrder;
  };

  static findOrdersByUser = ({}) => {};

  static findOneOrderByUser = ({}) => {};

  static cancelOrderByUser = ({}) => {};

  static updateOrderStatusByShop = ({}) => {};
}

module.exports = CheckoutService;
