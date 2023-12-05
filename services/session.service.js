import { SessionModel } from "../src/models/sessions.model.js";
import { Document } from "mongoose";

/**
 * @param {import("../src/models/users.model").User | string | import('mongoose').Types.ObjectId} user
 * @returns {Promise<Document>} newly created session
 */
export async function createSession(user) {
  try {
    const session = await SessionModel.create({ user });
    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
}

/**
 * @param {string} token
 * @returns {Promise<Document>} session
 */
export async function deleteSession(token) {
  if (!token) return false;
  try {
    const session = await SessionModel.findOneAndDelete({ token });
    return !!session;
  } catch (e) {
    console.error(e);
    return false;
  }
}

export async function getSession(token, populate = false) {
  if (!token) return null;
  try {
    const session = await SessionModel.findOne({
      token,
      expires: { $gt: Date.now() },
    }).populate(populate ? "user" : "");
    return session;
  } catch (e) {
    console.error(e);
    return null;
  }
}
