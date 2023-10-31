const Models = require("../models")
const bcrypt = require("bcryptjs")
const { unlinkProfile } = require("../utils/unlinkFile");

// * add employee with assign customers - admin side
exports.addEmp = async (req, res) => {
  try {
    const { email, fname, lname, password, customers, permission ,role} = req.body
    const EmpImg = req.file

    const checkUser = await Models.Users.findOne({ where: { email } })

    if (checkUser) {
      EmpImg && unlinkProfile(EmpImg.filename)
      return res.status(409).send({ status: false, message: "Mitarbeiter existiert bereits", data: [] })
    }

    // const role = 2;
    const active_membership_status = 1
    const hashedPassword = await bcrypt.hash(password, 11);
    const EmpInfo = { email, fname, lname, password: hashedPassword, role, active_membership_status }

    if (EmpImg) { EmpInfo.userImg = EmpImg.filename }
    const addEmp = await Models.Users.create(EmpInfo)
    delete addEmp.dataValues.password

    await customers.length > 0 && Promise.all(customers.map(async (val) => {
      try {
        const assignEmp = { emp_id: addEmp.dataValues.id, customer_id: val }
        await Models.customer_emp_relations.create(assignEmp)
      } catch (err) {
        console.log(err)
        if (err) throw err
      }
    }))

    // add permission levels

    if (role == 2) {
      const mailTexts = await Models.email_template.findOne({ where: { email_type: 'registration' } })
      let subject = mailTexts.header
      let text = mailTexts.email_content
      text = text.replace("{user_name}", fname + lname);
      text = text.replace("{user_email}", email);
      const EmailToken = generateJWTToken({ email: addEmp.dataValues.email }, "10m")
      const VerificationLink = `<a href="${process.env.BASE_URL}/verification/email/${EmailToken}">klicken Sie hier</a>`
      text = text.replace("{verification_Link}", VerificationLink)
      const mail = await emailTemplate(text)
      sendVerifyMail(email, subject, "", mail)
      permission.length > 0 && permission.map(async (val) => {
        try {
          const permissionDetail = {
            emp_id: addEmp.dataValues.id,
            permission: val
          }
          await Models.Emp_Permission.create(permissionDetail)
        } catch (err) {
          console.log(err)
          if (err) throw err
        }
      })
    }

    res.status(200).send({ status: true, message: "Mitarbeiter erfolgreich hinzugefugt", data: addEmp });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Mitarbeiterregister abgelehnt, etwäs ist schief gelaufen", data: [], error: err.message })
  }
}

// * fetch all employees with assigned customers - admin side
exports.fetchEmp = async (req, res) => {
  try {
    // fetch all employee
    const fetchEmp = await Models.Users.findAll({ where: { role: 2 } })

    // get all employee id
    const employee = await Promise.all(fetchEmp.map(async (val) => {
      delete val.dataValues.password
      return val.dataValues.id
    }))

    // get all customers id but it's gives all customer's id with duplicate
    const totalCustomer = await Promise.all(employee.map(async (val) => {
      const getCustomer = await Models.customer_emp_relations.findAll({ where: { emp_id: val } })
      return getCustomer.map((val) => val.dataValues.customer_id)
    }))

    // add customers to main object
    totalCustomer.map((val, i) => fetchEmp[i].dataValues.customers = val.length);

    // get order status of all order according under employee
    const EmpOrder = await Promise.all(employee.map(async (val) => {
      const getorder = await Models.Employee_Orders.findAll({ where: { emp_id: val } })
      return getorder.map((val) => val.order_id)
    }))

    const order = await Promise.all(EmpOrder.map(async (val) => {
      const totalOrder = await Models.Orders.findAll({ where: { id: val } });
      return totalOrder.map((innerVal) => innerVal.orderstatus)
    }))

    const orderId = await Promise.all(order.map(async (val) => {
      const anotherVal = { "1": 0, "2": 0, "3": 0 }
      val.map((innerVal) => {
        if (innerVal == 1) anotherVal[1] += 1
        if (innerVal == 2) anotherVal[2] += 1
        if (innerVal == 3) anotherVal[3] += 1
      })
      return anotherVal
    }))

    orderId.map((val, i) => fetchEmp[i].dataValues.allOrderStatus = val)

    res.status(200).send({ status: true, message: "Alle Mitarbeiter wurden erfolgreich abgerufen", data: fetchEmp.reverse() })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Mitarbeiterregister abgelehnt, etwäs ist schief gelaufen", data: [], error: err.message })
  }
}

// * get employee by empId
exports.fetchEmpById = async (req, res) => {
  try {
    const uId = req.params.empId
    const getEmp = await Models.Users.findOne({ where: { id: uId } })
    delete getEmp.dataValues.password

    const getAssignCustomers = await Models.customer_emp_relations.findAll({ where: { emp_id: getEmp.dataValues.id } })

    const getAssignCustomersId = await getAssignCustomers.map((val) => val.dataValues.customer_id)
    const findPermissions = await Models.Emp_Permission.findAll({ where: { emp_id: uId } })
    const getPermissionLevels = await findPermissions.map((val) => val.dataValues.permission)

    getEmp.dataValues.customers = getAssignCustomersId
    getEmp.dataValues.permission = getPermissionLevels

    res.status(200).send({ status: true, message: "Alle Mitarbeiter wurden erfolgreich abgerufen", data: getEmp })

  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Mitarbeiter känn nicht gefünden werden, etwäs ist schief gelaufen", data: [], error: err.message })
  }
}

// * edit employee with assign customers - admin side
exports.editEmp = async (req, res) => {
  try {
    const uId = req.params.empId
    const userData = await Models.Users.findOne({ where: { id: uId } })

    const { fname, lname, email, password, customers, permission } = req.body

    const checkUser = await Models.Users.findOne({ where: { id: uId } })
    delete checkUser.dataValues.password
    let addEmp;

    if (email == userData.dataValues.email) {
      let EmpInfo;
      if (password == "") {
        EmpInfo = { fname, lname, email }
      } else {
        const hashedPassword = await bcrypt.hash(password, 11);
        EmpInfo = { fname, lname, email, password: hashedPassword }
      }

      const getEmpInfo = await Models.Users.findOne({ where: { id: uId } })

      const EmpImg = req.file
      if (EmpImg) {
        unlinkProfile(getEmpInfo.dataValues.userImg)
        EmpInfo.userImg = EmpImg.filename
        checkUser.userImg = EmpImg.filename
      }

      addEmp = await Models.Users.update(EmpInfo, { where: { id: uId } })

      if (customers && customers.length > 0) {
        await customers.map(async (val) => {
          try {
            await Models.customer_emp_relations.destroy({ where: { emp_id: uId } })
            const newRelation = { emp_id: uId, customer_id: val }
            await Models.customer_emp_relations.create(newRelation)
          } catch (err) {
            console.log(err)
            if (err) throw err
          }
        })
      } else {
        await Models.customer_emp_relations.destroy({ where: { emp_id: uId } })
      }

      if (permission && permission.length > 0) {
        permission.map(async (val) => {
          try {
            await Models.Emp_Permission.destroy({ where: { emp_id: uId } })
            const permissionDetail = { emp_id: uId, permission: val }
            await Models.Emp_Permission.create(permissionDetail)
          } catch (err) {
            console.log(err)
            if (err) throw err
          }
        })
      } else {
        await Models.Emp_Permission.destroy({ where: { emp_id: uId } })
      }
    }

    else {
      let EmpInfo;
      if (password == "") {
        EmpInfo = { fname, lname, email }
      } else {
        const hashedPassword = await bcrypt.hash(password, 11);
        EmpInfo = { fname, lname, email, password: hashedPassword }
      }

      const getEmpInfo = await Models.Users.findOne({ where: { id: uId } })

      const EmpImg = req.file
      if (EmpImg) {
        unlinkProfile(getEmpInfo.dataValues.userImg)
        EmpInfo.userImg = EmpImg.filename
        checkUser.userImg = EmpImg.filename
      }

      // email update
      const checkUser = await Models.Users.findOne({ where: { email } })
      if (checkUser && checkUser.dataValues.email) {
        return res.status(409).send({ status: false, message: "Benutzer bereits registriert ", data: [] })
      }

      addEmp = await Models.Users.update(EmpInfo, { where: { id: uId } })

      if (customers && customers.length > 0) {
        await customers.map(async (val) => {
          try {
             await Models.customer_emp_relations.destroy({ where: { emp_id: uId } })
            const newRelation = { emp_id: uId, customer_id: val }
            await Models.customer_emp_relations.create(newRelation)
          } catch (err) {
            console.log(err)
            if (err) throw err
          }
        })
      } else {
        await Models.customer_emp_relations.destroy({ where: { emp_id: uId } })
      }

      if(permission && permission.length > 0) {
        permission.map(async (val) => {
          try {
            await Models.Emp_Permission.destroy({ where: { emp_id: uId } })
            const permissionDetail = { emp_id: uId, permission: val }
            await Models.Emp_Permission.create(permissionDetail)
          } catch (err) {
            console.log(err)
            if (err) throw err
          }
        })
      } else {
        await Models.Emp_Permission.destroy({ where: { emp_id: uId } })
      }
    }

    res.status(200).send({ status: true, message: "Mitarbeiter erfolgreich hinzugefugt", data: addEmp });
  }
  catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Mitarbeiterregister abgelehnt, etwäs ist schief gelaufen", data: [], error: err.message })
  }
}

// employee for new order from admin side

exports.NewOrderEmployee = async (req, res) => {
  try {
    const id = Number(req.body.id)
    const checkUser = await Models.customer_emp_relations.findAll({ where: { customer_id: id } }) 

    let employee =[];

    const empname = await Promise.all(checkUser.map(async (val) => {
      const data = await Models.Users.findOne({ where: { id: val.emp_id } });
      return val.emp_id
    }));
res.status(200).send({ status: true, message: "fatch successfully", data:empname});
  }catch(err){
    res.status(500).send({ status: false, message: "can't fatch emp, somthing went wrong", data: [], error: err.message })
  }
}