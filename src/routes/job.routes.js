import express from "express";
import prisma from "../config/prisma.js";
import { protect } from "../middleware/protect.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();

// CREATE JOB
router.post(
  "/",
  protect,
  authorize("ADMIN", "RECRUITER"),
  async (req, res) => {
    try {
      const { title, description, company, location, package: pkg } = req.body;

      if (!title || !description || !company || !location) {
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
      }

      const job = await prisma.job.create({
        data: {
          title,
          description,
          company,
          location,
          package: pkg ?? null,
          userId: req.user.id,
        },
      });

      res.status(201).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (err) {
      console.error("CREATE JOB ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Error creating job",
        error: err.message,
      });
    }
  }
);

// BULK CREATE JOBS
router.post(
  "/bulk",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const jobs = req.body.jobs;

      if (!Array.isArray(jobs) || jobs.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Jobs array is required",
        });
      }

      const result = await prisma.job.createMany({
        data: jobs.map((job) => ({
          title: job.title,
          description: job.description,
          company: job.company,
          location: job.location,
          package: job.package ?? null,
          userId: req.user.id,
        })),
      });

      res.status(201).json({
        success: true,
        message: "Bulk jobs created successfully",
        count: result.count,
      });
    } catch (err) {
      console.error("BULK JOB ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Error creating bulk jobs",
        error: err.message,
      });
    }
  }
);

// GET ALL JOBS (FILTER + PAGINATION)
router.get("/", async (req, res) => {
  try {
    const { search, location, company, status, page = 1, limit = 10 } = req.query;

    const jobs = await prisma.job.findMany({
      where: {
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
        ...(location && {
          location: { contains: location, mode: "insensitive" },
        }),
        ...(company && {
          company: { contains: company, mode: "insensitive" },
        }),
        ...(status && { status }),
      },
      orderBy: { createdAt: "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (err) {
    console.error("GET JOBS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: err.message,
    });
  }
});

// GET SINGLE JOB
router.get("/:id", async (req, res) => {
  try {
    const job = await prisma.job.findUnique({
      where: { id: req.params.id },
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (err) {
    console.error("GET JOB ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error fetching job",
      error: err.message,
    });
  }
});

// UPDATE JOB (WITH OWNERSHIP CHECK)
router.put(
  "/:id",
  protect,
  authorize("ADMIN", "RECRUITER"),
  async (req, res) => {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      // ownership check
      if (
        req.user.role !== "ADMIN" &&
        job.userId !== req.user.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Not allowed to update this job",
        });
      }

      const { title, description, company, location, package: pkg, status } = req.body;

      const updatedJob = await prisma.job.update({
        where: { id: req.params.id },
        data: {
          title,
          description,
          company,
          location,
          package: pkg ?? undefined,
          ...(status && { status }),
        },
      });

      res.json({
        success: true,
        message: "Job updated successfully",
        data: updatedJob,
      });
    } catch (err) {
      console.error("UPDATE JOB ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Error updating job",
        error: err.message,
      });
    }
  }
);

// DELETE JOB (WITH OWNERSHIP CHECK)
router.delete(
  "/:id",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const job = await prisma.job.findUnique({
        where: { id: req.params.id },
      });

      if (!job) {
        return res.status(404).json({
          success: false,
          message: "Job not found",
        });
      }

      await prisma.job.delete({
        where: { id: req.params.id },
      });

      res.json({
        success: true,
        message: "Job deleted successfully",
      });
    } catch (err) {
      console.error("DELETE JOB ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Error deleting job",
        error: err.message,
      });
    }
  }
);

// GET JOB APPLICATIONS
router.get(
  "/:id/applications",
  protect,
  authorize("ADMIN", "RECRUITER"),
  async (req, res) => {
    try {
      const applications = await prisma.application.findMany({
        where: { jobId: req.params.id },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: true,
        count: applications.length,
        data: applications,
      });
    } catch (err) {
      console.error("GET APPLICATIONS ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Error fetching applications",
        error: err.message,
      });
    }
  }
);

//  UPDATE APPLICATION STATUS
router.patch(
  "/applications/:id/status",
  protect,
  authorize("ADMIN", "RECRUITER"),
  async (req, res) => {
    try {
      const { status } = req.body;

      const validStatuses = [
        "APPLIED",
        "SHORTLISTED",
        "INTERVIEW",
        "REJECTED",
        "HIRED",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status",
        });
      }

      const updated = await prisma.application.update({
        where: { id: req.params.id },
        data: { status },
      });

      res.json({
        success: true,
        message: `Application ${status}`,
        data: updated,
      });
    } catch (err) {
      console.error("STATUS UPDATE ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Error updating status",
        error: err.message,
      });
    }
  }
);

export default router;