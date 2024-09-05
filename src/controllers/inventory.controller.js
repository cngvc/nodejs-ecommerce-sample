"use strict";

const { OkRequestSuccess } = require("../core/responses/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res) => {
    return new OkRequestSuccess({
      metadata: await InventoryService.addStockToInventory({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
