const Clothing = require("../models/classes/clothing.class");
const Electronic = require("../models/classes/electronic.class");
const Furniture = require("../models/classes/furniture.class");
const { BadRequestError } = require("../core/responses/error.response");

class ProductFactory {
  static productRegistry = {};

  static registerProductType = (type, classRef) => {
    ProductFactory.productRegistry[type] = classRef;
  };

  static createProductInstance = (type, payload) => {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) {
      throw new BadRequestError("Invalid product type");
    }
    return new productClass(payload);
  };
}

ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
