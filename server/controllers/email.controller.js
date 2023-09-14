const Models = require("../models")

// fatch email template

exports.EmailTemplate = async (req, res) => {
    try {
        const email_template = await Models.email_template.findAll();
        const email_template_data = await email_template.map((val) => { return val.dataValues })
        res.status(200).send({ status: true, message: "E-Mail-Vorlage erfolgreich zusammenfugen", data: email_template_data });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-Vorlage kann nicht geladen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}

// fatch email template by id

exports.FatchEmailTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const email_template = await Models.email_template.findOne({ where: { id: id } });
        email_template.dataValues.static_var = { event_accept: ["{event_name}", "{accepted_date}", "{user_name}"], chat_message: ["{company_name}"],create_new_order: ["{order_name}", "{user_name}"], create_new_event: ["{event_name}", "{event_date}"], order_status: ["{order_name}", "{order_status}"], registration: ["{user_name}", "{user_email}" , "{verification_Link}"] }
        res.status(200).send({ status: true, message: "E-Mail-Vorlage erfolgreich zusammenfugen", data: email_template });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-Vorlage kann nicht geladen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}

// add content in email template
exports.AddContent = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body
        const {header} = req.body
        const texts = await Models.email_template.update({ email_content: text , header : header}, { where: { id: id } })
        res.status(200).send({ status: true, message: "E-Mail-Text erfolgreich gesendet", data: texts });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-TextVorlage kann nicht gesendet werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
    }
}

