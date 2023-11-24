const User = require("../models/User");

const getUser = async (req, res) => {
    if (req.role === "Admin") {
        try {
            const user = await User.findById(req.params.id).select("-password");
            if (!user) return res.status(400).json({ success: false, message: "User not found" });
            res.json({ success: true, user: user });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    } else {
        res.json({ success: false, message: "You are not allowed to access this page" });
    }
};

const getCustomers = async (req, res) => {
    if (req.role === "Admin") {
        try {
            const customers = await User.find({ role: "Customer" }).select("-password");
            if (!customers)
                return res.status(400).json({ success: false, message: "Customer not found" });
            res.json({ success: true, customers });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    } else {
        res.json({ success: false, message: "You are not allowed to access this page" });
    }
};

module.exports = { getUser, getCustomers };
