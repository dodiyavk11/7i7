
// //Required package
// var pdf = require("pdf-creator-node");
// const path = require('path');
// var fs = require("fs");

// // Read HTML Template
// var html = fs.readFileSync(path.join(__dirname, "./pdf.html"), "utf8");


// var options = {
//     format: "A3",
//     orientation: "portrait",
//     border: "10mm",
//     header: {
//         height: "45mm",
//     },
    
// };

//   exports.pdfgenreter = (userName,eventname)=>{

//   var document = {
//     html: html,
//     data: {
//       users: userName,
//     },
//     path: `./assets/eventaccept/${eventname}.pdf`,
//     type: "",
//   };
 
//   pdf
//   .create(document, options)
//   .then((res) => {
//     console.log(res);
//   })
//   .catch((error) => {
//     console.error(error);
//   });
// }


const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.pdfgenreter=(userName,eventname)=>{
// Create a document
const doc = new PDFDocument();

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(fs.createWriteStream(`./assets/eventaccept/${eventname}.pdf`));

// Add an image, constrain it to a given size, and center it vertically and horizontally
// doc.image('./assets/logo.png', {
//   fit: [250, 250],
//   align: 'center',
// });
// doc.moveDown();
// add header
// doc
//   .fontSize(25)
//   .text('Accept Event Users', 100, 100);

//   doc.moveDown();
// Add content
  doc.list([userName], 100, 100, {
    // this is how automatic line wrapping will work if the width is specified
    width: 100,
    align: 'left',
    listType: 'bullet',
    bulletRadius: 0.01, // use this value to almost hide the dots/bullets
  });

// Finalize PDF file
doc.end();  
}
