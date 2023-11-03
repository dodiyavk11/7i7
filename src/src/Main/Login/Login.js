import React, { useEffect } from "react";
import "./Login.css";
import loginlogo from '../../Assets/images/logo.png'
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { loginSchema } from "./schemas/scheamas";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";


const Login = () => {
  const navigate = useNavigate()

  const initialValues = {
    email: "",
    password: ""
  };

  // // clear local storage on load
  // useEffect(() =>{
  //   localStorage.clear()
  // },[])

  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: loginSchema,
    onSubmit: data => {
      setIsLoading(true); // Start loading
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/signin`,
        data: data
      })
        .then((res) => {
          setTimeout(() => {
            toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
          }, 1000);
          window.localStorage.setItem("token", res.data.token);
          window.localStorage.setItem("email", res.data.data.email);
          window.localStorage.setItem("role", res.data.data.role);
          window.localStorage.setItem("loggedin", true)
          window.localStorage.setItem("name",res.data.data.fname +" "+res.data.data.lname)

        //  if(res.data.expire == true ){
        //     setTimeout(() => {
        //       toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        //       navigate("/products")
        //     }, 2000);
        //   }
        //   else
           if (res.data.data.role == 0) {
            navigate("/user")
          } else if (res.data.data.role === 1) {
            
            navigate("/admin")
          } else if (res.data.data.role === 2) {
            navigate("/employee")
            window.location.reload(true);
            setTimeout(() => {
              permissions()
            }, 1000);
          }
          else {
            navigate("/")
          }
        })
        .catch(function (res) {
          toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
      });
    }
  }
  )
  const token = localStorage.getItem("token")
  const[per,setPermission]=useState([])
  const permissions = ()=>{
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
  }
  useEffect(()=>{
    permissions()
  },[])


  return (
    <>

      <div className="login " id="root1">
        <div className="login-img">
          <img
            src={loginlogo}
            alt="logo"
          />
        </div>

        <form name="frm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="login-label">
            E-Mail: <small>*</small>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Deine E-Mail..."
              className="login-input"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}

            />
            <div className="error">
              {errors.email && touched.email ? <small className='form-error'>{errors.email}</small> : null}
            </div>
          </div>

          <div className="field">
            <label className="login-label">
            Passwort: <small>*</small>
            </label>
            <input
              type="password"
              name="password"
              placeholder=" Dein Passwort..."
              className="login-input"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div className="error">
              {errors.password && touched.password ? <small className='form-error'>{errors.password}</small> : null}

            </div>
            <div className="forgote">
              <Link to="/forgotpassword/form">Passwort vergessen?</Link>
            </div>
          </div>

          <div className="field">
            <button className=" mt-3 login-btn" type="btn" >
            {isLoading ? (
                                <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet…</span> // Replace with your loader icon
                            ) : (
                                <>
                                <i className="bi bi-box-arrow-in-right "> </i>
              <b className="btn-text"> Login</b>
                                </>
                            )}
              
            </button>
          </div>

          {/* <p className="text-cente pt-2">
          oder <br/> <Link to="registration" className="user-newaccount"><small className="user-newaccount">erstelle einen Neuer Account</small> </Link>
          </p> */}
          <div className="field">
          </div>

        </form>


      
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
        theme="red"
      />
    </>
  );
  
};
// }
export default Login;

