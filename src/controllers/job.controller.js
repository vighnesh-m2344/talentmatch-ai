import prisma from "../config/prisma.js";

export const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salaryPackage } = req.body;

    // validation
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
        salaryPackage,
        userId: req.user.id, 
      },
    });

    res.status(201).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.log("CREATE JOB ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creating job",
    });
  }
};