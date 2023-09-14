module.exports = (app) => {
  require("./auth.routes")(app)
  require("./verifyEmail.routes")(app)
  require("./order.routes")(app)
  require("./message.routes")(app)
  require("./account.routes")(app)
  require("./event.routes")(app)
  require("./employee.routes")(app)
  require("./email.routes")(app)
}