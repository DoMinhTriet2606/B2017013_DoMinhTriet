const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const adminController = require("../controllers/admin.controller");

router.get("/user/:id", verifyToken, adminController.getUser);
router.get("/customers", verifyToken, adminController.getCustomers);

module.exports = router;
