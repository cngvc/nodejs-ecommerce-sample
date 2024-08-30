"use strict";

require("dotenv").config();

const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { countConnect, checkOverload } = require("./helpers/check.connect");
const bodyParser = require("body-parser");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// db
require("./dbs/init.mongodb");
countConnect();
checkOverload();

// route
app.use(require("./routes"));

// handling error

module.exports = app;
