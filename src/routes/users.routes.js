import { Router } from "express";
import {
  deserializeUser,
  requireUser,
} from "../middlewares/deserializeUser.middleware.js";

export const usersRouter = Router();

usersRouter.get("/me", requireUser, async (req, res) => {
  res.status(200).json({ user: res.locals.user });
});
