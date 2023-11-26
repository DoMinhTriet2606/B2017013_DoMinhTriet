const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        products: [
            {
                type: Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
        total: { type: Number },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        status: { type: String, default: "Pending" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
