const { messageSend, fetchMessageByOrderId, deleteChatMessage,deletefile,RevisionmessageSend} = require("../controllers/message.controller");
const { Imgupload } = require("../middleware/ChatMiddle");
// const { uploadedFileNames } = require("../middleware/ChatMiddle");
const { checkAuth } = require("../middleware/checkAuthMiddle");
const path = require("path")
const multer = require("multer");
const express = require("express");
let uploadedFileNames = [];
const ChatConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/chat_image")
  },
  filename: (req, file, cb) => {
    const fileName = `chat_image_${Date.now()}${path.extname(file.originalname)}`;
    uploadedFileNames.push({ originalname: file.originalname, fileName }); // Store the file name in the array
    cb(null, fileName);
  }
})
const Imgupload1 = multer({
  storage: ChatConfig,
});
module.exports = (app) => {
  app.post("/message/send/:order_id", [checkAuth,Imgupload.array("files[]",999999)], messageSend);
  app.post("/message/get/:order_id", [checkAuth], fetchMessageByOrderId);
  app.post("/message/delete/:id", [checkAuth], deleteChatMessage);
  
  app.post("/message/filechange/:id", Imgupload1.array("files[]",999999), (req, res) => {
    res.json({ uploadedFileNames });
    uploadedFileNames = [];
  });
  app.post("/message/filechangedelete/:id", [checkAuth], deletefile);


  app.post("/revisionmsg/send/:order_id", [checkAuth], RevisionmessageSend);

}