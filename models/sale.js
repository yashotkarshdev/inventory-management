// import mongoose from "mongoose";

// const saleSchema = new mongoose.Schema(
//   {
//     items: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//           required: true,
//         },
//         name: String,
//         price: Number,
//         quantity: Number,
//         total: Number,
//       },
//     ],

//     totalAmount: {
//       type: Number,
//       required: true,
//     },

//     paymentMethod: {
//       type: String,
//       default: "cash",
//     },

//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Sale", saleSchema);

import mongoose from "mongoose";
const saleSchema = new mongoose.Schema(
  {
    user: { // 🔥 ADD THIS
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: String,
        price: Number,
        gst: Number,
        gstAmount: Number,
        quantity: Number,
        total: Number,
      },
    ],

    totalAmount: Number,
    paymentMethod: String,
  },
  { timestamps: true }
);

export default mongoose.model("Sale", saleSchema);