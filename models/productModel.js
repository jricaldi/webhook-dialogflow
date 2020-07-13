const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  productId: { type: String, required: true, unique: true },
  descrip: { type: String, required: true },
  resto: { type: Number, required: true },
  peso: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;