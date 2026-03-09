const Product = require("../models/productModel");

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, image } = req.body;

    const product = await Product.create({
      user: req.user._id,
      name,
      description,
      price,
      category,
      stock: stock || 0,
      image: image || "",
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getAllProducts = async (req, res, next) => {
  try {
    const pageSize = 5;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.keyword
      ? {
          name: { $regex: req.query.keyword, $options: "i" },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });

    const products = await Product.find({ ...keyword })
      .populate("user", "name email")
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    next(error);
  }
};;

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (owner only)
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Only the owner can update
    if (product.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }

    const { name, description, price, category, stock, image } = req.body;

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.stock = stock !== undefined ? stock : product.stock;
    product.image = image !== undefined ? image : product.image;

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (owner only)
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Only the owner can delete
    if (product.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get products created by logged-in user
// @route   GET /api/products/my-products
// @access  Private
const getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getMyProducts,
};
