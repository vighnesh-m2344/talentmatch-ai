import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { protect } from "../middleware/protect.js";

const router = express.Router();

// ADMIN ONLY
router.get("/stats", protect, async (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
}, getAdminStats);

export default router;