import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import listingRouter from "./routes/listing.router.js";
import path from "path";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connect with MongoDB");
  })
  .catch((err) => console.log("Не удалось подключиться к MongoDB", err));

const __dirname = path.resolve();

const api = express();

api.listen(3000, () => {
  console.log("Server is running on port 3000");
});
api.use(cookieParser());
api.use(express.json());

api.use("/api", authRouter);
api.use("/api/user", userRouter);
api.use("/api/listing", listingRouter);

api.use(express.static(path.join(__dirname, "/client/dist")));
api.get("*", (req, res) => {
  res.sendFile(path.json(__dirname, "client", "dist", "index.html"));
});

api.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
