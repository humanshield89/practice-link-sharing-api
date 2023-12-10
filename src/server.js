import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./models/db.js";
import { authRouter } from "./routes/auth.routes.js";
import cors from "cors";
import { deserializeUser } from "./middlewares/deserializeUser.middleware.js";
import { usersRouter } from "./routes/users.routes.js";
import fileUpload from "express-fileupload";
import fs from "fs";

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

app.use(fileUpload());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

// set /static/public as a static folder for everyone
app.use("/static/public", express.static("static/public"));

// if folder /static/public is not created yet, create it
if (!fs.existsSync("./static")) {
  fs.mkdirSync("./static");
}

if (!fs.existsSync("./static/public")) {
  fs.mkdirSync("./static/public");
}

app.use("*", (req, res) => {
  res
    .status(404)
    .send(
      '<div style="text-align: center;"><h2>These aren\'t the routes you are looking for</h2>' +
        "<img src='https://media.giphy.com/media/3o84sF21zQYacFcl68/giphy.gif' alt='Not the droids you are looking for' /> </div>",
    );
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}!`);
});
