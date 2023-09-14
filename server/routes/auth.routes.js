const { signIn, signUp, GetAllUser, DeleteUser, Forgotpassword, ForgotPasswordLink, ResendMail, permission } = require("../controllers/auth.controller")
const { upload } = require("../middleware/ProfilePicMiddle")
const { checkAuth, isAdmin } = require("../middleware/checkAuthMiddle")

module.exports = (app) => {
  app.post("/signup", upload.single("file"), signUp);
  app.post("/signin", upload.any(), signIn)
  app.post("/user/all", [checkAuth, isAdmin], GetAllUser)
  app.post("/user/remove/:userId", [checkAuth, isAdmin], DeleteUser)
  app.post('/ForgotPasswordLink', ForgotPasswordLink)
  app.post("/forgotPassword/:token", Forgotpassword)
  app.post("/resendmail", ResendMail);
  app.post("/permissions", [checkAuth], permission);

}