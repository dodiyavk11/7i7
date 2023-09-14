const { checkAuth, isAdmin } = require("../middleware/checkAuthMiddle")
const { NewOrder, GetAllOrder, GetOrderByUId, UpdateOrder, GetFilteredOrder, GetOrderByOrderId, DeleteOrderFile, DeleteOrder, FileAdd, GetFile, DeleteFinalFile, UpdateOrderStatus, NoSubscribeProduct, DeleteCloudLinkFinalFile, AddCloudLinkFinalFile,UpdateCloudLinkFinalFile } = require("../controllers/order.controller")
const { upload, uploadFinal } = require("../middleware/NewOrderFileMiddle")


module.exports = (app) => {
  app.post("/order/add", [checkAuth, upload.array("files[]",999999)], NewOrder);
  app.post("/order/get/all", [checkAuth], GetAllOrder)
  app.post("/order/get/filter", [checkAuth, isAdmin], GetFilteredOrder)
  app.post("/order/get", [checkAuth], GetOrderByUId)
  app.post("/order/get/:id", [checkAuth], GetOrderByOrderId)
  app.patch("/order/update/:orderId", [checkAuth, upload.array("files[]",999999)], UpdateOrder);
  app.post("/order/file_delete", [checkAuth], DeleteOrderFile);
  app.post("/order/remove/:orderId", [checkAuth], DeleteOrder);
  app.post("/order/file_add/:orderid",[checkAuth, uploadFinal.array("files[]",999999)],FileAdd);
  app.post("/orderfile/get/:orderid",[checkAuth],GetFile);
  app.post("/orderfile/finalfile_delete/:id",[checkAuth],DeleteFinalFile)
  app.post("/orderfile/cloudLinks_add/:id", [checkAuth], AddCloudLinkFinalFile)
  app.post("/orderfile/cloudLinks_edit/:id",[checkAuth],UpdateCloudLinkFinalFile)
  
  app.post("/orderfile/cloudLinks_delete/:id",[checkAuth],DeleteCloudLinkFinalFile)
  app.post("/order/updateorder/orderstatus/:orderId",[checkAuth],UpdateOrderStatus)
}