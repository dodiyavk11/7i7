const jwt = require("jsonwebtoken")

exports.generateJWTToken = (payload,expiresTime)=>{
  return jwt.sign(payload, process.env.JWT_PRIVATE_KEY, { expiresIn: expiresTime })
}

exports.decodeJWTToken = (token)=>{
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
}