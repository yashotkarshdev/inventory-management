// import Product from "../models/Product.js";
// import Stock from "../models/Stock.js";

// export const getDashboard = async (req, res) => {
//   try {
//     // 🔥 TOTAL PRODUCTS
//     const totalProducts = await Product.countDocuments();

//     // 🔥 TOTAL STOCK & VALUE
//     const products = await Product.find();

//     let totalQuantity = 0;
//     let totalValue = 0;

//     products.forEach(p => {
//       totalQuantity += p.quantity || 0;
//       totalValue += (p.price || 0) * (p.quantity || 0);
//     });

//     // 🔥 LOW STOCK (<5)
//     const lowStock = products.filter(p => (p.quantity || 0) < 5);

//     // 🔥 TODAY IN / OUT
//     const today = new Date();
//     today.setHours(0,0,0,0);

//     const stockToday = await Stock.find({
//       createdAt: { $gte: today }
//     });

//     let todayIn = 0;
//     let todayOut = 0;

//     stockToday.forEach(s => {
//       if (s.type === "IN") todayIn += s.quantity;
//       else todayOut += s.quantity;
//     });

//     res.json({
//       totalProducts,
//       totalQuantity,
//       totalValue,
//       lowStockCount: lowStock.length,
//       todayIn,
//       todayOut,
//     });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import Product from "../models/product.js";
import Stock from "../models/stock.js";
import Sale from "../models/sale.js";

export const getDashboard = async (req, res) => {
  try {
    // 🔥 TOTAL PRODUCTS
    const totalProducts = await Product.countDocuments();

    // 🔥 TOTAL STOCK + VALUE
    const products = await Product.find();

    let totalQuantity = 0;
    let totalValue = 0;
    let lowStockCount = 0;

    products.forEach(p => {
      totalQuantity += p.quantity;
      totalValue += p.quantity * p.price;

      if (p.quantity < 10) lowStockCount++;
    });

    // 🔥 TODAY RANGE
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 🔥 TODAY IN
    const todayInAgg = await Stock.aggregate([
      {
        $match: {
          type: "IN",
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    // 🔥 TODAY OUT
    const todayOutAgg = await Stock.aggregate([
      {
        $match: {
          type: "OUT",
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" }
        }
      }
    ]);

    // 🔥 TOTAL SALES ₹
    const totalSalesAgg = await Sale.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    // 🔥 TODAY SALES ₹
    const todaySalesAgg = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: today }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    res.json({
      totalProducts,
      totalQuantity,
      totalValue,
      lowStockCount,
      todayIn: todayInAgg[0]?.total || 0,
      todayOut: todayOutAgg[0]?.total || 0,
      totalSales: totalSalesAgg[0]?.total || 0,
      todaySales: todaySalesAgg[0]?.total || 0,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};