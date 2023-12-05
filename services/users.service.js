import { UserModel } from "../src/models/users.model.js";
import { Document } from "mongoose";

/**
 * This function assumes you have made all the needed checks
 * Will not throw any errors but will return null if no user is created
 * this is to make sure other parts of the code handle the needed checks
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Document> | null} newly created user
 */
export const createUser = async (email, password) => {
  try {
    const user = new UserModel({ email, password });
    await user.save();
    return user;
  } catch (e) {
    console.error(e);
    return null;
  }
};
