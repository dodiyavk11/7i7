const { addEmp, fetchEmp, editEmp, fetchEmpById ,NewOrderEmployee} = require("../controllers/employee.controller")
const { checkAuth, isAdmin } = require("../middleware/checkAuthMiddle")
const { upload } = require("../middleware/ProfilePicMiddle")

module.exports = (app) => {
  app.post("/employee/add", [checkAuth, isAdmin, upload.single("file")], addEmp)
  app.post("/employee/get/all", [checkAuth, isAdmin], fetchEmp)
  app.post("/employee/get/:empId", [checkAuth, isAdmin], fetchEmpById)
  app.patch("/employee/add/:empId", [checkAuth, isAdmin, upload.single("file")], editEmp)
  app.post("/employee/get",[checkAuth,isAdmin],NewOrderEmployee)
}