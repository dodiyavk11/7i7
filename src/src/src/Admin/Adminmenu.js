
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { BsBinocularsFill, BsPersonSquare, BsFillEnvelopeFill } from "react-icons/bs";
import { BiLogOutCircle } from "react-icons/bi";
import "./adminmenu.css"
import { GiPartyPopper } from "react-icons/gi";
const Usermenu = () => {

  const navigate = useNavigate();

  const logoutadmin = () => {
    window.localStorage.clear()
    navigate("/")
  }


  const [isopen, setisopen] = useState(false);
  const toggle = () => setisopen(!isopen);

  const menuItem = [
    {
      path: "order",
      name: "Auftrag",
      // icon: <BsBinocularsFill />,
      icon:<i className="bi bi-binoculars"></i>
    },

    {
      path: "customer",
      name: "Kunde",
      icon: <i className="bi bi-people"></i>,
    },

    {
      path: "employee",
      name: "Mitarbeiter",
      icon: <BsPersonSquare />,
    },
    // {
    //   path: "product",
    //   name: "Leistungen",
    //   icon: <i className="bi bi-easel2-fill"></i>,
    // },
    {
      path: "event",
      name: "Events",
      icon: <GiPartyPopper />,
    },
  ];
  const Endmenu = [
    {
      path: "email_templete",
      name: "E-Mail",
      icon: <BsFillEnvelopeFill />,
    },
    {
      path: "myaccount",
      name: "Mein Konto",
      icon: <FaUserAlt />,
    },
  ];
  const logout = [
    {
      path: "/",
      name: "Abmelden",
      icon: <BiLogOutCircle />,
    }
  ]

  return (
    <>

      <div className="admin-container" >
        <div style={{ height: "100vh" }} className="admin-sidebar">
          <div className="admin-top-section">
            <div className="admin-logo">
              <img src='https://app.7i7.de/static/media/logo.e4d8a2f52f85ba3558fc.png' style={{ width: "50%" }} className="logo_img"/>
            </div>
          </div>
          <div className="d-flex flex-column  justify-content-between">
            <div className="admin-up">
              {menuItem.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className="admin-link"
                  activeclassname="admin-active"
                >
                  <div className="admin-icon">{item.icon}</div>
                  <div className="admin-link-text">{item.name}</div>
                </NavLink>
              ))}
            </div>
            <div className="admin-End">
              {Endmenu.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className="admin-link "
                  activeclassname="admin-active"
                >
                  <div className="admin-icon">{item.icon}</div>
                  <div className="admin-link-text"> {item.name}</div>
                </NavLink>
              ))}

              {logout.map((item, index) => (
                <NavLink to={item.path} key={index} className="admin-link" activeclassname="active" onClick={logoutadmin} >
                  <div className="admin-icon">{item.icon}</div>
                  <div className="admin-link-text"> {item.name}</div>
                </NavLink>
              ))}

              <p className="text-center pe-auto"><a href="https://7i7.de/impressum/" target="_blank">Impressum</a> | <a href="https://7i7.de/datenschutz/" target="_blank">Datenschutz</a>  | <a href="https://7i7.de/agb/" target="_blank">AGB</a> </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};
export default Usermenu;
