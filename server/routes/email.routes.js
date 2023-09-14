const { EmailTemplate, FatchEmailTemplate, AddContent } = require("../controllers/email.controller");
const { chatTemplate,FetchchatTemplate,UpdatechatContent,AddchatContent,DeletechatContent} = require("../controllers/chat.controller");
const { checkAuth, isAdmin } = require("../middleware/checkAuthMiddle");


module.exports = (app) =>{
    app.post("/email/template",[checkAuth,isAdmin],EmailTemplate);
    app.post("/fatch/template/:id",[checkAuth,isAdmin],FatchEmailTemplate)
    app.patch("/send/text/:id", [checkAuth, isAdmin], AddContent)

    //this routes for prewritten msg 
    app.post("/chat/template",[checkAuth,isAdmin],chatTemplate);
    app.post("/fetch/template/:id", [checkAuth, isAdmin], FetchchatTemplate);
    app.patch("/send/chat/:id", [checkAuth, isAdmin], UpdatechatContent);
    app.patch("/add/chat", [checkAuth, isAdmin], AddchatContent);
    app.post("/delete/chat/:id", [checkAuth, isAdmin], DeletechatContent);
    
    
}