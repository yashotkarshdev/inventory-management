import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);