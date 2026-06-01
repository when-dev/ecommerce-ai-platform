import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, "uploads/avatars");
  },

  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${crypto.randomUUID()}${extension}`;

    callback(null, fileName);
  },
});

export const avatarUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      callback(new Error("Можно загрузить только JPG, PNG или WEBP"));
      return;
    }

    callback(null, true);
  },
});