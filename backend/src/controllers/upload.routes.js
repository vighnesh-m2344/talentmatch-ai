import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

/* storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* upload route */
router.post("/", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    message: "Upload success",
    fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

export default router;