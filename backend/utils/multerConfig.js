import multer from "multer";
import path from "path";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const multerMiddleware = (fields = null) => {
  let upload;

  if (!fields) {
    upload = multer({
      storage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
        else {
          const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
          err.message = `Unsupported file format. Allowed: ${allowedMimeTypes.join(
            ", "
          )}`;
          cb(err, false);
        }
      },
    }).single("file");
  } else if (Array.isArray(fields)) {
    upload = multer({
      storage,
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
        else {
          const err = new multer.MulterError("LIMIT_UNEXPECTED_FILE");
          err.message = `Unsupported file format. Allowed: ${allowedMimeTypes.join(
            ", "
          )}`;
          cb(err, false);
        }
      },
    }).fields(fields);
  }

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
              error: `File size limit exceeded (${
                MAX_FILE_SIZE / (1024 * 1024)
              }MB max)`,
            });
          } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({ error: err.message });
          }
        }
        return res
          .status(400)
          .json({ error: err.message || "File upload error" });
      }
      next();
    });
  };
};
