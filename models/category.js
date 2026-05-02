import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    gst: {
      type: Number,
      default: 0,
    },

    slug: {
      type: String,
      unique: true,
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String, // Cloudinary URL
      default: "",
    },

    imagePublicId: {
      type: String, // delete ke liye
      default: "",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);