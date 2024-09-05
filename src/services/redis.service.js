"use strict";

const redis = require("redis");
const { promisify } = require("util");
const InventoryRepository = require("../models/repositories/inventory.repo");

class RedisService {
  static instance;
  constructor() {
    if (RedisService.instance) {
      return RedisService.instance;
    }

    this.redisClient = redis.createClient();
    this.pExpireAsync = promisify(redisClient.pExpire).bind(redisClient);
    this.setNXAsync = promisify(redisClient.setNX).bind(redisClient);
    this.delAsyncKey = promisify(redisClient.del).bind(redisClient);

    RedisService.instance = this;
    return this;
  }

  acquireLock = async (productId, quantity, cartId) => {
    const key = `LOCK_V2024_${productId}`;
    const retryTime = 10;
    const expireTime = 3000;

    for (let index = 0; index < retryTime; index++) {
      const result = await setNXAsync(key, expireTime);
      if (result === 1) {
        const isReservation = await InventoryRepository.reservationInventory({
          productId,
          quantity,
          cartId,
        });
        if (isReservation) {
          await RedisService.pExpireAsync(key, expireTime);
          return key;
        }
        return null;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
    }
  };

  releaseLock = async (keyLock) => {
    return await delAsyncKey(keyLock);
  };
}

module.exports = new RedisService();
