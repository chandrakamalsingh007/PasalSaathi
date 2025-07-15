import shopModel from "../Model/shopModel.js";
import productModel from "../Model/productModel.js";

import fs from "fs";

// add product
const addProduct = async (req, res) => {
  const {
    name,
    description,
    category,
    unit,
    image,
    purchasePrice,
    sellingPrice,
    quantity,
    shopId,
  } = req.body;

  const image_filename = req.file ? `${req.file.filename}` : null;

  if (
    !name ||
    !category ||
    !unit ||
    !purchasePrice ||
    !sellingPrice ||
    !quantity ||
    !shopId
  ) {
    return res.status(400).json({
      message: "Please provide all required fields.",
    });
  }

  try {
    const selectedShop = await shopModel.findOne({
      _id: shopId,
      email: req.user.email,
    });

    if (!selectedShop) {
      return res.status(403).json({ message: "Unauthorized or invalid shop." });
    }

    const existingProduct = await productModel.findOne({
      shop: shopId,
      name: name.trim().toLowerCase(),
    });

    if (existingProduct) {
      return res.status(403).json({
        message: "Product already exists, you can go to update product.!!",
        product: existingProduct,
      });
    }

    const addProduct = await productModel.create({
      shop: shopId,
      name: name.trim().toLowerCase(),
      description: description,
      category: category,
      unit: unit,
      image: image_filename,
      purchasePrice: purchasePrice,
      sellingPrice: sellingPrice,
      quantity: quantity,
    });
    res.status(200).json({
      success: true,
      message: "Product added successfully !!",
      product: addProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err.message);
    res.status(500).json({
      success: false,
      message: "Server error while adding product",
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    description,
    unit,
    purchasePrice,
    sellingPrice,
    quantity,
    shopId,
  } = req.body;

  const image_filename = req.file ? `${req.file.filename}` : null;

  if (!shopId) {
    return res.status(400).json({ message: "shop ID is required." });
  }

  try {
    const selectedShop = await shopModel.findOne({
      _id: shopId,
      email: req.user.email,
    });

    if (!selectedShop) {
      return res.status(403).json({ message: "Unauthorized or invalid shop." });
    }

    const product = await productModel.findOne({ _id: id, shop: shopId });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (name) product.name = name.trim().toLowerCase();
    if (description) product.description = description;
    if (category) product.category = category;
    if (unit) product.unit = unit;
    if (purchasePrice !== undefined) product.purchasePrice = purchasePrice;
    if (sellingPrice !== undefined) product.sellingPrice = sellingPrice;
    if (quantity !== undefined) product.quantity = quantity;
    if (image_filename) product.image = image_filename;

    await product.save();
    await product.save();
    return res.status(200).json({
      message: "Product Updated successfully!!",
      product: product,
    });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(500).json({ message: "Server error while updating product" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const {shopId} = req.query;
  if (!shopId) {
    return res.status(400).json({ message: "shop ID is required." });
  }

  try {
    const selectedShop = await shopModel.findOne({
      _id: shopId,
      email: req.user.email,
    });
    if (!selectedShop) {
      return res.status(403).json({ message: "Unauthorized or invalid shop." });
    }

    const product = await productModel.findOne({
      _id: id,
      shop: shopId,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    fs.unlinkSync(`storage/${product.image}`);
    await productModel.deleteOne({
      _id: id,
    });
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ message: "Server error while deleting product" });
  }
};

export { addProduct, updateProduct,deleteProduct };
