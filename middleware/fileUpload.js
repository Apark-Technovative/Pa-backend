const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + file.originalname.replace(/\s+/g, ""));
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pa",
    // allowed_formats: ["jpg", "png", "jpeg", "mp4", "flv", "mov", "wmv", "webp"],
    resource_type: "auto", // Automatically detect if it's an image or video
  },
});

const filter = function (req, file, cb) {
  // const allowedTypes = [
  //   "image/jpeg",
  //   "image/png",
  //   "image/jpg",
  //   "video/mp4",
  //   "video/flv",
  //   "video/mov",
  //   "video/wmv",
  //   "video/webp",
  // ];
  // if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  // } else {
  //   cb(null, false);
    // return cb(new Error("Only png, jpg and jpeg format is allowed!"));
  // }
};

const imageUpload = multer({
  storage: storage,
  fileFilter: filter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
});

module.exports = imageUpload;
