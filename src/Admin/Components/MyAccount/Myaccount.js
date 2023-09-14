import React, { useEffect, useState } from 'react';
import "./myaccount.css";
import { useFormik } from 'formik';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import AccountRegistrationSchema from './AccountRegistrationSchema';

export default function MyAccount() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const [data, setData] = useState([]);

  // fatch user
  const fatchuser = () => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/account/user/profile`,
      data: data,
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setData(res.data.data)
      setIsLoaded(true)
      // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
    })
      .catch((res) => {
        setIsLoaded(true)
        toast.error(res.response.message)
      })
  }

  useEffect(() => {
    fatchuser();
  }, [])

  const initialValues = {
    fname: data.fname,
    lname: data.lname,
    email: data.email,
    password: "",
    repeatpassword: "",
    file: data.userImg
  };

  const [accountdata, setAccountData] = useState([])

  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: AccountRegistrationSchema,
    onSubmit: (data) => {
      setIsLoading(true); // Start loading
      axios({
        method: "PATCH",
        url: `${process.env.REACT_APP_BASE_URL}/account/user/profile`,
        data: data,
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'multipart/form-data'
        },
      }).then((res) => {

        setAccountData(res)
        toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        fatchuser()
      }).catch((res) => {
        toast.error(res.response.data.message)
      })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });
    },
  })

  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {

    return (
      <>
        <div className="main-body"  id="root1">

          <form action="post" onSubmit={handleSubmit}>
            <div className='account-header d-flex div'>
              <i className="fa-solid fa-person fs-3 mt-2"></i>
              <h3>Mein Konto</h3>
              <button
                type="submit"
                onClick={handleSubmit}
                className="order-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                ) : (
                  <span>
                    <i class="bi bi-save2-fill pe-1"></i>
                    speichern
                  </span>
                )}
              </button>
              {/* <button type="submit" className='order-btn d-flex'><i className="fa-solid fa-print pt-1 pe-1"></i> Safe</button> */}
            </div>

            <div className='account-body div'>
              <form>
                <div className="row d-flex justify-content-evenly div1 pt-3">

                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-2"></i>Vorname : <small>*</small></label><br />
                    <input
                      type="text"
                      name="fname"
                      value={values.fname}
                      placeholder="Vorname..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.fname && touched.fname ? <small className='form-error'>{errors.fname}</small> : null}
                    </div>
                  </div>

                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-2"></i>Nachname:<small>*</small> </label> <br />
                    <input
                      type="text"
                      name="lname"
                      value={values.lname}
                      placeholder="Nachname..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.lname && touched.lname ? <small className='form-error'>{errors.lname}</small> : null}
                    </div>
                  </div>

                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> E-Mail :<small>*</small></label><br />
                    <input
                      type="email"
                      name="email"
                      value={values.email}
                      placeholder="E-Mail..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.email && touched.email ? <small className='form-error'>{errors.email}</small> : null}
                    </div>
                  </div>

                  <div className="col-md-5 allinputs ">
                    <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Position: <small></small> </label><br />
                    <input type="text" placeholder='Position... ' />
                  </div>

                  <div className="col-md-5 allinputs ">
                    <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Passwort :<small></small></label><br />
                    <input
                      type="password"
                      name="password"
                      placeholder="Passwort..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.password && touched.password ? <small className='form-error'>{errors.password}</small> : null}
                    </div>
                  </div>
                  <div className="col-md-5 allinputs ">
                    <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Passwort wiederholen:<small></small></label><br />
                    <input
                      type="password"
                      name="repeatpassword"
                      placeholder="Passwort wiederholen..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.repeatpassword && touched.repeatpassword ? <small className='form-error'>{errors.repeatpassword}</small> : null}
                    </div>
                  </div>

                  <div className="col-md-5">

                    <div className="order-field">
                      <i className="bi bi-file-arrow-up registration-icon user-i"></i>
                      <label className="user-label">
                      Profilbild: <small>*</small>
                      </label>
                      <div className="row">
                        <div className="col-8 col-md-10">
                          <div className="file-area">
                            <input
                              type="file"
                              name="file"
                              multiple="multiple"
                              placeholder="Write your E-Mail."
                              className="user-input"
                              onChange={(event) => {
                                setFieldValue("file", event.target.files[0]);
                              }}

                            />
                            <div className="user-input profile-input">
                              <div className="success">
                                <i className="bi bi-image"></i> Profilbild hochladen
                              </div>
                            </div>
                            <div className="error"> {errors.file && touched.file ? (
                              <small className="form-error">{errors.file}</small>
                            ) : null}</div>
                          </div>
                        </div>
                        <div className="col-1 col-md-2 profile-img">
                          {values.file ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.file}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 allinputs">
                  </div>
                </div>
              </form>
            </div>
          </form>


          <div class="row accounts-btn divone g-2" >
            <div class="col-lg-6 ">
              <div class="col-md-12 payroll">
                <div className="container d-flex">
                  <i className="fa-brands fa-paypal fs-2 mt-1 me-3 "></i>
                  <h3>Gehaltsabrechnungen </h3>
                </div>
                <div className="account-button pt-1">
                  <a href="https://app.lexoffice.de/selfservices" target="_blank" className='order-btn d-flex justify-content-center'><i class="bi bi-globe pe-2"></i> Abrechnungen einsehen</a>
                </div></div></div>
            <div class="col-lg-6 ">
              <div class="col-md-12 contect-hr">

                <div className="container d-flex">
                  <i className="fa-brands fa-paypal fs-2 mt-1 me-3"></i>
                  <h3>Personalabteilung kontaktieren</h3>
                </div>
                <div className=" account-button pt-1">
                  <a href=" mailto:buchhaltung@7i7.de" className='order-btn d-flex justify-content-center'><i class="bi bi-globe pe-2"></i> Personalabteilung kontaktieren
                  </a>
                </div>
              </div>
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
    )
  }
}