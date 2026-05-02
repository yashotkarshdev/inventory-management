import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (role === "admin") {
      return res.status(403).json({ message: "Cannot create admin" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role,
    });

    res.json({
      message: "User created",
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 DELETE USER
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ खुद को delete मत करने दे
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot delete yourself" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};