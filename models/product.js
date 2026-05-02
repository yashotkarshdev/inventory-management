import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: { type: Number, default: 0 },
    gst: {
      type: Number,
      default: 0, // %
    },

    quantity: {                // 🔥 ADD THIS
      type: Number,
      default: 0,
    },

    brand: { type: String, default: "" },

    description: { type: String, default: "" },

    image: { type: String, default: "" },

    imagePublicId: { type: String, default: "" },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);