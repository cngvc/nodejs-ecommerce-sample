"use strict";

const pick = require("lodash/pick");

const projectionData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

const selectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unselectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

module.exports = { projectionData, selectData, unselectData };
