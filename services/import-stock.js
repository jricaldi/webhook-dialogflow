const fs = require("fs");
const csv = require('fast-csv');
const path = require("path");
const ProductModel = require('../models/productModel');

const saveProduct = async (product) => {
    const pm = new ProductModel({
      productId: product.codart,
      descrip: product.descrip,
      resto: product.resto,
      peso: product.peso,
      stock: product.stock,
    });
    await pm.save();
}

const importStock = async () => {
    return new Promise((resolve, reject) => {
        fs.createReadStream(
          path.resolve(process.cwd(), "local-data", "ImportStock.csv")
        )
          .pipe(csv.parse({ headers: true, ignoreEmpty: true }))
          .on("error", (error) => console.error(error))
          .on("data", saveProduct)
          .on("end", (rowCount) => {
            console.log(`Parsed ${rowCount} rows`);
            resolve("ok");
          });
    });    
}

module.exports = importStock;