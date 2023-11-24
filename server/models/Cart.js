const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema(
    {
        userId: { type: String, required: true },
        productId: { type: String, required: true },
        quantity: { type: Number, default: 1 },
        title: { type: String, required: true },
        img: { type: Array, required: true },
        size: { type: String, required: true },
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

// Index the compound key to ensure uniqueness
CartSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", CartSchema);
