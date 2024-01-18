import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
console.log(dotenv.config.MONGO);
mongoose
  .connect(process.env.MONGO)~
  .then(() => {
    console.log("Connect with MongoDB");
  })
  .catch((err) => console.log("Не удалось подключиться к MongoDB", err));

const api = express();

api.listen(3000, () => {
  console.log("Server is running on port 3000");
});
