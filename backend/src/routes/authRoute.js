import express from "express";
import { login, logout, register, updateProfile, checkAuth } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update-profile", verifyToken, updateProfile);
router.get("/check", verifyToken, checkAuth); // this will check if user authenticated or not

export default router;