import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.router.js";
import signUp from "./routes/auth.router.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connect with MongoDB");
  })
  .catch((err) => console.log("Не удалось подключиться к MongoDB", err));

const api = express();
api.use(express.json());

api.listen(3000, () => {
  console.log("Server is running on port 3000");
});

api.use("/users/get", userRoute);
api.use("/api", signUp);
api.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ succsess: false, statusCode, message });
});
