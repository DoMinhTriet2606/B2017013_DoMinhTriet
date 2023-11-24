const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const user = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        if (!user) return res.status(400).json({ success: false, message: "User not found" });
        res.json({ success: true, user: user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    // Simple validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        // Get user from the database
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Verify old password
        const isOldPasswordValid = await argon2.verify(user.password, oldPassword);

        if (!isOldPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid old password" });
        }

        // Check if new password and confirm new password match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ success: false, message: "New passwords do not match" });
        }

        // Hash the new password
        const hashedNewPassword = await argon2.hash(newPassword);

        // Update user's password
        user.password = hashedNewPassword;
        await user.save();

        // Return token
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: "Password changed successfully",
            accessToken: accessToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { user, changePassword };
