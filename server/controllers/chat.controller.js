const Models = require("../models")

// fatch email template

exports.chatTemplate = async (req, res) => {
   
    try {
        const messages_template = await Models.messages_template.findAll({
            order: [['createdAt', 'DESC']] // Assuming 'createdAt' is the column to sort by
        });

        const messages_template_data = await messages_template.map((val) => { return val.dataValues })
        res.status(200).send({ status: true, message: "E-Mail-Vorlage erfolgreich zusammenfugen", data: messages_template_data });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-Vorlage kann nicht geladen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}

// fatch email template by id

exports.FetchchatTemplate = async (req, res) => {   
    try {
        const { id } = req.params;
        const messages_template = await Models.messages_template.findOne({ where: { id: id } });
        messages_template.dataValues.static_var = { event_accept: ["{event_name}", "{accepted_date}", "{user_name}"], chat_message: ["{company_name}"], create_new_order: ["{order_name}", "{user_name}"], create_new_event: ["{event_name}", "{event_date}"], order_status: ["{order_name}", "{order_status}"], registration: ["{user_name}", "{user_email}", "{verification_Link}"] }
        console.log(messages_template);
        res.status(200).send({ status: true, message: "E-Mail-Vorlage erfolgreich zusammenfugen", data: messages_template });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-Vorlage kann nicht geladen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}

// Update content in email template
exports.UpdatechatContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        // const { header } = req.body;
        const { title } = req.body;
        
        // console.log(req);
    
        const texts = await Models.messages_template.update({ msg_content: text , msg_title : title,}, { where: { id: id } })
        res.status(200).send({ status: true, message: "E-Mail-Text erfolgreich gesendet", data: texts });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-TextVorlage kann nicht gesendet werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}
// add content in email template
exports.AddchatContent = async (req, res) => {
    try {
        // const { id } = req.params;
        const { text } = req.body;
        // const { header } = req.body;
        const { title } = req.body;
        
        // console.log(req);
    
        const texts = await Models.messages_template.create({ msg_content: text, msg_title: title, });
        res.status(200).send({ status: true, message: "New Prewritten chat erfolgreich gesendet", data: texts });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-TextVorlage kann nicht gesendet werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}
exports.DeletechatContent = async (req, res) => {
    try {
        const { id } = req.params;
    
        
        console.log(id);
    
        const texts = await Models.messages_template.destroy({ where:{ id: id }})
        res.status(200).send({ status: true, message: "E-Mail-Text erfolgreich gesendet", data: texts });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-TextVorlage kann nicht gesendet werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}
