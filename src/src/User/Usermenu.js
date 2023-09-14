
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { BsBinocularsFill } from "react-icons/bs";
import { GiPartyPopper } from "react-icons/gi";
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { BiLogOutCircle, BiPen } from "react-icons/bi";


import "./Userstyle/Layout.css";
// import image from '../Assets/images/logo.png'
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
const Usermenu = ({ children }) => {
  const navigate = useNavigate();

  const logoutuser = () => {
    localStorage.clear("notes");
    navigate("/")
  }
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')
  // nosubscribe product send to product page
  const NoSubsproduct = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/subscribe/products`,
      data: { email: email },
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      if (res.data.expire == true) {
        toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        navigate("/products")
      } else {
        navigate("/user/neworder")
      }

    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }
  const menuItem = [
    {
      path: "dashboard",
      name: "Dashboard",
      icon: <BsBinocularsFill />,
    },

    {
      path: "neworder",
      name: "Neuer Auftrag",
      icon: <BiPen />,
      // onClick: NoSubsproduct,
    },

    {
      path: "events",
      name: "Events",
      icon: <GiPartyPopper />,
    },

  ];
  const Endmenu = [
    {
      path: "account",
      name: "Mein Konto",
      icon: <FaUserAlt />,
    },
    {
      path: "support",
      name: "Support",
      icon: <AiOutlineQuestionCircle />,
    },

  ]
  const logout = [
    {
      path: "/",
      name: "Abmelden",
      icon: <BiLogOutCircle />,
    }
  ]

  return (
    <>
      <div className="admin-container containerr">
        <div className="sidebar">
          <div className="top-section">
            <div className="logo">
              <img src='https://app.7i7.de/static/media/logo.e4d8a2f52f85ba3558fc.png' style={{ width: "50%" }} alt="logo" className="logo_img" />
            </div>
          </div>

          <div className="up">
            {menuItem.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link"
                activeClassName="active"
                onClick={item.onClick} // Attach the onClick event to the item
              >
                <div className="icon">{item.icon}</div>
                <div className="link-text">{item.name}</div>
              </NavLink>
            ))}
          </div>

          <div className="admin-End">
            {Endmenu.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link "
                activeClassName="active"
              >
                <div className="icon">{item.icon}</div>
                <div className="link-text"> {item.name}</div>
              </NavLink>
            ))}
            {logout.map((item, index) => (
              <NavLink
                to={item.path}
                key={index}
                className="link "
                activeClassName="active"
                onClick={logoutuser}
              >
                <div className="icon">{item.icon}</div>
                <div className="link-text"> {item.name}</div>
              </NavLink>
            ))}
            <p className="text-center"><a href="https://7i7.de/impressum/" target="_blank">Impressum</a> | <a href="https://7i7.de/datenschutz/" target="_blank">Datenschutz</a>  | <a href="https://7i7.de/agb/" target="_blank">AGB</a> </p>
          </div>
        </div>
      </div>


      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
};
export default Usermenu;
