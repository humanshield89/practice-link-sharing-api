import { Router } from "express";
import { validateEmailAndPassword } from "../validation.utils.js";
import { UserModel } from "../models/users.model.js";
import { createUser } from "../../services/users.service.js";
import { createSession } from "../../services/session.service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const err = validateEmailAndPassword(email, password);

    if (err) {
      return res.status(400).json({ message: err.error });
    }

    // check if user already exists
    const exist = await UserModel.countDocuments({ email });

    if (exist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create new user
    const newUser = await createUser(email, password);

    if (!newUser) {
      return res.status(500).json({ message: "Internal Server error" });
    }

    const session = await createSession(newUser._id);

    if (!session) {
      return res.status(500).json({ message: "Failed to create User session" });
    }

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      session,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const err = validateEmailAndPassword(email, password);

    if (err) {
      return res.status(400).json({ message: err.error });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await user.comparePassword(password);

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const session = await createSession(user._id);

    if (!session) {
      return res.status(500).json({ message: "Failed to create User session" });
    }

    return res.json({
      message: "User logged in successfully",
      user,
      session,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});
