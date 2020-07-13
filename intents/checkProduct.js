const ProducModel = require('../models/productModel');

const checkProduct = async (agent) => {
    const _product = agent.parameters.product;
    if (_product.charAt(0) !== '#') {
        agent.add("Please, use # before product code");
        return;
    }

    const productId = _product.substr(1);
    const productFound = await ProducModel.findOne({ productId }).exec();

    if (!productFound) {
        agent.add('There is not registry of this product');
        return;
    }

    const { descrip, stock } = productFound;
    agent.add(`${descrip}, stock: ${stock}`);
}

module.exports = checkProduct;
