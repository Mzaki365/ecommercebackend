const express = require("express");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
} = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const { productValidator } = require("../validators/productValidator");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/upload", protect, upload.single("image"), (req, res) => {
  res.send(`/${req.file.path}`);
});


// Private routes
router.post("/", protect, productValidator, createProduct);
router.get("/user/my-products", protect, getMyProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

module.exports = router;
