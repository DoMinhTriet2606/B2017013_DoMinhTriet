require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRouter = require("./routes/auth.route");
const userRouter = require("./routes/user.route");
const productRouter = require("./routes/product.route");
const cartRouter = require("./routes/cart.route");
const orderRouter = require("./routes/order.route");
const adminRouter = require("./routes/admin.route");

const connectDB = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@mevn-ecommerce.3tywxw4.mongodb.net/?retryWrites=true&w=majority`
        );
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
};

connectDB();

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRouter);

app.all("*", (req, res) => {
    res.status(404);

    if (req.accepts("json")) {
        res.json({ error: "404 Not Found" });
    } else {
        res.type("text").send("404 Not Found");
    }
});

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`);
});
