const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        username: { type: String, required: true },
        userId: { type: String, required: true },
        products: [{ productId: String, quantity: Number }],
        total: { type: Number },
        address: { type: String, required: true },
        status: { type: String, default: "Pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
