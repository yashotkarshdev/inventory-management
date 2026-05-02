import Sale from "../models/Sale.js";
import Product from "../models/Product.js";
import Stock from "../models/Stock.js";

// CREATE SALE (🔥 MAIN LOGIC)
export const createSale = async (req, res) => {
    try {
        const { items, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in sale" });
        }

        let totalAmount = 0;

        // 🔥 LOOP ITEMS
        // for (const item of items) {
        //     const product = await Product.findById(item.product);

        //     if (!product) {
        //         return res.status(404).json({ message: "Product not found" });
        //     }

        //     if (product.quantity < item.quantity) {
        //         return res.status(400).json({
        //             message: `${product.name} stock insufficient`,
        //         });
        //     }

        //     // 🔥 IMPORTANT FIX
        //     item.name = product.name;
        //     item.price = product.price;
        //     item.total = product.price * item.quantity;

        //     totalAmount += item.total;

        //     // 🔥 STOCK UPDATE
        //     product.quantity -= item.quantity;
        //     await product.save();

        //     await Stock.create({
        //         product: product._id,
        //         quantity: item.quantity,
        //         type: "OUT",
        //     });
        // }

        for (const item of items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

            if (product.quantity < item.quantity) {
                return res.status(400).json({
                    message: `${product.name} stock insufficient`,
                });
            }

            const price = product.price;
            const gst = product.gst || 0;

            const baseTotal = price * item.quantity;
            const gstAmount = (baseTotal * gst) / 100;
            const finalTotal = baseTotal + gstAmount;

            item.name = product.name;
            item.price = price;
            item.gst = gst; // 🔥 ADD
            item.gstAmount = gstAmount; // 🔥 ADD
            item.total = finalTotal; // 🔥 FIX

            totalAmount += finalTotal;

            // stock update
            product.quantity -= item.quantity;
            await product.save();

            await Stock.create({
                product: product._id,
                quantity: item.quantity,
                type: "OUT",
            });
        }

        // 🔥 SAVE SALE
        // const sale = await Sale.create({
        //     items,
        //     totalAmount,
        //     paymentMethod,
        // });

        const sale = await Sale.create({
            user: req.user.id, // 🔥 CRITICAL
            items,
            totalAmount,
            paymentMethod,
        });

        res.json(sale);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET ALL SALES
// export const getSales = async (req, res) => {
//     try {
//         const data = await Sale.find().sort({ createdAt: -1 });
//         res.json(data);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

export const getSales = async (req, res) => {
    try {
        let query = {};

        // 🔥 अगर sales user है → सिर्फ अपनी sales
        if (req.user.role === "sales") {
            query.user = req.user.id;
        }

        const data = await Sale.find(query)
            .populate("user", "name email") // 🔥 show who sold
            .sort({ createdAt: -1 });

        res.json(data);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};