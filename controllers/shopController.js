import Shop from "../models/Shop.js";

// CREATE
export const createShop = async (req, res) => {
  try {
    const { name, location } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name required" });
    }

    const exists = await Shop.findOne({ name, location });
    if (exists) {
      return res.status(400).json({ message: "Shop already exists" });
    }

    const shop = await Shop.create({ name, location });

    res.json(shop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL
export const getShops = async (req, res) => {
  const data = await Shop.find().sort({ createdAt: -1 });
  res.json(data);
};

// GET ONE
export const getShopById = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) return res.status(404).json({ message: "Not found" });

  res.json(shop);
};

// UPDATE
export const updateShop = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) return res.status(404).json({ message: "Not found" });

  const { name, location, status } = req.body;

  shop.name = name || shop.name;
  shop.location = location || shop.location;
  shop.status = status || shop.status;

  await shop.save();

  res.json(shop);
};

// DELETE
export const deleteShop = async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) return res.status(404).json({ message: "Not found" });

  await shop.deleteOne();

  res.json({ message: "Deleted" });
};