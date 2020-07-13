const fs = require("fs");
const csv = require("fast-csv");
const uid = require('uniqid');
const path = require("path");
const OrderModel = require('../models/orderModel');
const ProductModel = require("../models/productModel");

const getPhone = agent => {    
    const from = agent.originalRequest.payload.data.From;
    return from.replace("whatsapp:", '');
}

const makeOrder = async (agent) => {
    const orderFilename = uid.process();
    const phone = getPhone(agent);
    const _products = agent.parameters.products;
    const products = _products.split(",").map((_prod) => {
        return _prod.split('of').map(el => el.trim());
    });

    const invalidRequest = products.some(([, prodId]) => prodId.charAt(0) !== "#");
    if (invalidRequest) {
        agent.add("Please, use # before each product code");
        return;
    }
    
    const orderResult = await Promise.all(products.map(async ([count, prodId]) => {
        const productId = prodId.substr(1);

        // TODO: validation no more stock(no negative values)
        const currentProduct = await ProductModel.findOneAndUpdate(
          { productId },
          {
            $inc: { stock: -parseInt(count, 10) },
          },
          { new: true }
        ).exec();
          
        const resultOrder = {
          ticketId: orderFilename,
          productId: currentProduct.productId,
          quantity: currentProduct.stock,
          description: currentProduct.descrip,
        //   netPrice: ,
          phone,
        };

        const order = new OrderModel(resultOrder);
        await order.save();

        return resultOrder;
    }));

    console.log(orderResult);

    const ws = fs.createWriteStream(
      path.resolve(process.cwd(), "public", `${orderFilename}.csv`)
    );
    
    return new Promise((resolve, reject) => {
        csv
          .write(orderResult, { headers: true })
          .pipe(ws)
          .on("finish", () => {
            console.log("orden created");
            agent.add(`${process.env.NGROK_URL}/${orderFilename}.csv`);
            resolve("ok");
          });
    });

}

module.exports = makeOrder;