import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/protect.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";

const router = express.Router();
const prisma = new PrismaClient();

/* MULTER */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

/* APPLY JOB */
router.post("/", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobId } = req.body;
    const file = req.file;
    const user = req.user;

    if (!jobId || !file) {
      return res.status(400).json({
        success: false,
        message: "Job ID and Resume required",
      });
    }

    /* duplicate check */
    const existing = await prisma.application.findFirst({
      where: {
        jobId,
        userId: user.id,
      },
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    /* job fetch */
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    /* upload resume */
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "resumes",
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    /* save application */
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: user.id,
        resume: uploadResult.secure_url,
      },
    });

    /* EMAIL → USER (APPLIED CONFIRMATION) */
    await sendEmail({
      to_email: user.email,
      subject: "Application Received!",
      message: `Hi ${user.name || "User"}, you applied for ${job.title} at ${job.company}.`,
    });

    return res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* MY APPLICATIONS */
router.get("/my", protect, async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* ADMIN: ALL APPLICATIONS */
router.get("/", protect, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const apps = await prisma.application.findMany({
      include: { user: true, job: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: apps.length,
      data: apps,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* JOB WISE APPS */
router.get("/job/:jobId", protect, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const apps = await prisma.application.findMany({
      where: { jobId: req.params.jobId },
      include: { user: true },
    });

    res.json({ success: true, data: apps });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

/* STATUS UPDATE + EMAIL */
router.put("/:id/status", protect, async (req, res) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { status } = req.body;

    const allowed = ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
      include: { user: true, job: true },
    });

    /* EMAIL → USER (STATUS UPDATE) */
    await sendEmail({
      to_email: updated.user.email,
      subject: "Application Status Update",
      message: `Hi ${updated.user.name || "User"}, your application for ${updated.job.title} is now ${status}.`,
    });

    res.json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;