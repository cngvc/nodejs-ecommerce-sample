"use strict";

const express = require("express");
const InventoryController = require("../controllers/inventory.controller");
const { asyncHandler } = require("../helpers/asyncHandler");
const { validateAuthentication } = require("../utils/auth.utils");

const router = express.Router();

router.use(asyncHandler(validateAuthentication));
router.post("/", asyncHandler(InventoryController.addStockToInventory));

module.exports = router;
