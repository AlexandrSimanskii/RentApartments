import express from "express";
import { test } from "../controlers/user.controlers.js";

const router = express.Router();

router.get("/test", test);

export default router;
