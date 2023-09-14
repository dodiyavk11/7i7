const { checkAuth, isAdmin } = require("../middleware/checkAuthMiddle")
const { AccountProfile, UpdateProfile, AccountProfileAdminSide, UpdateProfileAdminSide } = require("../controllers/account.controller")
const { upload } = require("../middleware/ProfilePicMiddle")

module.exports = (app) => {
  app.post("/account/user/profile", checkAuth, AccountProfile)
  app.patch("/account/user/profile", [checkAuth, upload.single("file")], UpdateProfile)
  app.post("/account/user/profile/:uId", [checkAuth, isAdmin], AccountProfileAdminSide)
  app.patch("/account/user/profile/update/:uId", [checkAuth, upload.single("file"), isAdmin], UpdateProfileAdminSide)
}