const multer = require("multer");
const path = require("path")

// img storage config
const imgConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/profilepic")
  },
  filename: (req, file, cb) => {
    // cb(null, `${(file.originalname)}`)
    cb(null, `profilepic_${Date.now() + path.extname(file.originalname)}`)
  }
})

const isImage = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif|JPG|JEPG/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));

  if (!(mimetype && extname)) {
    cb(null,false)
    return cb("Error: only jepg|jpg|png|gif is allowed", false);
  }
  cb(null, true);
}


exports.upload = multer({
  storage: imgConfig,

})
