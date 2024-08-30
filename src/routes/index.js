"use strict";

const express = require("express");
const { apiKey, permission } = require("../middlewares/apiKey.middleware");

const router = express.Router();

// check api-key
router.use(apiKey);
router.use(permission(1));

// check permission
router.use("/v1/api/auth", require("./access"));
router.use("/v1/api/products", require("./product"));

module.exports = router;
