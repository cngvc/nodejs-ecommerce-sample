"use strict";

const pick = require("lodash/pick");
const pickBy = require("lodash/pickBy");
const identity = require("lodash/identity");
const { Types } = require("mongoose");

const projectionData = ({ fields = [], object = {} }) => {
  return pick(object, fields);
};

const selectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unselectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const deleteFalsely = (obj) => {
  return pickBy(obj, identity);
};

const convertToObjectId = (val) => {
  if (Array.isArray(val)) {
    return val.map((e) => new Types.ObjectId(e));
  }
  return new Types.ObjectId(val);
};

const flattenNestedObject = (obj, prefix = "", result = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return flattenNestedObject(value, newPrefix, result);
    } else {
      result[newPrefix] = value;
    }
  }
  return result;
};

module.exports = {
  projectionData,
  selectData,
  unselectData,
  deleteFalsely,
  flattenNestedObject,
  convertToObjectId,
};
