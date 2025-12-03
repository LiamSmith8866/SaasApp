import express from "express";
import { getUsage, decreaseUsage } from "../controllers/usageController.js";
import  authMiddleware  from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getUsage);
router.post("/decrease", authMiddleware, decreaseUsage);

export default router;

