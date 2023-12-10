import mongoose, { Schema } from "mongoose";

const ProfileSchema = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  links: {
    type: [Schema.Types.Mixed],
    default: [],
  },
});

ProfileSchema.methods.toJSON = function () {
  const obj = this.toObject();
  obj.id = obj._id;

  delete obj._id;
  delete obj.__v;

  return obj;
};

export const ProfileModel = mongoose.model("Profile", ProfileSchema);
