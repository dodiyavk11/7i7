const path = require("path")
const multer = require("multer");

// new order file storage config
const newOrderConfig = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, "./assets/neworder")
  // },
  filename: (req, file, cb) => {
    // console.log(file)
    cb(null, `NewOrder_${Date.now() + path.extname(file.originalname)}`)
    // cb(null, `NewOrder_${Date.now() +(file.originalname)}`)
  }
})


exports.upload = multer({
  storage: newOrderConfig,

})

// final file
// new order file storage config
const finalOrderConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./assets/neworder")
  },
filename: (req, file, cb) => {
  cb(null, `Final_File_${Date.now() + path.extname(file.originalname)}`)
  // cb(null, `Final_File_${Date.now() +(file.originalname)}`)
}
})




exports.uploadFinal = multer({
  storage: finalOrderConfig,

})
