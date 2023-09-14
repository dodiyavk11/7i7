require("dotenv").config()
const Models = require("../models");
const { decodeJWTToken } = require("../utils/jwtUtils");

exports.VerifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const decodeToken = decodeJWTToken(token)
    const { email } = decodeToken

    await Models.Users.update({ email_verified: true }, { where: { email} });

    res.status(200).send({ status: true, message: " Uberprufung durchgefuhrt", data: [] })
  } catch (err) {
    res.status(500).send({ status: false, message: "Die Uberprufung erfolgt nicht, das JWT lauft ab oder der Link ist Ungultig", data: [],error: err.message })
  }
}
