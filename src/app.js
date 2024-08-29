require("dotenv").config();

const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const { countConnect, checkOverload } = require("./helpers/check.connect");

const app = express();

// middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// db
require("./dbs/init.mongodb");
countConnect();
checkOverload();

// route

// handling error

module.exports = app;
