import prisma from "../config/prisma.js";

export const getAdminStats = async (req, res) => {
  try {
    const [jobs, users, applications] = await Promise.all([
      prisma.job.count(),
      prisma.user.count(),
      prisma.application.count(),
    ]);

    res.json({
      success: true,
      data: { jobs, users, applications },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin stats",
    });
  }
};