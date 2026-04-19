import express from "express";
import { PrismaClient } from "@prisma/client";
import { protect } from "../middleware/protect.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();


// ADMIN DASHBOARD OVERVIEW
router.get("/stats", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const totalJobs = await prisma.job.count();

    const totalApplications = await prisma.application.count();

    const totalUsers = await prisma.user.count();

    res.json({
      success: true,
      data: {
        totalJobs,
        totalApplications,
        totalUsers,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// JOB WISE APPLICATION STATS
router.get("/jobs", protect, authorize("ADMIN"), async (req, res) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        applications: true,
      },
    });

    const result = jobs.map((job) => {
      const total = job.applications.length;

      const applied = job.applications.filter(
        (a) => a.status === "APPLIED"
      ).length;

      const shortlisted = job.applications.filter(
        (a) => a.status === "SHORTLISTED"
      ).length;

      const rejected = job.applications.filter(
        (a) => a.status === "REJECTED"
      ).length;

      const hired = job.applications.filter(
        (a) => a.status === "HIRED"
      ).length;

      return {
        jobId: job.id,
        title: job.title,
        company: job.company,
        totalApplications: total,
        applied,
        shortlisted,
        rejected,
        hired,
      };
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export default router;