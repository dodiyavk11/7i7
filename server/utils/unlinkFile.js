const fs = require('fs');
const path = require("path")

exports.unlinkProfile = (filename)=>{
  const getFileName = path.basename(`assets/profilepic/${filename}`)

  fs.exists(`assets/profilepic/${filename}`,(exists)=>{ 
    if (exists && getFileName !== "null") {
      fs.unlink(`assets/profilepic/${filename}`, (err) => {
        console.log(err)
        if (err) throw err
      })
    }
  })

}

exports.unlinkOrder = (filename)=>{
  const getFileName = path.basename(`assets/neworder/${filename}`)

  fs.exists(`assets/neworder/${filename}`,(exists)=>{
    if (exists && getFileName !== "null") {
      fs.unlink(`assets/neworder/${filename}`, (err) => {
        console.log(err)
        if (err) throw err
      })
    }
  })

}
exports.unlinkEventImg = (filename)=>{
  const getFileName = path.basename(`assets/event_image/${filename}`)

  fs.exists(`assets/event_image/${filename}`,(exists)=>{
    if (exists && getFileName !== "null") {
      fs.unlink(`assets/event_image/${filename}`, (err) => {
        console.log(err)
        if (err) throw err
      })
    }
  })

}

// ! unlink chat images
exports.unlinkChatImage = (filename)=>{
  const getFileName = path.basename(`assets/chat_image/${filename}`)

  fs.exists(`assets/chat_image/${filename}`,(exists)=>{
    if (exists && getFileName !== "null") {
      fs.unlink(`assets/chat_image/${filename}`, (err) => {
        console.log(err)
        if (err) throw err
      })
    }
  })

}

// ! unlink event pdf of accepted users
exports.unlinkEventAcceptPDF = (filename)=>{
  const getFileName = path.basename(`assets/eventaccept/${filename}`)

  fs.exists(`assets/eventaccept/${filename}`,(exists)=>{
    if (exists && getFileName !== "null") {
      fs.unlink(`assets/eventaccept/${filename}`, (err) => {
        console.log(err)
        if (err) throw err
      })
    }
  })

}