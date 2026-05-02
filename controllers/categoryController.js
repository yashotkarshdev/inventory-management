import Category from "../models/category.js";
import cloudinary from "../config/cloudinary.js";
import slugify from "../utils/slugify.js";


// 🔥 CREATE
export const createCategory = async (req, res) => {
  try {
    let { name, description, gst } = req.body;
    console.log(req.body);
    

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    name = name.trim();
    const slug = slugify(name);

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let imageUrl = "";
    let publicId = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "warehouse/categories",
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const category = await Category.create({
      name,
      slug,
      gst: gst,
      description,
      image: imageUrl,
      imagePublicId: publicId,
    });

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 GET
export const getCategories = async (req, res) => {
  try {
    const data = await Category.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 UPDATE
export const updateCategory = async (req, res) => {
  try {
    let { name, description, gst, status } = req.body;
    console.log(req.body);

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (name) {
      name = name.trim();
      category.name = name;
      category.slug = slugify(name);
    }

    category.description = description || category.description;
    category.gst = gst || category.gst;
    category.status = status || category.status;

    // 🔥 IMAGE REPLACE
    if (req.file) {
      // delete old image
      if (category.imagePublicId) {
        await cloudinary.uploader.destroy(category.imagePublicId);
      }

      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "warehouse/categories",
      });

      category.image = result.secure_url;
      category.imagePublicId = result.public_id;
    }

    await category.save();

    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔥 DELETE (WITH CLOUDINARY CLEANUP)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 delete image from cloudinary
    if (category.imagePublicId) {
      await cloudinary.uploader.destroy(category.imagePublicId);
    }

    await category.deleteOne();

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};