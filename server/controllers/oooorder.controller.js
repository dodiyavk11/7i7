const Models = require("../models");
const { Op } = require("sequelize");
const path = require("path");
const { unlinkOrder } = require("../utils/unlinkFile");
const { sendVerifyMail, emailTemplate } = require("../utils/emailsUtils");
var fs = require("fs");

// add new order - both user and admin side
exports.NewOrder = async (req, res) => {
  try {
    const checkId = req.userId;
    const checkUser = await Models.Users.findOne({ where: { id: checkId } });
    const admin = await Models.Users.findAll({ where: { role: 1 } });
    let uId;
    if (checkUser.role == 0) {
      uId = req.userId;
    } else {
      uId = Number(req.body.uId);
    }
    const {
      ordername,
      orderpriority,
      orderdetail,
      orderstatus,
      products,
      employee,
    } = req.body;
    const orderInfo = {
      uId,
      ordername,
      orderpriority,
      orderdetail,
      orderstatus,
      products,
    };

    const orderfile = req.files;
    const name = req.body.name;
    // if (orderfile) orderInfo.orderfile = orderfile.filename

    const addOrder = await Models.Orders.create(orderInfo);
    //  multiple files add
    if (orderfile) {
      orderfile.map((val, i) => {
        Models.order_files.create({
          order_id: addOrder.dataValues.id,
          files: val.filename,
          orignal_name: name[i],
        });
        fs.rename(
          `${__dirname}/../assets/neworder/${name[i]}`,
          `${__dirname}/../assets/neworder/${val.filename}`,
          function (err) {
            console.log(err);
          }
        );
      });
    }

    if (employee && employee.length > 0) {
      await Promise.all(
        employee.map(async (val) => {
          try {
            const OrderAssign = {
              emp_id: val,
              order_id: addOrder.dataValues.id,
              customer_id: uId,
            };
            await Models.Employee_Orders.create(OrderAssign);
            const newRelation = { emp_id: val, customer_id: uId };
            // await Models.customer_emp_relations.create(newRelation)
          } catch (err) {
            console.log(err);
            if (err) throw err;
          }
        })
      );
    } else {
      const getCustomer = await Models.customer_emp_relations.findAll({
        where: { customer_id: uId },
      });
      if (getCustomer.length == 0) {
        const OrderAssign = {
          order_id: addOrder.dataValues.id,
          customer_id: uId,
        };
        await Models.Employee_Orders.create(OrderAssign);
      } else {
        const getEMpId = await getCustomer.map(async (val) => {
          const OrderAssign = {
            emp_id: val.dataValues.emp_id,
            order_id: addOrder.dataValues.id,
            customer_id: uId,
          };
          await Models.Employee_Orders.create(OrderAssign);
        });
      }
    }
    const mailTexts = await Models.email_template.findOne({
      where: { email_type: "create_new_order" },
    });
    content = `hello from 7i7 you  have new order from ${
      checkUser.dataValues.fname + " " + checkUser.dataValues.lname
    }.`;

    let text = mailTexts.email_content;
    let subject = mailTexts.header;
    text = text.replace("{order_name}", ordername);
    text = text.replace(
      "{user_name}",
      checkUser.dataValues.fname + " " + checkUser.dataValues.lname
    );
    const mail = await emailTemplate(text);
    admin.map((val) => {
      sendVerifyMail(val.dataValues.email, subject, "", mail);
    });

    res
      .status(200)
      .send({
        status: true,
        message: "Bestellung erfolgreich hinzugefugt",
        data: addOrder,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Bestellung kann nicht hinzugefugt werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// update order - both side
exports.UpdateOrder = async (req, res) => {
  try {
    const checkId = req.userId;
    const checkUser = await Models.Users.findOne({ where: { id: checkId } });
    const name = req.body.name;
    let uId;
    if (checkUser.role == 0) {
      uId = req.userId;
    } else {
      uId = Number(req.body.uId);
    }

    const orderId = req.params.orderId;
    const { ordername, orderart, orderpriority, orderdetail, employee } =
      req.body;

    const orderInfo = { ordername, orderart, orderpriority, orderdetail };

    const getOldOrder = await Models.Orders.findOne({ where: { id: orderId } });

    const orderfile = req.files;

    if (orderfile) {
      orderfile.map(async (val, i) => {
        Models.order_files.create({
          order_id: orderId,
          files: val.filename,
          orignal_name: name[i],
        });
        fs.rename(
          `${__dirname}/../assets/neworder/${name[i]}`,
          `${__dirname}/../assets/neworder/${val.filename}`,
          function (err) {
            console.log(err);
          }
        );
      });
    }

    // update assign employees for this order
    if (checkUser.role == 1 || checkUser.role == 2) {
      if (employee && employee.length > 0) {
        await Promise.all(
          employee.map(async (val) => {
            try {
              const OrderAssign = {
                customer_id: uId,
                order_id: orderId,
                emp_id: val,
              };
              await Models.Employee_Orders.destroy({
                where: { customer_id: uId, order_id: orderId },
              });
              await Models.Employee_Orders.create(OrderAssign);
              await Models.customer_emp_relations.destroy({
                where: { emp_id: val },
              });
              const newRelation = { emp_id: val, customer_id: uId };
              await Models.customer_emp_relations.create(newRelation);
            } catch (err) {
              console.log(err);
              if (err) throw err;
            }
          })
        );
      } else {
        await Models.Employee_Orders.destroy({
          where: { customer_id: uId, order_id: orderId },
        });
      }
    }

    // change update status for red exclamation mark
    checkUser.role !== 0 &&
      (await Models.Orders.update(
        { update_status: 1 },
        { where: { id: orderId } }
      ));
    checkUser.role === 0 &&
      (await Models.Orders.update(
        { update_status_admin: 1 },
        { where: { id: orderId } }
      ));

    const UpdateOrder = await Models.Orders.update(orderInfo, {
      where: { id: orderId },
    });

    res
      .status(200)
      .send({
        status: true,
        message: "Bestellung erfolgreich aktualisiert ",
        data: orderInfo,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Bestellung kann nicht aktualisiert werden,da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// get all order of all user - admin side

exports.GetAllOrder = async (req, res) => {
  try {
    const uId = req.userId;
    const fetchAllOrder = await Models.Orders.findAll();

    res
      .status(200)
      .send({
        status: true,
        message: "order fetched successfully",
        data: fetchAllOrder,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Ich kann keine Bestellung aufgeben, etwas ist schief gelaufen",
        data: [],
        error: err.message,
      });
  }
};

// get all order by usreId - user side
exports.GetOrderByUId = async (req, res) => {
  try {
    const uId = req.userId;
    const fetchOrderByUIds = await Models.Orders.findAll({
      where: { uId },
      order: [
        ["orderpriority", "DESC"], // Sort by orderpriority in descending order
        ["orderstatus", "ASC"], // Sort by orderstatus in ascending order
        ["createdAt", "DESC"], // Sort by createdAt (date of creation) in descending order
      ],
    });
    // const fetchOrderByUId = fetchOrderByUIds.filter((order) => order.dataValues.orderstatus !== 3);
    // const filtereDoneOrders = fetchOrderByUIds.filter((order) => order.dataValues.orderstatus == 3);
    // filtereDoneOrders.map((val) => {
    //   fetchOrderByUId.push(val)
    // })

    // new sorting
    const priority = [1, 0];
    const status = [2, 1, 3];

    const filterComboArr = [];

    status.map((val, i) => {
      return priority.map((val2, i2) => {
        filterComboArr.push([val, val2]);
      });
    });

    const finalData = filterComboArr.map((val, i) => {
      return fetchOrderByUIds.filter((innerVal, i) => {
        return (
          innerVal.orderstatus === val[0] && innerVal.orderpriority === val[1]
        );
      });
    });

    finalData.map((val) => {
      val.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    const allDoneOrders = finalData.map((val) => {
      const DoneOrders = val.filter((innerVal) => innerVal.orderstatus === 3);
      const WithoutDoneOrders = val.filter((innerVal) => innerVal.orderstatus !== 3);
      return WithoutDoneOrders.concat(DoneOrders.reverse())
  })

    const finalSortData = allDoneOrders.flat(Infinity);

    res
      .status(200)
      .send({
        status: true,
        message: "employee fetched successfully",
        data: finalSortData,
      });

    // res.status(200).send({ status: true, message: "order fetched successfully", data: fetchOrderByUId })
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Ich kann keine Bestellung aufgeben, etwas ist schief gelaufen",
        data: [],
        error: err.message,
      });
  }
};

// get order by orderId - both side
exports.GetOrderByOrderId = async (req, res) => {
  try {
    const uId = req.userId;
    const { id } = req.params;
    const fetchOrderByUId = await Models.Orders.findOne({ where: { id } });

    // const fetchProductsId = await Models.Order_Products.findAll({ where: { order_id: fetchOrderByUId.dataValues.id } })

    // const productName = []
    // const getProductId = await Promise.all(fetchProductsId.map(async (val) => {
    //   const getProductName = await Models.Products.findAll({ where: { id: val.dataValues.product_id } })
    //   getProductName.map((innerVal) => { productName.push(innerVal.dataValues.id) })
    // }))

    // get assign employee id
    const getEmpInfo = await Models.Employee_Orders.findAll({
      where: { order_id: id },
    });
    const getEmpId = await getEmpInfo.map((val) => {
      return val.dataValues.emp_id;
    });

    // get multiple files
    const files = [];
    const getFiles = await Models.order_files.findAll({
      where: { order_id: id },
    });
    getFiles &&
      getFiles.map((val) => {
        files.push(val.dataValues);
      });
    fetchOrderByUId.dataValues.files = files;

    // fetchOrderByUId.dataValues.selected_products = productName
    fetchOrderByUId.dataValues.assign_emp_id = getEmpId;

    // get user name for ease for front-end dev
    const getUserInfo = await Models.Users.findOne({
      where: { id: fetchOrderByUId.dataValues.uId },
    });
    fetchOrderByUId.dataValues.user_name = getUserInfo.dataValues.company;

    // change update status for red exclamation mark
    const checkUserRole = await Models.Users.findOne({ where: { id: uId } });
    checkUserRole.role === 0 &&
      (await Models.Orders.update({ update_status: 0 }, { where: { id } }));
    checkUserRole.role !== 0 &&
      (await Models.Orders.update(
        { update_status_admin: 0 },
        { where: { id } }
      ));

    res
      .status(200)
      .send({
        status: true,
        message: "order fetched successfully",
        data: fetchOrderByUId,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Ich kann keine Bestellung aufgeben, etwas ist schief gelaufen",
        data: [],
        error: err.message,
      });
  }
};

// filter order api - admin side

exports.GetFilteredOrder = async (req, res) => {
  try {
    const uId = req.userId;
    const checkUser = await Models.Users.findOne({ where: { id: uId } });

    const { employee, orderstatus, orderpriority, customer } = req.query;
    const queryObject = {};

    if (orderstatus) queryObject.orderstatus = orderstatus;
    if (orderpriority) queryObject.orderpriority = orderpriority;
    if (customer) queryObject.uId = customer;
    if (employee) {
      const getEmpOrder = await Models.Employee_Orders.findAll({
        where: { emp_id: employee },
      });
      const order_id = await Promise.all(
        getEmpOrder.map((val) => {
          return val.dataValues.order_id;
        })
      );
      queryObject.id = order_id;
    }

    const fetchOrderByUIds = await Models.Orders.findAll({
      where: queryObject,
      order: [
        ["orderpriority", "DESC"], // Sort by orderpriority in descending order
        ["orderstatus", "ASC"], // Sort by orderstatus in ascending order
        ["createdAt", "DESC"], // Sort by createdAt (date of creation) in descending order
      ],
    });
    const fetchOrderByUId = fetchOrderByUIds.filter(
      (order) => order.dataValues.orderstatus !== 3
    );
    const filtereDoneOrders = fetchOrderByUIds.filter(
      (order) => order.dataValues.orderstatus == 3
    );
    filtereDoneOrders.map((val) => {
      fetchOrderByUId.push(val);
    });

    if (fetchOrderByUId.length == 0)
      return res
        .status(200)
        .send({
          status: true,
          message: "keine Daten gefunden",
          data: fetchOrderByUId,
        });

    // get customer name
    const getUserId = await fetchOrderByUId.map((val) => {
      return val.dataValues.uId;
    });

    const getUserName = await Promise.all(
      getUserId.map(async (val) => {
        const getUserInfo = await Models.Users.findAll({ where: { id: val } });
        return getUserInfo.map((innerVal) => {
          return {
            fname: innerVal.dataValues.fname,
            lname: innerVal.dataValues.lname,
            company: innerVal.dataValues.company,
          };
        });
      })
    );

    // get employee name
    const getOrderId = await fetchOrderByUId.map((val) => {
      return val.dataValues.id;
    });

    const getAssignEmpId = await Promise.all(
      getOrderId.map(async (val) => {
        const empOrder = await Models.Employee_Orders.findAll({
          where: { order_id: val },
        });
        return empOrder.map((innerVal) => {
          return innerVal.dataValues.emp_id;
        });
      })
    );

    const getEmpName = await Promise.all(
      getAssignEmpId.map(async (val) => {
        const getEmpInfo = await Models.Users.findAll({ where: { id: val } });
        return getEmpInfo.map((innerVal) => {
          return {
            fname: innerVal.dataValues.fname,
            lname: innerVal.dataValues.lname,
          };
        });
      })
    );

    // adding their name to main array
    fetchOrderByUId.map(
      (val, i) => (val.dataValues.customerName = getUserName[i])
    );
    fetchOrderByUId.map(
      (val, i) => (val.dataValues.employeeName = getEmpName[i])
    );
    if (checkUser.dataValues.role == 1) {
      return res
        .status(200)
        .send({
          status: true,
          message: "fetched successfully",
          data: fetchOrderByUId,
        });
    } else {
      // find orders for employee

      const empid = await Models.Employee_Orders.findAll({
        where: { emp_id: checkUser.dataValues.id },
      });
      const filtered_order = empid.map((val) => {
        const FilterOrder = fetchOrderByUIds.filter(
          (order) => order.dataValues.id == val.order_id
        );
        const filteredArray = FilterOrder.filter((value) => value != null);
        return filteredArray.length > 0 ? filteredArray[0] : null;
      });
      const FilteredOrder = await filtered_order.filter(
        (value) => value != null
      );
      // const sortOrder = FilteredOrder.sort((a, b) => {
      //   const orderPriorityComparison = b.dataValues.orderpriority - a.dataValues.orderpriority;
      //   if (orderPriorityComparison !== 0) {
      //     return orderPriorityComparison; // Sort by orderpriority in descending order
      //   }
      //   const orderStatusComparison = a.dataValues.orderstatus - b.dataValues.orderstatus;
      //   if (orderStatusComparison !== 0) {
      //     return orderStatusComparison; // Sort by orderstatus in ascending order
      //   }
      //   // Sort by createdAt (date of creation) in descending order
      //   return new Date(b.dataValues.createdAt) - new Date(a.dataValues.createdAt);
      // });

      // // set order sorting like admin side
      // const filteredOrders = sortOrder.filter((order) => order.dataValues.orderstatus !== 3);
      // const filteredDoneOrders = sortOrder.filter((order) => order.dataValues.orderstatus == 3);
      // filteredDoneOrders.map((val) => {
      //   return filteredOrders.push(val)
      // });

      // new sorting

      const priority = [1, 0];
      const status = [2, 1, 3];

      const filterComboArr = [];

      status.map((val, i) => {
        return priority.map((val2, i2) => {
          filterComboArr.push([val, val2]);
        });
      });

      const finalData = filterComboArr.map((val, i) => {
        return FilteredOrder.filter((innerVal, i) => {
          return (
            innerVal.orderstatus === val[0] && innerVal.orderpriority === val[1]
          );
        });
      });

      finalData.map((val) => {
        val.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      });

      const allDoneOrders = finalData.map((val) => {
        const DoneOrders = val.filter((innerVal) => innerVal.orderstatus === 3);
        const WithoutDoneOrders = val.filter((innerVal) => innerVal.orderstatus !== 3);
        return WithoutDoneOrders.concat(DoneOrders.reverse())
    })
  
      const finalSortData = allDoneOrders.flat(Infinity);

      return res
        .status(200)
        .send({
          status: true,
          message: "employee fetched successfully",
          data: finalSortData,
        });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Ich kann keine Bestellung aufgeben, etwas ist schief gelaufen",
        data: [],
        error: err.message,
      });
  }
};

// delete files user side
exports.DeleteOrderFile = async (req, res) => {
  try {
    // const { id } = req.body;
    const { name } = req.body;
    const delete_file = await Models.order_files.destroy({
      where: { files: name },
    });
    unlinkOrder(name);
    res
      .status(200)
      .send({
        status: true,
        message: "Bestelldatei erfolgreich gelöscht",
        data: delete_file,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Die Bestelldatei kann nicht gelöscht werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// delete order - both side
exports.DeleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const removeOrder = await Models.Orders.destroy({ where: { id: orderId } });
    res
      .status(200)
      .send({
        status: true,
        message: "Bestellung erfolgreich entfernt",
        data: removeOrder,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Bestellung kann nicht gelöscht werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// file add admin side

exports.FileAdd = async (req, res) => {
  try {
    const { orderid } = req.params;
    const orderfile = req.files;
    const name = req.body.name;

    const order = orderfile.map((val, i) => {
      Models.file_media.create({
        orderid,
        file: val.filename,
        orignal_name: name[i],
      });
      fs.rename(
        `${__dirname}/../assets/neworder/${name[i]}`,
        `${__dirname}/../assets/neworder/${val.filename}`,
        function (err) {
          console.log(err);
        }
      );
    });
    await Models.Orders.update(
      { update_status: true },
      { where: { id: orderid } }
    );
    res
      .status(200)
      .send({
        status: true,
        message: "Datei erfolgreich hinzugefugt",
        data: order,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Datei kann nicht hinzugefugt werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// file get user side

exports.GetFile = async (req, res) => {
  try {
    const { orderid } = req.params;
    const getorderfile = await Models.file_media.findAll({
      where: { orderid },
    });
    res
      .status(200)
      .send({
        status: true,
        message: "Datei wurde erfolgreich abgerufen",
        data: getorderfile,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Datei kann nicht abgerufen werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// delete final file

exports.DeleteFinalFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const removeOrder = await Models.file_media.destroy({ where: { id } });
    unlinkOrder(name);
    res
      .status(200)
      .send({
        status: true,
        message: "Datei erfolgreich entfernt",
        data: removeOrder,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Datei kann nicht gelöscht werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};

// order status change

exports.UpdateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderstatus, ordername } = req.body;
    const checkId = req.userId;
    const user_id = await Models.Orders.findOne({ where: { id: orderId } });
    const checkUser = await Models.Users.findOne({
      where: { id: user_id.dataValues.uId },
    });
    const mailTexts = await Models.email_template.findOne({
      where: { email_type: "order_status" },
    });

    let text = mailTexts.email_content;
    let subject = mailTexts.header;
    text = text.replace("{order_name}", ordername);
    // send email when order is done
    if (orderstatus == 1) {
      text = text.replace("{order_status}", "Neuer Auftrage");
      const mail = await emailTemplate(text);
      sendVerifyMail(checkUser.dataValues.email, subject, "", mail);
    }
    if (orderstatus == 2) {
      text = text.replace("{order_status}", "Wird bearbeitet");
      const mail = await emailTemplate(text);
      sendVerifyMail(checkUser.dataValues.email, subject, "", mail);
    }
    if (orderstatus == 3) {
      text = text.replace("{order_status}", "Abgeschlossen");
      const mail = await emailTemplate(text);
      sendVerifyMail(checkUser.dataValues.email, subject, "", mail);
    }
    const UpdateOrderStatus = await Models.Orders.update(
      { orderstatus },
      { where: { id: orderId } }
    );
    checkUser.role !== 0 &&
      (await Models.Orders.update(
        { update_status: true },
        { where: { id: orderId } }
      ));
    res
      .status(200)
      .send({
        status: true,
        message: "Status erfolgreich geandert",
        data: UpdateOrderStatus,
      });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({
        status: false,
        message:
          "Status kann nicht geandert werden, da ist ein Fehler aufgetreten",
        data: [],
        error: err.message,
      });
  }
};
