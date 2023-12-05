import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./models/db.js";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import { deserializeUser } from "./middlewares/deserializeUser.middleware.js";
import { usersRouter } from "./routes/users.routes.js";

// This will map all the variables from .env file to process.env
dotenv.config();

// connect to database
connectDB()
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Cannot connect to database!", err.message);
  });

const app = express();

app.use(deserializeUser);
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}!`);
});