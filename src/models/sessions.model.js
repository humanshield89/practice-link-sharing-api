import mongoose from "mongoose";
import crypto from "crypto";

const SESSION_TIMEOUT = 1000 * 60 * 60 * 24 * 7; // 7 days

const sessionSchema = new mongoose.Schema({
  expires: {
    type: Date,
    required: true,
  },
  token: {
    type: String,
    immutable: true, // prevents updates on this field
    required: true,
    unique: true,
    indexed: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    immutable: true, // prevents updates on this field
    required: true,
  },
});

sessionSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.__v;
  delete obj._id;

  // check if user is populated
  if (obj.user && obj.user.password) {
    obj.user.id = obj.user._id;
    delete obj.user.password;
    delete obj.user.__v;
    delete obj.user._id;
  }

  return obj;
};

// before validate populate the token and the expiry date
sessionSchema.pre("validate", function (next) {
  console.log("presale hook", this.isNew);
  // if this is new
  if (this.isNew) {
    const randomBytes = crypto.randomBytes(32);
    this.token = randomBytes.toString("base64url");

    const expiryTime = Date.now() + SESSION_TIMEOUT;

    this.expires = new Date(expiryTime);
  }
  next();
});

export const SessionModel = mongoose.model("session", sessionSchema);

/**
 * @typedef Session
 * @property {string} _id
 * @property {Date} expires
 * @property {string} token
 * @property {string} user
 */
