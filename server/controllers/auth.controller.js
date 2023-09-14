require("dotenv").config()
const Models = require("../models")
const bcrypt = require("bcryptjs")
const { sendVerifyMail, emailTemplate } = require("../utils/emailsUtils")
const { generateJWTToken, decodeJWTToken } = require("../utils/jwtUtils")
const { unlinkProfile } = require("../utils/unlinkFile")
// const { stripe, stripeSession, stripeSubscriptionDetail } = require("../utils/stripeBasicUtils")
const { MomentNormal } = require("../utils/momentUtils")
const moment = require('moment');

// add customer - both user and admin side
exports.signUp = async (req, res) => {
    try {
       
        const { email, fname, lname, password, company, street, postalNum, country, ustId, number, city, employee,isAdmin } = req.body
        // const { email, fname, lname, password, company, street, postalNum, country, ustId, number, city, employee, code,isAdmin } = req.body
        const userImg = req.file
        const checkUser = await Models.Users.findOne({ where: { email } })
        if (checkUser && checkUser.dataValues.email) {
            userImg && unlinkProfile(userImg.filename)
            return res.status(409).send({ status: false, message: "Benutzer bereits registriert ", data: [] })
        }
        // if (code != 7777777) res.status(500).send({ status: false, message: "Registrierung abgelehnt, etwas ist schief gelaufen", data: [] })
        // if (code == 7777777) {
            // genrate cripted password
            const hashedPassword = await bcrypt.hash(password, 11);
            const userInfo = { email, fname, lname, password: hashedPassword, company, street, postalNum, country, ustId, number, city }

            if (userImg) userInfo.userImg = userImg.filename


            // create stripe customer id
            // const customer = await stripe.customers.create({
            //     name: fname,
            //     email,
            // }, { apiKey: process.env.STRIPE_PRIVATE_KEY })

            // userInfo.stripeCustomerId = customer.id

            const addUser = await Models.Users.create(userInfo)
            delete addUser.dataValues.password

            // assign the employees for the customer  
            employee && employee.length > 0 && employee.map(async (val) => {
                const EmpAssign = { emp_id: val, customer_id: addUser.dataValues.id }
                await Models.Employee_Orders.create(EmpAssign)
            })

            // by this code, when new user register, user will show all events 
            const getAllEvents = await Models.Events.findAll({});
            getAllEvents.map(async (val) => {
                await Models.Invitations.create({ uid: addUser.dataValues.id, event_id: val.dataValues.id })
                // console.log(val)

            })

            
            if(isAdmin){   
              const adminUser =  await Models.Users.update({email_verified :true}, { where: {email: addUser.dataValues.email } })
             return res.status(200).send({ status: true, message: "Kundenregistrierung erfolgreich", data: adminUser });
            }

            // email send process
            const mailTexts = await Models.email_template.findOne({ where: { email_type: 'registration' } })
            let subject = mailTexts.header
            let text = mailTexts.email_content
            text = text.replace("{user_name}", fname + lname);
            text = text.replace("{user_email}", email);
            const EmailToken = generateJWTToken({ email: addUser.dataValues.email }, "10m")
            const VerificationLink = `<a href="${process.env.BASE_URL}/verification/email/${EmailToken}">klicken Sie hier</a>`
            text = text.replace("{verification_Link}", VerificationLink)
            const mail = await emailTemplate(text)
            sendVerifyMail(email, subject, "", mail)
            res.status(200).send({ status: true, message: "Registrieren Sie sich erfolgreich. Bitte bestätigen Sie Ihre E-Mail-Adresse per E-Mail", data: addUser });
        // }


    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "Registrierung abgelehnt, etwas ist schief gelaufen", data: [], error: err.message })
    }
}

// verify page resend mail in verify page

exports.ResendMail = async (req, res) => {
    try {
        // email send process
        const { email } = req.body
        const { name } = req.body
        const mailTexts = await Models.email_template.findOne({ where: { email_type: 'registration' } })
        let text = mailTexts.email_content
        let subject = mailTexts.header
        text = text.replace("{user_name}", name);
        text = text.replace("{user_email}", email);
        const EmailToken = generateJWTToken({ email }, "10m")
        const VerificationLink = `<a href="${process.env.BASE_URL}/verification/email/${EmailToken}">klicken Sie hier</a>`
        text = text.replace("{verification_Link}", VerificationLink)
        const mail = await emailTemplate(text)
        sendVerifyMail(email, subject, "", mail)
        res.status(200).send({ status: true, message: "E-Mail erfolgreich gesendet, bitte uberprufen Sie Ihre E-Mail-Adresse", data: [] });
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "Ich kann keine E-Mail senden, da ist ein Fehler aufgetreten", data: [], error: err.message })
    }
}

exports.signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        const checkUser = await Models.Users.findOne({ where: { email } });
        if (!checkUser) return res.status(401).send({ status: false, message: "Benutzer nicht gefunden, bitte registrieren Sie sich zuerst", data: [] })

        const isMatch = await bcrypt.compare(password, checkUser.password)
        if (!isMatch) return res.status(401).send({ status: false, message: "Ungultige Anmeldeinformationen", data: [] })

        // email send if user is not verified
        if (!checkUser.email_verified) {
            // const EmailToken = generateJWTToken({ userId: checkUser.id }, "30m")
            // const VerificationLink = `<a href="https://app.7i7.de/#/verification/email/${EmailToken}">klicken Sie hier</a>`
            // const mail = await emailTemplate(text + VerificationLink)
            const name = checkUser.dataValues.fname + " " + checkUser.dataValues.lname
            const EmailToken = generateJWTToken({ email }, "10m")
            const mailTexts = await Models.email_template.findOne({ where: { email_type: 'registration' } })
            let text = mailTexts.email_content
            let subject = mailTexts.header
            text = text.replace("{user_email}", email);
            text = text.replace("{user_name}", name);
            const VerificationLink = `<a href="${process.env.BASE_URL}/verification/email/${EmailToken}">klicken Sie hier</a>`
            text = text.replace("{verification_Link}", VerificationLink)
            const mail = await emailTemplate(text)
            sendVerifyMail(email, subject, "", mail)
            return res.status(401).send({ status: false, message: "Bitte uberprufen Sie zuerst Ihre E-Mail-Adresse. Der Bestatigüngslink wird Ihnen per Post zugesandt", data: [] })
        }

        // send permission levels
        if (checkUser.role === 0) checkUser.dataValues.permission = false
        if (checkUser.role === 1) checkUser.dataValues.permission = true
        if (checkUser.role === 2) {
            const permission = []
            const getEmpPermissions = await Models.Emp_Permission.findAll({ where: { emp_id: checkUser.id } })
            getEmpPermissions.map((val) => {
                permission.push(val.dataValues.permission)
            })
            checkUser.dataValues.permission = permission
        }

        const token = generateJWTToken({ userId: checkUser.id }, "1000h")
        delete checkUser.dataValues.password

        // //user has no subscribe product than login upto 60 days
        // const findUser = await Models.User_Subs_Product.findAll({ where: { user_id: checkUser.id } })

        // const product_subs_product = await findUser.map((val) => {
        //     if (val.dataValues.subs_status == 1) {
        //         return 1
        //     } else {
        //         return val.dataValues.updatedAt
        //     }
        // })
        // // user has subscribe product than login
        // if (product_subs_product.includes(1)) return res.status(200).send({ status: true, message: "login successfully", token, data: checkUser });

        // // user has no subscribe product than login denied , go to product page for subsccribe
        // const newArr = product_subs_product.filter(item => typeof item !== 'number');
        // const allDateArray = newArr.map(date => moment(date));
        // const lastDate = moment.max(allDateArray);
        // const dateAfter2Months = lastDate.add(2, 'months');
        // const date = moment(dateAfter2Months);
        // const formattedDate = date.format('DD-MM-YYYY');
        // const systemDate = new Date();
        // const dates = systemDate.toISOString()
        // const localdate = MomentNormal(dates, 'DD-MM-YYYY')

        // // user has no subscribe product and 60 days to go than user not to login go to product page for subscribr product
        // if (formattedDate == localdate) return res.status(200).send({ status: false, message: "your subscription is over , please subscribe product ", expire: true, data: checkUser });

        res.status(200).send({ status: true, message: "Anmeldung erfolgreich", token, data: checkUser })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "Anmeldung verweigert, etwas ist schief gelaufen", data: [], error: err.message })
    }
}

// get all users - admin side
exports.GetAllUser = async (req, res) => {
    try {
        const fetchAllUser = await Models.Users.findAll({ where: { role: 0 } })

        const uId = req.userId
    const checkUser = await Models.Users.findOne({ where: { id: uId } });

        // const fatch_data = await Promise.all(
        //     fetchAllUser.map(async (val) => {
        //         return Models.User_Subs_Product.findAll({ where: { user_id: val.dataValues.id, subs_status: 1 } })
        //     }))
        // const result = fatch_data.reduce((r, a) => r.concat(a), []);

        // const FatchUser = await Promise.all(fetchAllUser.map(async (val) => {
        //     const user = result.filter((e) => val.dataValues.id == e.user_id);
        //     if (user.length === 0) {
        //         val.dataValues.active_membership_status = 0;
        //     } else {
        //         val.dataValues.active_membership_status = 1;
        //     }
        //     return val
        // }))

        // ***********************************************
        // // get employee Id
        // const fetchEmpId = await Promise.all(fetchAllUser.map(async (val) => {
        //     delete val.dataValues.password
        //     const getAssignedEmp = await Models.Employee_Orders.findAll({ where: { customer_id: val.dataValues.id } })
        //     return await Promise.all(getAssignedEmp.map(async (val) => {
        //         return val.dataValues.emp_id
        //     }))
        // }));

        // // get unique id from each array
        // const getUniqueId = await Promise.all(fetchEmpId.map(async (val) => {
        //     return [...new Set(val)];
        // }));

        // // get employee info
        // const EmpInfo = await Promise.all(getUniqueId.map((val) => {
        //     return Promise.all(val.map(async (innerVal) => {
        //         const Info = await Models.Users.findOne({ where: { id: innerVal } });
        //         if (Info == null) return;
        //         return Info.dataValues.fname + " " + Info.dataValues.lname
        //     }))
        // }))

        // // add employee name to main array
        // EmpInfo.map((val, i) => {
        //     fetchAllUser[i].dataValues.assign_emp_name = val
        // })
        // ********************************************
         // get employee Id
         const fetchEmpId = await Promise.all(fetchAllUser.map(async (val) => {
            delete val.dataValues.password
            const getAssignedEmp = await Models.customer_emp_relations.findAll({ where: { customer_id: val.dataValues.id } })
            return await Promise.all(getAssignedEmp.map(async (val) => {
                return val.dataValues.emp_id
            }))
        }));

        // get unique id from each array
        const getUniqueId = await Promise.all(fetchEmpId.map(async (val) => {
            return [...new Set(val)];
        }));

        // get employee info
        const EmpInfo = await Promise.all(getUniqueId.map((val) => {
            return Promise.all(val.map(async (innerVal) => {
                const Info = await Models.Users.findOne({ where: { id: innerVal } });
                if (Info == null) return;
                return Info.dataValues.fname + " " + Info.dataValues.lname 
            }))
        }))

        // add employee name to main array
        EmpInfo.map((val, i) => {
            fetchAllUser[i].dataValues.assign_emp_name = val
        })
        // *******************************************
        if(checkUser.dataValues.role == 1){
         return   res.status(200).send({ status: true, message: "Benutzer erfolgreich finden", data: fetchAllUser.reverse() })
          }
          else{
            
            const getAssignedEmp = await Models.customer_emp_relations.findAll({ where: { emp_id: checkUser.dataValues.id } })

            const filterd_customer =  getAssignedEmp.map((val)=>{
              const abc=  fetchAllUser.filter((order) => order.dataValues.id == val.customer_id);
              return abc[0]
            })
            return res.status(200).send({ status: true, message: "fetched successfully", data: filterd_customer})
          }

        // res.status(200).send({ status: true, message: "find users successfully", data: FatchUser.reverse() })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "Ich kann keine Benutzer finden, da ist ein Fehler aufgetreten", data: [], error: err.message })
    }
}


// delete user/employee - both side
exports.DeleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const removeUser = await Models.Users.destroy({ where: { id: userId } })
        const removeOrder = await Models.Orders.destroy({where:{uId : userId}})
        res.status(200).send({ status: true, message: "Benutzer erfolgreich entfernt", data: removeUser })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "Benutzer kann nicht gelöscht werden, da ist ein Fehler aufgetreten", data: [], error: err.message })
    }
}


// forgot password

exports.Forgotpassword = async (req, res) => {
    try {
        const { password } = req.body;
        const { token } = req.params
        // console.log(req)
        const decode = decodeJWTToken(token);
        const email = decode.email
        // const checkId = req.userId
        await Models.forgotpassword.findOne({ email })
        // genrate cripted password
        const hashedPassword = await bcrypt.hash(password, 11);
        const checkUser = await Models.Users.update({ password: hashedPassword }, { where: { email } });

        res.status(200).send({ status: true, message: "Passwortanderung erfolgreich", data: checkUser })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "Passwort nicht geandert, etwas ist schief gelaufen", data: [], error: err.message })
    }
}

// export forgot password link

exports.ForgotPasswordLink = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) return res.status(404).send({ status: false, message: "Bitte geben Sie Ihre E-Mail-Adresse ein", data: [] })
        const checkUser = await Models.Users.findOne({ where: { email } });

        const token = generateJWTToken({ email }, "10m")
        await Models.forgotpassword.create({ email, token })
        const VerificationLink = `<p>Hallo <strong>${checkUser.company}</strong> please <a href="${process.env.BASE_URL}/changepassword/${token}">klicken Sie hier</a> to change Password </p>`
        sendVerifyMail(email, '7i7 forgot Password Link', "", VerificationLink)
        res.status(200).send({ status: true, message: "E-Mail erfolgreich gesendet", data: [] })

    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: "E-Mail-Link kann nicht gesendet werden, da ist ein Fehler aufgetreten", data: [], error: err.message })
    }
}

// permission api

exports.permission = async (req, res) => {
    try {
        const uid = req.userId
        const permission = []
        // send permission levels
        const getEmpPermissions = await Models.Emp_Permission.findAll({ where: { emp_id: uid } })
        getEmpPermissions.map((val) => {
            permission.push(val.dataValues.permission)
        })
        res.status(200).send({ status: true, message: "Berechtigüngs-Fetches erfolgreich", data: permission })
    } catch (err) {
        console.log(err)
        res.status(500).send({ status: false, message: " Die Berechtigüng konnte nicht eingeholt werden, etwas ist schief gelaufen", data: [], error: err.message })
    }
}