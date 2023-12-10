import { Router } from "express";
import { validateEmailAndPassword } from "../validation.utils.js";
import { UserModel } from "../models/users.model.js";
import { createUser } from "../../services/users.service.js";
import { createSession } from "../../services/session.service.js";
import { ProfileModel } from "../models/profile.model.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const err = validateEmailAndPassword(email, password);

    if (err.error) {
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

    const profile = await ProfileModel.create({
      user: newUser._id,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
      session,
      profile,
    });
  } catch (e) {
    res.status(500).json({ message: "Internal Server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const err = validateEmailAndPassword(email, password);

    if (err.error) {
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

    // you can group promises and await them all at once
    // this means that both this promises will run at the same time
    // instead of waiting for one to finish before the other
    const sessionPromise = createSession(user._id);
    const profilePromise = ProfileModel.findOne({ user: user._id });

    // await the promises
    let [session, profile] = await Promise.all([
      sessionPromise,
      profilePromise,
    ]);

    if (!session) {
      return res.status(500).json({ message: "Failed to create User session" });
    }

    if (!profile) {
      // create it
      profile = await ProfileModel.create({
        user: user._id,
      });

      console.log(profile);
    }

    return res.json({
      message: "User logged in successfully",
      user,
      session,
      profile: profile,
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ message: "Internal Server error" });
  }
});
