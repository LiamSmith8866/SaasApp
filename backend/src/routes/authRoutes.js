import express from "express";

import {
  registerUser,
  loginUser,
  getUser,
  logoutUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", getUser);
router.post("/logout", logoutUser);




export default router;

