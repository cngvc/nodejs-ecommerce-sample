"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();

router.post("/shops/signup", accessController.signup);

module.exports = router;
