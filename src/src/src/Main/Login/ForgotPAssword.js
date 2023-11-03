import React, { useEffect, useState } from "react";
import "./Login.css";
// import loginlogo from '../../Assets/images/logo.png'
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ForgottenRegistrationSchema } from "./ForgotepassRgistrationschema";

const ForgotPAssword = () => {
  const navigate = useNavigate()
  const initialValues = {
    password: "",
    repetpassword: ""
  };
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: ForgottenRegistrationSchema,
    onSubmit: data => {
      setIsLoading(true); // Start loading
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/forgotPassword/${token}`,
        data: data,
      })
        .then((res) => {
          setTimeout(() => {
            toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
          }, 1000);
          navigate("/")
        })
        .catch(function (res) {
          toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });

    }
  })

  return (
    <>


      <div className="login" id="root1">
        <div className="login-img">
          <img
            src='https://app.7i7.de/static/media/logo.e4d8a2f52f85ba3558fc.png'
            alt="logo"
          />
        </div>
        <form name="frm" onSubmit={handleSubmit}>
          <div className="field">
            <label className="login-label">
            Passwort: <small>*</small>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Schreiben Sie Ihr Passwort."
              className="login-input"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <div className="error">
              {errors.password && touched.password ? <small className='form-error'>{errors.password}</small> : null}
            </div>
          </div>

          <div className="field">
            <label className="login-label">
            Passwort wiederholen: <small>*</small>
            </label>
            <input
              type="password"
              name="repetpassword"
              placeholder="Schreiben Sie Ihr Passwort."
              className="login-input"
              value={values.repetpassword}
              onChange={handleChange}
              onBlur={handleBlur}
            />

            <div className="error">
              {errors.password && touched.password ? <small className='form-error'>{errors.password}</small> : null}
            </div>
          </div>

          <div className="field">
            {/* <button className=" mt-3 login-btn" type="btn" >
              <i className="bi bi-box-arrow-in-right"></i>
              <b className="btn-text"> Change Password</b>
            </button> */}

            <button
                    type="submit"
                    className=" mt-3 login-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                    ) : (
                      <>
                      <b className="btn-text">
                        <i className="fa-solid fa-print pe-1"></i>
                        Passwort ändern</b>
                      </>
                    )}
                  </button>
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
export default ForgotPAssword;

