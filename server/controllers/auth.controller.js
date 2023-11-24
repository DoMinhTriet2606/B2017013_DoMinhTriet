const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

// @route POST api/auth/register
// @desc Register user
// @access public
const register = async (req, res) => {
    const { username, email, password } = req.body;

    // Simple validation
    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }
    try {
        // Check for existing user
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // All good
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        // Return token
        const accessToken = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: "User saved successfully",
            accessToken: accessToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// @route POST api/auth/login
// @desc Login user
// @access public
const login = async (req, res) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Missing email and/or password" });
    }

    try {
        // Check for existing user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password! Please try again ^^",
            });
        }

        // Username found
        const passwordValid = await argon2.verify(user.password, password);

        if (!passwordValid) {
            return res.status(400).json({
                success: false,
                message: "Incorrect email or password! Please try again ^^",
            });
        }

        // All good
        // Return token
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: "User logged in successfully",
            accessToken: accessToken,
            user: { userId: user._id, username: user.username, email: user.email, role: user.role },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { register, login };
