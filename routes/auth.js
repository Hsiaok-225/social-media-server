import authController from "../controllers/auth.js";

import express from "express";
const router = express.Router();

router.post("/login", authController.login);

export default router;
