import Stock from "../models/stock.js";
import Product from "../models/product.js";

// CREATE STOCK (CORE LOGIC)
export const createStock = async (req, res) => {
  try {
    const { product, quantity, type } = req.body;


    if (!product || !quantity || !type) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const prod = await Product.findById(product);

    if (!prod) {
      return res.status(404).json({ message: "Product not found" });
    }

    const qty = Number(quantity);
    if (qty <= 0) {
  return res.status(400).json({ message: "Quantity must be greater than 0" });
}

    // 🔥 NEGATIVE BLOCK
    if (type === "OUT" && prod.quantity < qty) {
      return res.status(400).json({
        message: `Only ${prod.quantity} items available`,
      });
    }

    // 🔥 UPDATE PRODUCT QUANTITY
    if (type === "IN") {
      prod.quantity += qty;
    } else {
      prod.quantity -= qty;
    }

    await prod.save();

    // 🔥 SAVE HISTORY
    const stock = await Stock.create({
      product,
      quantity: qty,
      type,
    });

    res.json(stock);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET STOCK LIST
export const getStock = async (req, res) => {
  try {
    const data = await Stock.find()
      .populate("product", "name image quantity")
      .sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// DELETE STOCK (OPTIONAL SAFE VERSION)
export const deleteStock = async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) return res.status(404).json({ message: "Not found" });

  const product = await Product.findById(stock.product);

  // 🔥 REVERSE EFFECT
  if (stock.type === "IN") {
    product.quantity -= stock.quantity;
  } else {
    product.quantity += stock.quantity;
  }

  await product.save();
  await stock.deleteOne();

  res.json({ message: "Deleted & reversed" });
};

export const getStockSummary = async (req, res) => {
  try {
    const data = await Stock.aggregate([
      {
        $group: {
          _id: "$product",
          totalIn: {
            $sum: {
              $cond: [{ $eq: ["$type", "IN"] }, "$quantity", 0],
            },
          },
          totalOut: {
            $sum: {
              $cond: [{ $eq: ["$type", "OUT"] }, "$quantity", 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          product: {
            name: "$product.name",
            image: "$product.image",
            quantity: "$product.quantity",
          },
          totalIn: 1,
          totalOut: 1,
        },
      },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};