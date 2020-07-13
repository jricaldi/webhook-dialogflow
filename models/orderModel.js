const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  ticketId: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  // netPrice: { type: Number },
  phone: { type: String, required: true },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
