"use strict";

const pick = require("lodash/pick");

const projectionData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

module.exports = { projectionData };
