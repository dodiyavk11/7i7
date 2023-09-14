const Models = require("../models");
const { pdfgenreter } = require("../utils/PDF/PdfCreate");
const { sendVerifyMail, emailTemplate } = require("../utils/emailsUtils");
const { unlinkEventImg } = require("../utils/unlinkFile");
const { MomentNormal } = require("../utils/momentUtils");


// add event - admin side
exports.AddEvent = async (req, res) => {

  try {
    const { date, eventname, cost, eventdetail } = req.body;
    const fetchAllUser = await Models.Users.findAll({ where: { role: 0 } })
    const eventData = { date, eventname, cost, eventdetail };
    const addEvent = await Models.Events.create(eventData)

    // image add
    const image = req.files
    if (image) {
      image && image.map(async (val) => {
        await Models.event_images.create({ event_id: addEvent.dataValues.id, event_image: val.filename })
      })
    }

    fetchAllUser && fetchAllUser.map(async (val, index) => {
      const userInvitatoin = { uid: parseInt(val.dataValues.id), event_id: addEvent.dataValues.id }
      await Models.Invitations.create(userInvitatoin)
      // send mail when event add  
      const mailTexts = await Models.email_template.findOne({ where: { email_type: 'create_new_event' } })
      let text = mailTexts.email_content
      let subject = mailTexts.header
      text = text.replace("{event_name}", eventname);
      text = text.replace("{event_date}", date);
      const mail = await emailTemplate(text)
      setTimeout(() => {
        sendVerifyMail(val.dataValues.email, subject, "",mail )
      }, 1000 * index);
    })


    res.status(200).send({ status: true, message: "Vercnstaltung erfolgreich erstellt", data: [] })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Ereignisse können nicht hochgeladen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// fetch events by userId(uId) - customer side
exports.FetchEvent = async (req, res) => {
  try {
    const uId = req.userId

    const fetchUId = await Models.Invitations.findAll({ where: { uId } })

    if (fetchUId.length !== 0) {
      let fetchAllData = [];

      await Promise.all(fetchUId.map(async (val) => {
        const { event_status, event_id } = val
        try {
          const fetchEventsByUId = await Models.Events.findAll({ where: { id: event_id } })
          if (fetchEventsByUId.length == 0) return;
          fetchAllData.push(fetchEventsByUId[0].dataValues)

          const lastElement = fetchAllData[fetchAllData.length - 1];
          lastElement.event_status = event_status

        } catch (err) {
          console.log(err)
          if (err) throw err;
        }
      }))

      res.status(200).send({ status: true, message: "Ereignisse erfolgreich abgerufen", data: fetchAllData.reverse() })

    } else {
      res.status(200).send({ status: true, message: "Keine Ereignisse fur diesen Benutzer", data: [] })
    }

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Ich kann keine Ereignisse abrufen, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// fatch images on event id

exports.FatchImage = async (req, res) => {

  try {
    const { event_id } = req.body;
    const img = await Models.event_images.findAll({ where: { event_id } })
    const event_img = await img && img.map((val) => { return val.dataValues.event_image })
    res.status(200).send({ status: true, message: "Ereignisbilder wurden erfolgreich abgerufen", data: event_img })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Ich kann keine Bilder bekommen, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// delete image

exports.DeleteIamge = async (req, res) => {
  try {
    const { name } = req.body;
    const img = await Models.event_images.destroy({ where: { event_image: name } })
    unlinkEventImg(name)
    res.status(200).send({ status: true, message: "Bild löschen erfolgreich" })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Bilder können nicht gelöscht werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}


// fetch all event with invited customers & event status - admin side
exports.FetchAllEvent = async (req, res) => {
  try {
    const getAllEvents = await Models.Events.findAll({});

    const totalInfo = await Promise.all(getAllEvents.map(async (val) => {
      const eventInfo = await Models.Invitations.findAll({ where: { event_id: val.dataValues.id } })
      return await Promise.all(eventInfo.map(async (innerVal) => {
        const getUserName = await Models.Users.findOne({ where: { id: innerVal.dataValues.uid } })
        let user_name;
        let user_img;
        if (getUserName === null) {
          user_name = "user not found"
          user_img = null
        } else {
          user_name = getUserName.dataValues.fname + " " + getUserName.dataValues.lname
          user_img = getUserName.dataValues.userImg
        }
        return { uId: innerVal.dataValues.uid, user_name, user_img, status: innerVal.dataValues.event_status, accept_date: innerVal.dataValues.accept_date }
      }))
    }))

    await getAllEvents.map((val, i) => {
      val.dataValues.customers_info = totalInfo[i]
    })
    res.status(200).send({ status: true, message: "Ereignisse erfolgreich abgerufen", data: getAllEvents.reverse() })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Ich kann keine Ereignisse abrufen, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// update event status by event-id (if user accept invitation, status will be changed to 1) - customer side
exports.UpdateEvent = async (req, res) => {
  try {
    const uId = req.userId
    const { id, event_status } = req.body;
    const checkUser = await Models.Users.findAll({ where: { role: 1 } });
    const getUserInfo = await Models.Users.findOne({ where: { id: uId } })
    const getEventInfo = await Models.Events.findOne({ where: { id } })

    let accept_date = null;
    if (event_status) {
      accept_date = new Date()
    }
    // send mail process
    const mailTexts = await Models.email_template.findOne({ where: { email_type: 'event_accept' } })
    let text = mailTexts.email_content
    let subject = mailTexts.header
    text = text.replace("{event_name}", getEventInfo.dataValues.eventname);
    text = text.replace("{user_name}", getUserInfo.fname + " " + getUserInfo.lname)
    text = text.replace("{accepted_date}", MomentNormal(accept_date, "MM/DD/YYYY"));
    const mail = await emailTemplate(text)
    checkUser.map((val) => {
      sendVerifyMail(val.dataValues.email,subject, "", mail)
    })
    const userEvent = await Models.Invitations.update({ event_status, accept_date }, { where: { event_id: id, uid: uId } });
    if (userEvent == 0) return res.status(200).send({ status: true, message: "event status does't change", data: [] })

    const statusData = { id, event_status }
    res.status(200).send({ status: true, message: "Der Ereignisstatüs wird geandert", data: statusData })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Status kann nicht äktüälisiert werden, da ist ein Fehler aufgetreten", data: [] ,error: err.message})
  }
}

// edit event - admin side
exports.EditEvent = async (req, res) => {
  try {
    const { id } = req.params
    const image = req.files
    const { date, eventname, cost, eventdetail, invitation } = req.body;

    const eventData = { date, eventname, cost, eventdetail, image };
    const addEvent = await Models.Events.update(eventData, { where: { id } })

    if (image) {
      image && image.map(async (val) => {
        await Models.event_images.create({ event_id: id, event_image: val.filename })
      })
    }

    res.status(200).send({ status: true, message: "Ereignisäktuälisierüng erfolgreich", data: addEvent })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Ereignisse können nicht äktüälisiert werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// remove event
exports.RemoveEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const removeEvent = await Models.Events.destroy({ where: { id } })
    res.status(200).send({ status: true, message: "Ereignis erfolgreich entfernt", data: removeEvent })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Das Ereignis kann nicht entfernt werden. da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// pdf downlode

exports.DownlodePdf = async (req, res) => {
  try {
    const { event_id } = req.params;

    const downlodepdf = await Models.Invitations.findAll({ where: { event_id, event_status: 1 } })
    const userid = downlodepdf && downlodepdf.map((val) => { return val.uid })
    const ename = await Models.Events.findOne({ where: { id: event_id } })
    const eventname = ename.dataValues.eventname;
    const userName = await Promise.all(userid.map(async (val) => {
      const userDetail = await Models.Users.findOne({ where: { id: val } });
      return userDetail?.dataValues?.fname + " " + userDetail?.dataValues?.lname
    }))
 pdfgenreter(userName, eventname)
    res.status(200).send({ status: true, message: "PDF-Download erfolgreich", data: [] })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "PDF kann nicht heruntergeladen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}