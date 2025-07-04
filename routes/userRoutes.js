const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:username", userController.getUserbyUsername);
router.get("/", userController.getAllUsers);
module.exports = router;
