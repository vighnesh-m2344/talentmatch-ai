import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Upload route working!");
});

// CLOUDINARY UPLOAD
router.post("/", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw", // important for PDFs
        folder: "resumes",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        return res.json({
          success: true,
          fileUrl: result.secure_url,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;