const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const {
  registerValidator,
  loginValidator,
} = require("../validators/userValidator");

const router = express.Router();

// Public routes
router.post("/register", registerValidator, registerUser);
router.post("/login", loginValidator, loginUser);

// Private routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

module.exports = router;

