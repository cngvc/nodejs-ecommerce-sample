"use strict";

const shopModal = require("../models/shop.modal");

class ShopService {
  static findByEmail = async ({
    email,
    select = {
      email: 1,
      password: 2,
      name: 1,
      status: 1,
      roles: 1,
    },
  }) => {
    return await shopModal.findOne({ email }).select(select).lean();
  };
}

module.exports = ShopService;
