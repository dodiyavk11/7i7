require("dotenv").config()
const Models = require("../models");
const { decodeJWTToken } = require("../utils/jwtUtils");

// token check
exports.checkAuth = (req, res, next) => {
  try {

    let token = req.headers['authorization'];
    if (!token) return res.status(401).send({ status: false, message: "kein Token hinzugefügt", data: [] })

    token = token.split(" ")[1]
    const decodeToken = decodeJWTToken(token)
    req.userId = decodeToken.userId;
    next();

  } catch (err) {
    console.log(err)
    res.status(401).send({ status: false, message: "Ungültiges oder abgelaufenes Token", data: [] })
  }
}

// admin verification
exports.isAdmin = async (req, res, next) => {
  try {
    const uId = req.userId
    const fetchAllUser = await Models.Users.findOne({ where: { id: uId } })
    delete fetchAllUser.dataValues.password
    if (fetchAllUser.role == 0) return res.status(401).send({ status: false, message: "Ich kann nicht auf die Admin-Seite zugreifen", data: [] })
    next();
  } catch (err) {
    console.log(err)
    res.status(401).send({ status: false, message: "Administrator-Authentifizierungsfehler", data: [] })
  }
}