const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        title: { type: String, required: true, unique: true },
        desc: { type: String, required: true },
        img: { type: Array, required: true },
        categories: String,
        size: String,
        price: { type: Number, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
