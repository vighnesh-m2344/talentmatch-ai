import prisma from "../config/prisma.js";
import { sendEmail } from "../utils/sendEmail.js";

// APPLY FOR JOB
export const applyJob = async (req, res) => {
  try {
    const { jobId, resume } = req.body;

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: req.user.id,
        resume,
      },
      include: {
        job: true,
        user: true,
      },
    });

    // EMAIL NOTIFICATION (ADMIN ALERT)
    await sendEmail({
      job: application.job,
      userEmail: req.user.email,
    });

    res.status(201).json({
      success: true,
      message: "Applied successfully",
      data: application,
    });
  } catch (err) {
    console.error("APPLY ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Application failed",
    });
  }
};

// GET MY APPLICATIONS (USER DASHBOARD)
export const myApplications = async (req, res) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: apps,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// UPDATE STATUS (ADMIN / RECRUITER)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await prisma.application.update({
      where: { id: req.params.id },
      data: { status },
    });

    res.json({
      success: true,
      message: "Status updated",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Update failed",
    });
  }
};