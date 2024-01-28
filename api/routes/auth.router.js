import express from "express";
import { signIn, signUp ,signInWithGoogle} from "../controllers/auth.controler.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/signwithgoogle", signInWithGoogle);

export default router;
