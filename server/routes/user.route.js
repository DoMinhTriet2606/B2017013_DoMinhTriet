const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

router.get("/profile", verifyToken, userController.user);
router.put("/change-password", verifyToken, userController.changePassword);

module.exports = router;
