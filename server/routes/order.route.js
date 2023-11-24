const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const orderController = require("../controllers/order.controller");

router.get("/find/:userId", orderController.getOrder);
router.get("/", verifyToken, orderController.getAllOrder);
router.get("/income", verifyToken, orderController.getIncome);
router.post("/", verifyToken, orderController.createOrder);
router.put("/:id", verifyToken, orderController.updateOrder);
router.delete("/:id", verifyToken, orderController.deleteOrder);

module.exports = router;
