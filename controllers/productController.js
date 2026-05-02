import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

// CREATE
export const createProduct = async (req, res) => {
  try {
    const { name, category, price, gst, brand, description, status } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "warehouse/products",
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const product = await Product.create({
      name,
      category,
      price,
      gst: gst || 0,
      brand,
      description,
      status,
      image: imageUrl,
      imagePublicId: publicId,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
export const getProducts = async (req, res) => {
  try {
    const data = await Product.find()
      .populate("category", "name") // 🔥 important
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    return res.status(404).json({ message: "Not found" });
  }

  res.json(product);
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    const { name, category, price, gst, brand, description, status } = req.body;

    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.gst = gst ?? product.gst;
    product.brand = brand || product.brand;
    product.description = description || product.description;
    product.status = status || product.status;

    // IMAGE UPDATE
    if (req.file) {
      if (product.imagePublicId) {
        await cloudinary.uploader.destroy(product.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "warehouse/products",
      });

      product.image = result.secure_url;
      product.imagePublicId = result.public_id;
    }

    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Not found" });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    await product.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};