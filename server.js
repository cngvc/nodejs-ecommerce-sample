"use strict";

const app = require("./src/app");
const DbSeed = require("./src/dbs/seed");
const keyTokenModel = require("./src/models/keyToken.model");
const shopModel = require("./src/models/shop.model");

const PORT = 3055;

const server = app.listen(PORT, async () => {
  console.log(`Server is starting with port ${PORT}`);

  // remove collections
  await DbSeed.createDbSeed();
});
