const path = require("path")
const multer = require("multer");

// new order file storage config
const EventConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/event_image")
  },
  filename: (req, file, cb) => {
    // cb(null, `${(file.originalname)}`)
    cb(null, `event_image_${Date.now() + path.extname(file.originalname)}`)
  }
})

const isImage = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimetype = fileTypes.test(file.mimetype);
  const extname = fileTypes.test(path.extname(file.originalname));

  if (!(mimetype && extname)) {
    cb(null,false)
    return cb("Error: only jepg|jpg|png|gif is allowed", false);
  }
  cb(null, true);
}


exports.upload = multer({
  storage: EventConfig,

})
