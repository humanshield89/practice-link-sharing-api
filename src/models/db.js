import mongoose from "mongoose";

export const connectDB = async () => {
  return mongoose.connect(process.env.MONGO_URI);
};
