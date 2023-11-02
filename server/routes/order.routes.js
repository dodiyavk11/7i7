const { checkAuth, isAdmin } = require("../middleware/checkAuthMiddle")
const { NewOrder, GetAllOrder, GetOrderByUId, UpdateOrder, GetFilteredOrder, GetOrderByOrderId, DeleteOrderFile, DeleteOrder, FileAdd, GetFile, DeleteFinalFile,deletefile, UpdateOrderStatus, NoSubscribeProduct, DeleteCloudLinkFinalFile,revisisondeletefile, AddCloudLinkFinalFile,UpdateCloudLinkFinalFile } = require("../controllers/order.controller")
const { upload, uploadFinal } = require("../middleware/NewOrderFileMiddle")


const path = require("path")
const multer = require("multer");
const express = require("express");
let uploadedFileNames = [];
const ChatConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/neworder")
  },
  filename: (req, file, cb) => {
    const fileName = `neworder_${Date.now()}${path.extname(file.originalname)}`;
    uploadedFileNames.push({ originalname: file.originalname, fileName }); // Store the file name in the array
    cb(null, fileName);
  }
})
const Imgupload1 = multer({
  storage: ChatConfig,
});

let reuploadedFileNames = [];
const RevisionConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/revision_file")
  },
  filename: (req, file, cb) => {
    const fileName = `revision_${Date.now()}${path.extname(file.originalname)}`;
    reuploadedFileNames.push({ originalname: file.originalname, fileName }); // Store the file name in the array
    cb(null, fileName);
  }
})
const Imgupload2 = multer({
  storage: RevisionConfig,
});


module.exports = (app) => {
  app.post("/order/add", [checkAuth, upload.array("files[]",999999)], NewOrder);
  app.post("/order/get/all", [checkAuth], GetAllOrder)
  app.post("/order/get/filter", [checkAuth, isAdmin], GetFilteredOrder)
  app.post("/order/get", [checkAuth], GetOrderByUId)
  app.post("/order/get/:id", [checkAuth], GetOrderByOrderId)
  app.patch("/order/update/:orderId", [checkAuth, upload.array("files[]",999999)], UpdateOrder);

  app.post("/order/filechange/:id", Imgupload1.array("files[]", 999999), (req, res) => {
    // console.log(req);
    res.json({ uploadedFileNames });
    uploadedFileNames = [];
  });
   app.post("/order/filechangedelete/:id", [checkAuth], deletefile);


  app.post("/order/file_delete", [checkAuth], DeleteOrderFile);
  app.post("/order/remove/:orderId", [checkAuth], DeleteOrder);
  app.post("/order/file_add/:orderid",[checkAuth, uploadFinal.array("files[]",999999)],FileAdd);
  app.post("/orderfile/get/:orderid",[checkAuth],GetFile);
  app.post("/orderfile/finalfile_delete/:id",[checkAuth],DeleteFinalFile)
  app.post("/orderfile/cloudLinks_add/:id", [checkAuth], AddCloudLinkFinalFile)
  app.post("/orderfile/cloudLinks_edit/:id",[checkAuth],UpdateCloudLinkFinalFile)
  
  app.post("/orderfile/cloudLinks_delete/:id",[checkAuth],DeleteCloudLinkFinalFile)
  app.post("/order/updateorder/orderstatus/:orderId", [checkAuth], UpdateOrderStatus)
  app.post("/order/revisionfilechange/:id", Imgupload2.array("files[]", 999999), (req, res) => {
    res.json({ reuploadedFileNames });
    reuploadedFileNames = [];
  });
  app.post("/order/revisionfiledelete/:id", [checkAuth], revisisondeletefile);
}