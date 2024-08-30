"use strict";

const app = require("./src/app");
const DbSeed = require("./src/dbs/seed");
const keyTokenModal = require("./src/models/keyToken.modal");
const shopModal = require("./src/models/shop.modal");

const PORT = 3055;

const server = app.listen(PORT, async () => {
  console.log(`Server is starting with port ${PORT}`);

  // remove collections
  await DbSeed.createDbSeed();
});
