
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const dbConnect = require("./src/config/db");
const userRoutes = require("./src/routes/userRoutes");
const productRoutes = require("./src/routes/productRoutes");
const { notFound, errorHandler } = require("./src/middlewares/errorMiddleware");

// Load environment variables
dotenv.config();

// Connect database
dbConnect();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API running successfully",
  });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

