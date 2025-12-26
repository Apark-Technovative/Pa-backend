const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
 
    
    cb(null, Date.now() + file.originalname);
  },
});

const filter = function (req, file, cb) {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype == "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only png, jpg and jpeg format is allowed!"));
  }
};

const imageUpload = multer({
  storage: storage,
  fileFilter: filter,
});

module.exports = imageUpload;
