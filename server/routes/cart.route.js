const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const cartController = require("../controllers/cart.controller");

router.get("/find/:userId", cartController.getCart);
router.get("/", verifyToken, cartController.getAllCart);
router.post("/", verifyToken, cartController.createCart);
router.put("/:id", verifyToken, cartController.updateCart);
router.delete("/:id", verifyToken, cartController.deleteCart);
router.delete("/delAll/:id", verifyToken, cartController.deleteAllCart);

module.exports = router;
