import { Router } from "express";
import {
  deserializeUser,
  requireUser,
} from "../middlewares/deserializeUser.middleware.js";
import { ProfileModel } from "../models/profile.model.js";
import { resizeImageCenterCover } from "../image.utils.js";
// import promise fs
import { promises as fs } from "fs";

export const usersRouter = Router();

usersRouter.get("/me", requireUser, async (req, res) => {
  let profile = await ProfileModel.findOne({ user: res.locals.user._id });
  if (!profile) {
    // create one
    profile = await ProfileModel.create({
      user: res.locals.user._id,
    });
  }

  res.status(200).json({ user: res.locals.user, profile });
});

usersRouter.get("/profile/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    let profile = await ProfileModel.findOne({ user: userId });
    if (!profile) {
      // first check if the user exists
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json("User not found");
      }
      profile = await ProfileModel.create({
        user: userId,
      });
    }
    res.status(200).json({ profile });
  } catch (e) {
    res.status(400).json({ message: e.message || "Something went wrong" });
  }
});

usersRouter.patch("/profile", requireUser, async (req, res) => {
  const user = res.locals.user;

  const { firstName, lastName, email, links } = req.body;

  //
  const picture = req.files?.picture;

  let imageExternalURl;
  if (picture) {
    const resized = await resizeImageCenterCover(picture, 512, 512);

    const picturePath = `./static/public/${picture.md5}.webp`;

    // save the resized image to the path
    await fs.writeFile(picturePath, resized);

    imageExternalURl = `${req.protocol}://${req.get("host")}/static/public/${
      picture.md5
    }.webp`;
  }
  const profile = await ProfileModel.findOne({ user: user._id });

  if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
  }

  if (firstName) {
    profile.firstName = firstName;
  }

  if (lastName) {
    profile.lastName = lastName;
  }

  if (email) {
    profile.email = email;
  }

  if (links) {
    profile.links = links;
  }

  if (picture) {
    const oldUrl = profile.profilePicture;

    const filePath = oldUrl ? oldUrl.split("/").slice(-1)[0] : "";

    if (filePath && oldUrl !== imageExternalURl)
      // user can upload the same image twice
      await fs.unlink(`./static/public/${filePath}`);

    profile.profilePicture = imageExternalURl;
  }

  try {
    await profile.save();

    res.status(201).json({ profile });
  } catch (e) {
    res.status(400).json({ message: e.message || "Something went wrong" });
  }
});
