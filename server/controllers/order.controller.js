const Order = require("../models/Order");

//CREATE
const createOrder = async (req, res) => {
    const newOrder = new Order(req.body);

    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
};

//UPDATE
const updateOrder = async (req, res) => {
    if (req.role === "Admin") {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(
                req.params.id,
                {
                    $set: req.body,
                },
                { new: true }
            );
            res.status(200).json(updatedOrder);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You don't have permission to interact with this");
    }
};

//DELETE
const deleteOrder = async (req, res) => {
    if (req.role === "Admin") {
        try {
            await Order.findByIdAndDelete(req.params.id);
            res.status(200).json("Order has been deleted...");
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You don't have permission to interact with this");
    }
};

//GET USER ORDERS
const getOrder = async (req, res) => {
    try {
        const orders = await Order.find({ user: { _id: req.params.userId } })
            .populate("user", ["username", "email", "role"])
            .populate("products");
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json(err);
    }
};

//GET ALL
const getAllOrder = async (req, res) => {
    if (req.role === "Admin") {
        try {
            const orders = await Order.find()
                .populate("user", ["username", "email", "role"])
                .populate("products");
            res.status(200).json(orders);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You don't have permission to interact with this");
    }
};

// GET MONTHLY INCOME
const getIncome = async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    if (req.role === "Admin") {
        try {
            const income = await Order.aggregate([
                { $match: { createdAt: { $gte: previousMonth } } },
                {
                    $project: {
                        month: { $month: "$createdAt" },
                        sales: "$amount",
                    },
                },
                {
                    $group: {
                        _id: "$month",
                        total: { $sum: "$sales" },
                    },
                },
            ]);
            res.status(200).json(income);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("You don't have permission to interact with this");
    }
};

module.exports = { createOrder, updateOrder, deleteOrder, getOrder, getAllOrder, getIncome };
