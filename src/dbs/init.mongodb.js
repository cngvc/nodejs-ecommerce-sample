"use strict";

const env = require("../configs/config.mongodb");
const { default: mongoose } = require("mongoose");

const connectString = `mongodb://${env.db.host}:${env.db.port}/${env.db.name}`;
class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    mongoose.set("debug", true);
    mongoose.set("debug", { color: true });

    console.log(connectString);
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log("Connected MongoDB success");
      })
      .catch((err) => {
        console.log("Connected failed: ", err);
      });
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const dbInstance = Database.getInstance();
module.exports = dbInstance;
