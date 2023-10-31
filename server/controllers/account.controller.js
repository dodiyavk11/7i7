const fs = require("fs")
const Models = require("../models")
const bcrypt = require("bcryptjs")
const path = require("path")
const { unlinkProfile } = require("../utils/unlinkFile")

// fetch userInfo - customer side
exports.AccountProfile = async (req, res) => {
  try {
    const uId = req.userId
    const fetchUserInfo = await Models.Users.findOne({ where: { id: uId } })
    delete fetchUserInfo.dataValues.password
    res.status(200).send({ status: true, message: "Benutzer erfolgreich gefunden", data: fetchUserInfo })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Benutzerinfo kann nicht abgerufen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// fetch userInfo - admin side 

exports.AccountProfileAdminSide = async (req, res) => {
  try {
    const uId = req.params.uId
    // // active or quite status
    // const fatchuser = await Models.User_Subs_Product.findAll({where:{user_id : uId , subs_status:1}})
    // let active_membership_status
    // if (fatchuser.length === 0) {
    //           active_membership_status = 0;
    //       } else {
    //           active_membership_status = 1;
    //       }

    // find user
    const fetchUserInfo = await Models.Users.findOne({ where: { id: uId } });
    delete fetchUserInfo.dataValues.password

    // **********************************************************************
    // // find assign employeeInfo
    // const getAssignedEmp = await Models.Employee_Orders.findAll({ where: { customer_id: fetchUserInfo.dataValues.id } })

    // // get assigned empId
    // const fetchEmpId = await getAssignedEmp.map((val) => {
    //   return val.dataValues.emp_id
    // })

    // // remove duplicate empId
    // const getUniqueId = [...new Set(fetchEmpId)];

    // // get name of employees
    // const EmpInfo = await Promise.all(getUniqueId.map(async (val) => {
    //   const Info = await Models.Users.findOne({ where: { id: val } });
    //   if (Info == null) return null;
    //   return Info.dataValues.fname + " " + Info.dataValues.lname
    // }))
// ****************************************************************************
    // find assign employeeInfo
    const getAssignedEmp = await Models.customer_emp_relations.findAll({ where: { customer_id: fetchUserInfo.dataValues.id } })

    // get assigned empId
    const fetchEmpId = await getAssignedEmp.map((val) => {
      return val.dataValues.emp_id
    })

    // remove duplicate empId
    const getUniqueId = [...new Set(fetchEmpId)];

    // get name of employees
    const EmpInfo = await Promise.all(getUniqueId.map(async (val) => {
      const Info = await Models.Users.findOne({ where: { id: val } });
      if (Info == null) return null;
      return Info.dataValues.fname + " " + Info.dataValues.lname
    }))

    // **********************************************************************

    // remove unnecessary values like null,undefined from array
    const AllEmpNames = EmpInfo.filter(n => n)

    //  add employees name to main object
    fetchUserInfo.dataValues.assign_emp_name = AllEmpNames
    fetchUserInfo.dataValues.employee = getUniqueId
    res.status(200).send({ status: true, message: "Benutzer erfolgreich gefunden", data: fetchUserInfo})
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Benutzerinfo kann nicht abgerufen werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// update user info from profile section in account - customer side
exports.UpdateProfile = async (req, res) => {
  try {
    const uId = req.userId
    const userData = await Models.Users.findOne({where:{id:uId}})

    const { fname, lname, email,password, company, street, postalNum, country, ustId, number, city } = req.body

    if(email == userData.dataValues.email){

      let userInfo;
      if (password == "") {
        userInfo = { fname, lname, email,company, street, postalNum, country, ustId, number, city }
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 11);
        userInfo = { fname, lname,email, password: hashedPassword, company, street, postalNum, country, ustId, number, city }
      }
  
      const getUserInfo = await Models.Users.findOne({ where: { id: uId } })
  
      const userImg = req.file
      if (userImg) {
        const fileName = path.basename(`assets/profilepic/${getUserInfo.dataValues.userImg}`)
        unlinkProfile(getUserInfo.dataValues.userImg)
        userInfo.userImg = userImg.filename
      }
  
      const updateUser = await Models.Users.update(userInfo, { where: { id: uId } })
      delete userInfo.password
    }else{
      let userInfo;
      if (password == "") {
        userInfo = { fname, lname, email,company, street, postalNum, country, ustId, number, city }
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 11);
        userInfo = { fname, lname,email, password: hashedPassword, company, street, postalNum, country, ustId, number, city }
      }
  
      const getUserInfo = await Models.Users.findOne({ where: { id: uId } })
  
      const userImg = req.file
      if (userImg) {
        const fileName = path.basename(`assets/profilepic/${getUserInfo.dataValues.userImg}`)
        unlinkProfile(getUserInfo.dataValues.userImg)
        userInfo.userImg = userImg.filename
      }
    
      // email update
      const checkUser = await Models.Users.findOne({ where: { email } })
      if (checkUser && checkUser.dataValues.email) {
          return res.status(409).send({ status: false, message: "Benutzer bereits registriert ", data: [] })
      }
      const updateUser = await Models.Users.update(userInfo, { where: { id: uId } })
      delete userInfo.password
    }

    

    res.status(200).send({ status: true, message: "Benutzer erfolgreich aktualisiert", data: [] })
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Benutzerinfo kann nicht aktualisiert werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}

// update user info - admin side

exports.UpdateProfileAdminSide = async (req, res) => {
  try {
    const uId = req.params.uId
    const userData = await Models.Users.findOne({where:{id:uId}})


    const { fname, lname,email, password, company, street, postalNum, country, ustId, number, city, employee ,active_membership_status } = req.body
   
let updateUser;
    if(email == userData.dataValues.email){
      let userInfo;

      if (password == "") {
        userInfo = { fname, lname,email, company, street, postalNum, country, ustId, number, city,active_membership_status }
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 11)
        userInfo = { fname, lname,email, password: hashedPassword, company, street, postalNum, country, ustId, number, city ,active_membership_status}
      }
  
      const getUserInfo = await Models.Users.findOne({ where: { id: uId } })
  
      const userImg = req.file
      if (userImg) {
        const fileName = path.basename(`assets/profilepic/${getUserInfo.dataValues.userImg}`)
  
        unlinkProfile(getUserInfo.dataValues.userImg)
  
        userInfo.userImg = userImg.filename
      }
      // userInfo.active_membership_status= active_membership_status
      if (active_membership_status == 3) {
        userInfo.active_membership_status = 3;
      }
      else {
        userInfo.active_membership_status= active_membership_status
      }
  
      const updateUser = await Models.Users.update(userInfo, { where: { id: uId } })
      delete userInfo.password
      
  
      const getOrderId = await Models.Orders.findAll({ where: { uId } })
  
      const fetchOrderId = await getOrderId.map((val) => { return val.dataValues.id })
        if(employee && employee.length > 0){
          employee.map(async (val) => {
  
            await Models.customer_emp_relations.destroy({ where: { customer_id: uId } })
            await Models.customer_emp_relations.create({ emp_id: val, customer_id: uId })
      
            // delete all old customer order and assign to selected employees
            await Models.Employee_Orders.destroy({ where: { customer_id: uId } })
            // it's for when customers has no orders
            if (fetchOrderId.length == 0) {
              Models.Employee_Orders.create({ emp_id: val, customer_id: uId });
            }
            // it's for when customers has orders
            else {
              fetchOrderId.map((innerVal) => {
                Models.Employee_Orders.create({ emp_id: val, order_id: innerVal, customer_id: uId })
              })
            }
          })
        }else{
          await Models.customer_emp_relations.destroy({ where: { customer_id: uId } })
        }
     
    }else{
      let userInfo;

      if (password == "") {
        userInfo = { fname, lname,email, company, street, postalNum, country, ustId, number, city,active_membership_status }
      }
      else {
        const hashedPassword = await bcrypt.hash(password, 11)
        userInfo = { fname, lname,email, password: hashedPassword, company, street, postalNum, country, ustId, number, city ,active_membership_status}
      }
  
      const getUserInfo = await Models.Users.findOne({ where: { id: uId } })
  
      const userImg = req.file
      if (userImg) {
        const fileName = path.basename(`assets/profilepic/${getUserInfo.dataValues.userImg}`)
  
        unlinkProfile(getUserInfo.dataValues.userImg)
  
        userInfo.userImg = userImg.filename
      }
      userInfo.active_membership_status= active_membership_status
  
      // email update
      const checkUser = await Models.Users.findOne({ where: { email } })
      if (checkUser && checkUser.dataValues.email) {
          return res.status(409).send({ status: false, message: "Benutzer bereits registriert ", data: [] })
      }
  
      const updateUser = await Models.Users.update(userInfo, { where: { id: uId } })
      delete userInfo.password
      
  
      const getOrderId = await Models.Orders.findAll({ where: { uId } })
  
      const fetchOrderId = await getOrderId.map((val) => { return val.dataValues.id })
  
      if(employee && employee.length > 0){
        employee.map(async (val) => {

          await Models.customer_emp_relations.destroy({ where: { customer_id: uId } })
          await Models.customer_emp_relations.create({ emp_id: val, customer_id: uId })
    
          // delete all old customer order and assign to selected employees
          await Models.Employee_Orders.destroy({ where: { customer_id: uId } })
          // it's for when customers has no orders
          if (fetchOrderId.length == 0) {
            Models.Employee_Orders.create({ emp_id: val, customer_id: uId });
          }
          // it's for when customers has orders
          else {
            fetchOrderId.map((innerVal) => {
              Models.Employee_Orders.create({ emp_id: val, order_id: innerVal, customer_id: uId })
            })
          }
        })
      }else{
        await Models.customer_emp_relations.destroy({ where: { customer_id: uId } })
      }
    }
    
    res.status(200).send({ status: true, message: "Benutzer erfolgreich aktualisiert", data:  updateUser})
  } catch (err) {
    console.log(err)
    res.status(500).send({ status: false, message: "Benutzerinfo kann nicht aktualisiert werden, da ist ein Fehler aufgetreten", data: [],error: err.message })
  }
}