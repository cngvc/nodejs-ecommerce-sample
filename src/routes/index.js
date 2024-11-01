"use strict";

const express = require("express");
const { apiKey, permission } = require("../middlewares/apiKey.middleware");

const router = express.Router();

// check api-key
router.use(apiKey);

// check permission
router.use(permission(1));

router.use("/v1/api/inventories", require("./inventory.route"));
router.use("/v1/api/checkouts", require("./checkout.route"));
router.use("/v1/api/carts", require("./cart.route"));
router.use("/v1/api/discounts", require("./discount.route"));
router.use("/v1/api/products", require("./product.route"));
router.use("/v1/api/public-products", require("./publicProduct.route"));
router.use("/v1/api/auth", require("./access.route"));

module.exports = router;
