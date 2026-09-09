import multer from "multer";
import path from "node:path";
import fs from "node:fs";

const uploadDirectory = path.resolve("src/uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`);
  }
});

const allowedExtensions = [".png", ".jpg", ".jpeg"];

const fileFilter = (_req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const isImage = file.mimetype.startsWith("image/") && allowedExtensions.includes(extension);

  callback(isImage ? null : new multer.MulterError("LIMIT_UNEXPECTED_FILE", "imagem"), isImage);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }
});