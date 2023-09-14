require("dotenv").config()
const nodemailer = require("nodemailer")
const path = require('path');
// send verification mail
exports.sendVerifyMail = async (email, subject, text, link) => {
  try {
    const senderName = '7i7® | Enterprise';
    const senderEmail = process.env.SENDER_EMAIL;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      // secure: true,
      requireTLS: true,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    })

    const mailOptions = {
      from: `"${senderName}" <${senderEmail}>`,
      to: email,
      subject,
      text,
      html: link
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

  } catch (err) {
    console.log(err)
    if (err) throw err
  }
}


// exports.emailTemplate = async (message) =>{
//   return `
//     <div>
//     <img src="../assets/logo.png" />
//      <div>${message}</div>
//       <p>7i7</p>
//     </div>
//   `;
// }


// exports.emailTemplate = async (message) => {
//   const imagePath = path.join(__dirname,"../assets/logo.png");
//   console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz", imagePath)
//   return `

//     <div style={{ "backgroungColor" : "white"}}>
//     <div style={{"textAlign":"center" }}>
//     <img src=${imagePath} alt="kk"/>
//     </div>  
//     <p>Regards</p>
//     <p>7i7</p>
    
//     </div>
//     `;
//   };
// const path = require('path');

exports.emailTemplate = async (message) => {
  // const localImagePath = path.join(__dirname, 'assets', '7i7_logo.png');
  const url = 'https://7i7.bestprojectmanagementtool.com/server/assets/7i7_logo.png';

  const html = `
    <div className="mail_formmate" style="background-color: #f7f7f2; width: 700px; margin: auto;">
      <div className="center_img" style="width:100%;height: 120px; padding-top: 20px; padding-bottom: 20px; filter: invert(1);">
        <img src="${url}" alt="Logo" style="display:flex; height: 100%; width: 120px; margin: auto;" />
      </div>
      
      <div className="message_body" style="padding-left: 20px; padding-bottom: 10px;">
        ${message}
      </div>
  
      <div className="regards" style="padding-left: 20px; padding-bottom: 10px;">
        <h4>Regards <br> 7i7</h4>
      </div>
    </div>
  `;
  
  return html;
}

