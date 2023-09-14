const {checkAuth, isAdmin} = require("../middleware/checkAuthMiddle")
const { AddEvent,UpdateEvent ,FetchEvent, FetchAllEvent, RemoveEvent, EditEvent, DownlodePdf, FatchImage, DeleteIamge} = require("../controllers/event.controller")
const { upload } = require("../middleware/EventMiddle")
// const { pdfgenreter } = require("../utils/PDF/PdfCreate")



module.exports = (app)=>{
  app.post("/event/add",[checkAuth,isAdmin, upload.array("files[]",999999)],AddEvent)
  app.post("/event/get",checkAuth,FetchEvent)
  app.post("/event/get/all",[checkAuth,isAdmin],FetchAllEvent)
  app.patch("/event/add",[checkAuth],UpdateEvent)
  app.post("/event/remove/:id",[checkAuth,isAdmin],RemoveEvent)
  app.patch("/event/edit/:id",[checkAuth,isAdmin,upload.array("files[]",999999)],EditEvent)
  app.post("/event/pdf/:event_id",[checkAuth],DownlodePdf)
  app.post("/fetch/images",[checkAuth],FatchImage)
  app.post("/delete/image",[checkAuth],DeleteIamge)
}