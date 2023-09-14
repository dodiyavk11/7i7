import React, { useState } from "react";
import "./Registration.css";
import { useFormik } from "formik";
import { RegistrationSchema } from "./RegistrationSchema/Registrationschema";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Preview from "./priview";

export default function Registration() {

  const navigate = useNavigate();
  const initialValues = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    company: "",
    street: "",
    postalNum: "",
    country: "",
    // code:"",
    file: null,
    repeatpassword: "",
    ustId: "",
    number: "",
    city: "",
    paymentStripe: "",
  };
  const [imgevalue, setImageValue] = useState()

  const [isLoading, setIsLoading] = useState(false);
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: RegistrationSchema,

    onSubmit: (data) => {
      setIsLoading(true); // Start loading
      // post data on server
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/signup`,
        data: data,
        headers: {
          'content-type': 'multipart/form-data'
        }
      })
        .then(function (res) {
          toast.success(res.data.message);
          window.localStorage.setItem("email", res.data.data.email);
          window.localStorage.setItem("name", res.data.data.fname + " " + res.data.data.lname)
          setTimeout(() => {
            navigate("/verifypage");
          }, 500)
        })
        .catch(function (res) {
          toast.error(res.response.data.message);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });
    },
  });

  return (
    <>
      <div className=" Registration" id="root1">
        <div className="container div registration-container">
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 ">
                <div className="field">
                  <i className="bi bi-list-ul  registration-icon"></i>
                  <label className="user-label">
                  Vorname: <small>*</small>
                  </label>
                  <input
                    type="fname"
                    name="fname"
                    value={values.fname}
                    placeholder="Vorname..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <div className="error">   {errors.fname && touched.fname ? (
                    <small className="form-error">{errors.fname}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-list-ul  registration-icon"></i>
                  <label className="user-label">
                  E-Mail: <small>*</small>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    placeholder="E-Mail..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <div className="error">   {errors.email && touched.email ? (
                    <small className="form-error">{errors.email}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-list-ul registration-icon"></i>

                  <label className="user-label">
                  Passwort: <small>*</small>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={values.password}
                    placeholder="Passwort..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.password && touched.password ? (
                    <small className="form-error">{errors.password}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-list-ul registration-icon"></i>

                  <label className="user-label">
                  Unternehmen: <small>*</small>
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={values.company}
                    placeholder="Unternehmen..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.company && touched.company ? (
                    <small className="form-error">{errors.company}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-list-ul registration-icon"></i>

                  <label className="user-label">
                  Straße: <small>*</small>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={values.street}
                    placeholder="Straße..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.street && touched.street ? (
                    <small className="form-error">{errors.street}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-list-ul registration-icon"></i>

                  <label className="user-label">
                  Postleitzahl: <small>*</small>
                  </label>
                  <input
                    type="text"
                    name="postalNum"
                    value={values.postalNum}
                    placeholder="Postleitzahl..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.postalNum && touched.postalNum ? (
                    <small className="form-error">{errors.postalNum}</small>
                  ) : null} </div>
                </div>
                <div className="field">
                  <i className="bi bi-list-ul registration-icon"></i>

                  <label className="user-label">
                  Land: <small>*</small>
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={values.country}
                    placeholder="Land..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.country && touched.country ? (
                    <small className="form-error">{errors.country}</small>
                  ) : null} </div>
                </div>

              </div>

              <div className="col-md-6">
                <div className="field">
                  <i className="bi bi-list-ul  registration-icon"></i>
                  <label className="user-label">
                    Nachname: <small>*</small>
                  </label>
                  <input
                    type="lname"
                    name="lname"
                    value={values.lname}
                    placeholder=" Nachname..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />

                  <div className="error">   {errors.lname && touched.lname ? (
                    <small className="form-error">{errors.lname}</small>
                  ) : null} </div>
                </div>


                <div className="field">
                  <i className="bi bi-file-arrow-up registration-icon"></i>
                  <label className="user-label">
                    Profilbild: <small></small>
                  </label>
                  <div className="row">
                    <div className="col-10">
                      <div className="file-area">
                        <input
                          type="file"
                          name="file"
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
                        <div className="error">
                          {/* {errors.file && touched.file ? (
                            <small className="form-error">{errors.file}</small>
                          ) : null} */}
                        </div>
                      </div>
                    </div>


                    <div className="col-2 profile-img">
                      {values.file && <Preview file={values.file} />}
                    </div>
                  </div>
                </div>

                <div className="field">
                  <i className="bi bi-exclamation-triangle registration-icon"></i>
                  <label className="user-label">
                    Passwort wiederholen: <small>*</small>
                  </label>
                  <input
                    type="password"
                    name="repeatpassword"
                    placeholder="Passwort..."
                    className="user-input"
                    value={values.repeatpassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.repeatpassword && touched.repeatpassword ? (
                    <small className="form-error">{errors.repeatpassword}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-exclamation-triangle registration-icon"></i>
                  <label className="user-label">
                  USt-IdNr.: <small></small>
                  </label>
                  <input
                    type="text"
                    name="ustId"
                    placeholder="USt-IdNr..."
                    className="user-input"
                    value={values.ustId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">
                    {/* {errors.ustId && touched.ustId ? (
                    <small className="form-error">{errors.ustId}</small>
                  ) : null}  */}
                  </div>
                </div>

                <div className="field">
                  <i className="bi bi-exclamation-triangle registration-icon"></i>
                  <label className="user-label">
                    Nummer: <small>*</small>
                  </label>

                  {/* <div className="col-md-8"> */}
                    <input
                      type="text"
                      name="number"
                      placeholder="Nummer..."
                      className="user-input"
                      value={values.number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  {/* </div> */}

                  <div className="error">   {errors.number && touched.number ? (
                    <small className="form-error">{errors.number}</small>
                  ) : null} </div>
                </div>

                <div className="field">
                  <i className="bi bi-exclamation-triangle registration-icon"></i>
                  <label className="user-label">
                    Stadt: <small>*</small>
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Stadt..."
                    className="user-input"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">   {errors.city && touched.city ? (
                    <small className="form-error">{errors.city}</small>
                  ) : null} </div>
                </div>

                {/* <div className="field">
                  <i className="bi bi-list-ul registration-icon"></i>

                  <label className="user-label">
                  Code: <small>*</small>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={values.code}
                    placeholder="Code..."
                    className="user-input"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">  
                   {errors.code && touched.code ? (
                    <small className="form-error">{errors.code}</small>
                  ) : null}
                   </div>
                </div> */}
              </div>

              <div className="field">
                <div className="registration-btn-link">
                  <button className=" registration-link" type="btn" >
                    {isLoading ? (
                      <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right icon"></i>
                        <b className="btn-text">Registrieren</b>
                      </>
                    )}

                  </button>

                </div>
              </div>

            </div>
          </form>
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
}
