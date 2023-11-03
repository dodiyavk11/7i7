import React, { useEffect, useState } from 'react'
import './App.css';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

// user route path

import Userlayout from './User/Userlayout';
import Account from './User/Account/Account';
import Neworder from './User/Neworder/Neworder';
import Vieworder from './User/Vieworder/Vieworder';
import Nopage from './Nopage';
import Dashboard from './User/Dashboard/Dashboard';
import UserEvents from './User/userevents/uservents';
import Support from './User/Support/Support';
import Login from './Main/Login/Login';
import Registration from './Main/Registration/Registration';
import RegistrationProduct from './Main/Registration/Products';

// admin route path addd here

import Myaccount from './Admin/Components/MyAccount/Myaccount';
import Order from './Admin/Components/order/Order';
import Customers from './Admin/Components/customer/Customer';
import Employees from './Admin/Components/Employees/Employee';
import Products from './Admin/Components/Products/Product';
import AdminEvent from './Admin/Components/adminEvent/AdminEvent';
import NewCustomer from './Admin/Components/customer/NewCustomer';
import NewOrder from './Admin/Components/order/NewOrder';
import NewEmployee from './Admin/Components/Employees/NewEmployee';
import Adminlayout from './Admin/Adminlayout'
import Updateorder from './Admin/Components/order/Updateorder';
import Updatecustomer from './Admin/Components/customer/Updatecustomer';
import UpdateEmployee from './Admin/Components/Employees/UpdateEmployee';
import Verification from './Main/Verification';
import ForgotPAssword from './Main/Login/ForgotPAssword';
import Emailverification from './Main/Login/Emailverification';
import VerifyPage from './Main/Registration/VerifyPage';
import Email_template from './Admin/Components/EmailTemplate/Email_template';
import axios from 'axios';
import Edit_email_template from './Admin/Components/EmailTemplate/Edit_email_template';
import Edit_chat_template from './Admin/Components/EmailTemplate/Edit_chat_template';

import moment from 'moment';
import Add_chat_template from './Admin/Components/EmailTemplate/add_chat_template';



function App() {

  const [permission, setPermission] = useState([])

  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const getRole = localStorage.getItem("role")
  const location = useLocation();

  useEffect(() => {
    if (token != null && location.pathname == "/") {
      if (getRole == 0) {
        navigate("/user")
      }
      else if (getRole == 1) {
        navigate("/admin")
      }
      else if (getRole == 2) {

        navigate("/employee")
      }
    }
    // if (token == null && location.pathname != "/") {

    //   navigate("/")
    // }
  }, []);

  useEffect(() => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/permissions`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setPermission(res.data.data)
      })
      .catch(function (res) {
      });
  }, [])


  // this is for user activity, if user is not active for spectific period of time then this will redirect to the login page
  useEffect(() => {
    userActivity()
  }, [window.location.href])

  function userActivity() {
    const timeOut = localStorage.getItem("timeOut");
    const currentTimeStamp = Math.floor(Date.now() / 1000);

    if (timeOut) {
      const timeDifference = Math.abs(currentTimeStamp - timeOut);

      if (timeDifference >= 3600) {
        localStorage.clear()
        navigate("/");
      } else {
        setTimeOut()
      }

    } else {
      setTimeOut()
    }

    function setTimeOut() {
      localStorage.setItem("timeOut", currentTimeStamp)
    }
  }















  //  admin routes
  const Admin = ({ children }) => {
    if (getRole?.includes("1")) {
      return <>{children}</>
    } else {
      return <>
        <div className='page'>
          <div className='no-access'>you have no access of this page.</div>
          <Link to="/user" className='btn-click'> Click To Back</Link>
        </div>
      </>
    }
  }


  // user routes
  const User = ({ children }) => {
    if (getRole?.includes("0")) {
      return <>{children}</>
    } else {
      return <>
        <div className='page'>
          <div className='no-access'>you have no access of this page.</div>
          <Link to="/admin" className='btn-click'> Click To Back</Link>
        </div>
      </>

    }
  }

  // user routes
  const Employee = ({ children }) => {
    if (getRole?.includes("2")) {
      return <>{children}</>
    } else {
      return <>
        <div className='page'>
          <div className='no-access'>you have no access of this page.</div>
          <Link to="/emplopyee" className='btn-click'> Click To Back</Link>
        </div>
      </>

    }
  }

  // employee routes
  function OrderElement({ children }) {
    if (getRole?.includes("2") && permission?.includes(1)) {
      return <>{children}</>
    } else {
      return <div className='no-access-page'>You have no access of this page.</div>
    }
  }
  function CustomerElement({ children }) {
    if (getRole?.includes("2") && permission?.includes(2)) {
      return <>{children}</>
    } else {
      return <div className='no-access-page'>You have no access of this page.</div>
    }
  }
  function EmployeeElement({ children }) {
    if (getRole?.includes("2") && permission?.includes(3)) {
      return <>{children}</>
    } else {
      return <div className='no-access-page'>You have no access of this page.</div>
    }
  }
  function ProductElement({ children }) {
    if (getRole?.includes("2") && permission?.includes(4)) {
      return <>{children}</>
    } else {
      return <div className='no-access-page'>You have no access of this page.</div>
    }
  }
  function EventElement({ children }) {
    if (getRole?.includes("2") && permission?.includes(5)) {
      return <>{children}</>
    } else {
      return <div className='no-access-page'>You have no access of this page.</div>
    }
  }

  const [cartitems, setCartItems] = useState([])
  const allItems = (data) => {
    setCartItems(data)
  }


  return (

    <>


      <Routes>
        <Route exact path='/verification/email/:token' element={<Verification />} />
        <Route path='/changepassword/:token' element={<ForgotPAssword />} />
        <Route path='/forgotpassword/form' element={<Emailverification />} />


        <Route exact path="/" element={<Login />} />
        {/* <Route exact path="/registration" element={<Registration />} /> */}
        <Route exact path="/verifypage" element={<VerifyPage />} />
        <Route path='/products' element={<RegistrationProduct cartItems={allItems} />} />
        <Route path="/user" element={<User><Userlayout /></User>}>
          <Route index element={<User><Dashboard /></User>} />
          <Route path="/user/account" element={<User><Account /></User>} />
          <Route path="/user/neworder" element={<User><Neworder /></User>} />
          <Route path="/user/vieworder/:id" element={<User><Vieworder /></User>} />
          <Route path="/user/dashboard" element={<User><Dashboard /></User>} />
          <Route path="/user/events" element={<User><UserEvents /></User>} />
          <Route path="/user/support" element={<User><Support /></User>} />
        </Route>

        {/* admin side route */}


        <Route path="/admin" element={<Admin><Adminlayout /></Admin>}>
          <Route index element={<Admin><Order /></Admin>} />
          <Route path='neworder' element={<Admin><NewOrder /></Admin>} />
          <Route path='order/neworder' element={<Admin><NewOrder /></Admin>} />
          <Route path='order/updateorder/:id' element={<Admin><Updateorder /></Admin>} />
          <Route path="customer" element={<Admin><Customers /></Admin>} />
          <Route path='customer/newcustomer' element={<Admin><NewCustomer /></Admin>} />
          <Route path='customer/updatecustomer/:id' element={<Admin><Updatecustomer /></Admin>} />
          <Route path="employee" element={<Admin><Employees /></Admin>} />
          <Route path='employee/newemployee' element={<Admin><NewEmployee /></Admin>} />
          <Route path='employee/updateemployee/:id' element={<Admin><UpdateEmployee /></Admin>} />
          <Route path='newOrder' element={<Admin><NewOrder /></Admin>} />
          <Route path="customer" element={<Admin><Customers /></Admin>} />
          <Route path='newcustomer' element={<Admin><NewCustomer /></Admin>} />
          <Route path="employee" element={<Admin><Employees /></Admin>} />
          <Route path='newEmployee' element={<Admin><NewEmployee /></Admin>} />
          <Route path="order" element={<Admin><Order /></Admin>} />
          <Route path='event' element={<Admin><AdminEvent /></Admin>} />
          <Route path="myaccount" element={<Admin><Myaccount /></Admin>} />
          <Route path='email_templete' element={<Admin><Email_template /></Admin>} />
          <Route path='email_templete/update_email_template/:id' element={<Admin><Edit_email_template /></Admin>} />
          <Route path='chat_templete/update_chat_template/:id' element={<Admin><Edit_chat_template /></Admin>} />
          <Route path='chat_templete/add_chat_template' element={<Admin><Add_chat_template /></Admin>} />
        </Route>
      
        
        {/* <Route path="product" element={<Admin><Products /></Admin>} /> */}



        {/* employee routes  */}


        <Route path='/employee' element={<Adminlayout />} >

          <Route index element={<OrderElement><Order /></OrderElement>} />
          <Route path='neworder' element={<OrderElement><NewOrder /></OrderElement>} />
          <Route path='order/neworder' element={<OrderElement><NewOrder /></OrderElement>} />
          <Route path='order/updateorder/:id' element={<OrderElement><Updateorder /></OrderElement>} />
          <Route path="customer" element={<CustomerElement><Customers /></CustomerElement>} />
          <Route path='customer/newcustomer' element={<CustomerElement><NewCustomer /></CustomerElement>} />
          <Route path='customer/updatecustomer/:id' element={<CustomerElement><Updatecustomer /></CustomerElement>} />
          <Route path="employee" element={<EmployeeElement><Employees /></EmployeeElement>} />
          <Route path='employee/newemployee' element={<EmployeeElement><NewEmployee /></EmployeeElement>} />
          <Route path='employee/updateemployee/:id' element={<EmployeeElement><UpdateEmployee /></EmployeeElement>} />
          <Route path='newOrder' element={<OrderElement><NewOrder /></OrderElement>} />
          <Route path="customer" element={<CustomerElement><Customers /></CustomerElement>} />
          <Route path='newcustomer' element={<CustomerElement><NewCustomer /></CustomerElement>} />
          <Route path="employee" element={<EmployeeElement><Employees /></EmployeeElement>} />
          <Route path='newEmployee' element={<EmployeeElement><NewEmployee /></EmployeeElement>} />
          <Route path="order" element={<OrderElement><Order /></OrderElement>} />
          <Route path='event' element={<EventElement><AdminEvent /></EventElement>} />
          <Route path='email_templete' element={<ProductElement><Email_template /></ProductElement>} />
          {/* <Route path="product" element={<ProductElement><Products/></ProductElement>} /> */}
          <Route path="myaccount" element={<Myaccount />} />
        </Route>

        <Route path="*" element={<Nopage />} />
      </Routes>
    </>
  );

}

export default App;
