const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const productControllers = require("../controllers/product.controller");

router.post("/", productControllers.createProduct);
router.put("/:id", verifyToken, productControllers.updateProduct);
router.delete("/:id", verifyToken, productControllers.deleteProduct);
router.get("/find/:id", productControllers.findProduct);
router.get("/", productControllers.getAllProducts);

module.exports = router;
