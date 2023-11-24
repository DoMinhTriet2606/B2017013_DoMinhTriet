const Cart = require("../models/Cart");

//GET USER CART
const getCart = async (req, res) => {
    try {
        const cart = await Cart.find({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
};

const createCart = async (req, res) => {
    const { _id, userId, productId, ...cartDetails } = req.body;
    console.log(cartDetails);

    try {
        const newCart = new Cart({
            userId,
            productId,
            ...cartDetails,
        });

        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        console.log(error);
        if (error.code === 11000) {
            // Handle duplicate key error (cart with the same userId and productId already exists)
            const existingCart = await Cart.findOne({ userId, productId });

            if (existingCart) {
                // Update the existing cart if found
                existingCart.quantity += 1;
                const savedCart = await existingCart.save();
                return res.status(200).json(savedCart);
            }
        }

        // Handle other errors
        res.status(500).json(error);
    }
};

//UPDATE
const updateCart = async (req, res) => {
    const { quantity } = req.body;
    try {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                quantity,
            },
            { new: true }
        );
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
};

//DELETE
const deleteCart = async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Cart has been deleted...");
    } catch (err) {
        res.status(500).json(err);
    }
};

const deleteAllCart = async (req, res) => {
    const userId = req.params.id; // Use req.params instead of req.body
    console.log(userId);

    try {
        await Cart.deleteMany({ userId: userId });
        res.status(200).json(`All carts for userId ${userId} have been deleted.`);
    } catch (err) {
        res.status(500).json(err);
    }
};

const getAllCart = async (req, res) => {
    if (req.role === "Admin") {
        try {
            const carts = await Cart.find();
            res.status(200).json(carts);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You don't have permission to interact with this");
    }
};

module.exports = { getCart, createCart, updateCart, deleteCart, getAllCart, deleteAllCart };
