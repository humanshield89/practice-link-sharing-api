import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },
});

// enable timestamps
userSchema.set("timestamps", true);

// override toJSON method to prevent password from being returned with user
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  obj.id = obj._id;
  delete obj.password;
  delete obj.__v;
  delete obj._id;

  return obj;
};

// before save hook to hash password
userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    const SALT_ROUNDS = 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);

    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// compare password method
userSchema.methods.comparePassword = async function (password) {
  try {
    const match = await bcrypt.compare(password, this.password);
    return match;
  } catch (err) {
    return false;
  }
};

export const UserModel = mongoose.model("user", userSchema);

/**
 * @typedef User
 * @property {string} email
 * @property {string} password
 * @property {string} _id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
