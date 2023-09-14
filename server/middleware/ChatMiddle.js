const path = require("path")
const multer = require("multer");
const express = require("express");
const app = express();
const port = 3000;

// new order file storage config
const ChatConfig = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "./assets/chat_image")
  // },
  filename: (req, file, cb) => {
    // cb(null, `${(file.originalname)}`)
    // console.log(file.originalname);
    cb(null, `chat_image_${Date.now() + path.extname(file.originalname)}`)
  }
})

// const Imgupload = multer({
//   storage: ChatConfig,
// });
exports.Imgupload = multer({
  storage: ChatConfig,
})