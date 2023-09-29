const path = require("path");
const multer = require("multer");
const fs = require("fs");

const Models = require("../models")
const { sendVerifyMail, emailTemplate } = require("../utils/emailsUtils")
const { unlinkChatImage } = require("../utils/unlinkFile")



exports.messageSend = async (req, res) => {
  try {
    const uId = req.userId
    const { order_id } = req.params
    const { message } = req.body;
    // const image = req.files;
    const { image } = req.body;
    console.log(image);
    const { files, file_detail } = req.body;
    // console.log(image);
   if(!message && !image  ) return res.status(404).send({ status: false, message: "Bitte senden Sie eine Nachricht oder Datei", data: [] });

    const getUserInfo = await Models.Users.findOne({ where: { id: uId } });
    let chatData = { user_id: uId, order_id, role: getUserInfo.dataValues.role }

    if (message || message !== "") { chatData.message = message }

    // image add
    if (files || files !== "") {
     
      if (image) {
        const filenames = image.map((file) => file.fileName);
        // const array = await Promise.all(image.map(async (val) => {
        //   return val.filename
        // }))
        let string = filenames.join(',');
        chatData.files = string
        chatData.files_original_name = file_detail?.join(",")
      }
    }

    await Models.Order_Comment.create(chatData)

    // change update status in order api, so that user and admin gets a red exclamation mark
    getUserInfo.dataValues.role !== 0 && await Models.Orders.update({ update_status: 2 }, { where: { id: order_id } })
    getUserInfo.dataValues.role === 0 && await Models.Orders.update({ update_status_admin: 2 }, { where: { id: order_id } })
    // await Models.Orders.update({ update_chat_status_admin: 2 }, { where: { id: order_id } })


    const ordername = await Models.Orders.findOne({ where: { id: order_id } })
    const user = await Models.Users.findOne({where:{id:ordername.dataValues.uId}})
    const admin = await Models.Users.findAll({where:{role:1}})
    
    
    content = `hello from 7i7 you  have chat notification of order ${ordername.dataValues.ordername} `

    const mailTexts = await Models.email_template.findOne({where:{email_type:'chat_message'}})
    let text = mailTexts.email_content 
    let subject = mailTexts.header
    
    if (getUserInfo.dataValues.role === 0) {

      
      // const adminUsers = await Models.Users.findAll({ where: { role: 1 } });
      // // regular user sent a message, send email notification to all admins
      // adminUsers.map( async (val) => {
      //   text = text.replace("{company_name}", val.company);
      //   const mail = await emailTemplate(text)
      //   sendVerifyMail(val.email, subject,"" ,mail);
      // });
    } else {
    //   const users = await Models.Orders.findOne({ where: { id: order_id } })
    //   const user = await Models.Users.findOne({ where: { id: users.dataValues.uId } })
    //   admin.map(async(val)=>{
    //   const adminUsers = await Models.Users.findOne({ where: { email: val.email } });
    // })
    const admin = await Models.Users.findOne({where:{id:uId}})
    text = text.replace("{company_name}", admin.dataValues.company);
    const mail = await emailTemplate(text)
      sendVerifyMail(user.dataValues.email, subject, "",mail);
    }
 res.status(200).send({ status: true, message: "Nachricht erfolgreich gesendet", data:req.files})
          
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Nachricht kann nicht gesendet werden, da ist ein Fehler aufgetreten", data: [] ,error: err.message })
  }
}

exports.fetchMessageByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params

    const getMessages = await Models.Order_Comment.findAll({ where: { order_id } })


    // modify data from each array
    const getInfo = await getMessages.map((val) => {
      delete val.dataValues.order_id
      return val.dataValues.user_id
    })

    // get user img comment wise
    const getUserImg = await Promise.all(getInfo.map(async (val) => {
      const getUserInfo = await Models.Users.findOne({ where: { id: val } ,  paranoid: false})
      return getUserInfo.dataValues.userImg
    }))

    // get user name
    const getUsername = await Promise.all(getInfo.map(async (val) => {
      const getUserInfo = await Models.Users.findOne({ where: { id: val } ,  paranoid: false})
      return getUserInfo.dataValues.fname + " " +getUserInfo.dataValues.lname
    }))


    // adding image to main object
    getUserImg.map((val, i) => getMessages[i].dataValues.userImg = val)
    getUsername.map((val, i) => getMessages[i].dataValues.name = val)
    res.status(200).send({ status: true, message: "Nachricht erfolgreich erhälten", data: getMessages })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Ich kann keine Nachrichten empfängen, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}


// ! remove chat message 
exports.deleteChatMessage = async (req,res) =>{
  try {
    const { id } = req.params;
    const {files} = req.body;
    // console.log(files);
    const deleteMessage = await Models.Order_Comment.destroy({ where: { id } });
    
    // remove file from server
       deleteMessage && files && await Promise.all(files?.split(",").map(val => {
            unlinkChatImage(val);
        }))
    
     res.status(200).send({ status: true, message: "Nachricht gelöscht", data: deleteMessage })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Die Nachricht konnte nicht gelöscht werden. Versuchen Sie es erneut", data: [],error: err.message })

  }
}



exports.deletefile = async (req, res) => {
  const {text} = req.body;
  const folderPath = "./assets/chat_image";
  
  const resultString = text.join(', ');
  const filePath = `${folderPath}/${resultString}`;
  // console.log(foundFiles);
  // console.log(filePath);
  if (fs.existsSync(filePath)) {
    // Delete the file
    fs.unlinkSync(filePath);

    // Remove the file name from the uploadedFileNames array (assuming you have one)
    // const index = uploadedFileNames.findIndex((file) => file.fileName === fileName);
    // if (index !== -1) {
    //   uploadedFileNames.splice(index, 1);
    // }

    res.status(200).json({ message: "File deleted successfully" });
  } else {
    res.status(404).json({ message: "File not found" });
  }
}