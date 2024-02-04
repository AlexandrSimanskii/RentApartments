import express from "express";
import {
  signIn,
  signUp,
  signInWithGoogle,
  signOut,
} from "../controllers/auth.controler.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/googleAuth", signInWithGoogle);
router.get("/signout", signOut);

export default router;
