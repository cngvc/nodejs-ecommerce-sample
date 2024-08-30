"use strict";

const { default: mongoose } = require("mongoose");
const os = require("os");
const process = require("process");

const countConnect = () => {
  const connectionCount = mongoose.connections.length;
  console.log(`Number of connections: ${connectionCount}`);
};

const CHECK_OVERLOAD_INTERVAL_TIME = 60000;

const checkOverload = () => {
  setInterval(() => {
    const connectionCount = mongoose.connections.length;
    const coresCount = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    const maximumConnections = coresCount * 5;

    console.log(`Active connection: ${connectionCount}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (connectionCount > maximumConnections) {
      console.log("Connection overload detected");
    }
  }, CHECK_OVERLOAD_INTERVAL_TIME);
};

module.exports = {
  countConnect,
  checkOverload,
};
