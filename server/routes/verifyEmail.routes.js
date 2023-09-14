const { VerifyEmail } = require("../controllers/verifyEmail.controller");

module.exports = (app) => {
  app.post("/verify/email/:token", VerifyEmail);
}