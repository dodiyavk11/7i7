import {
  AddressElement,
  CardElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
// import { confirmAlert } from "react-confirm-alert";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import styled, { createGlobalStyle } from "styled-components";

import "./Account.css";
import { AccountSchema } from "./AccountSchema";

// const StyledCell = styled.div`

// &.Active{
//   background: rgb(13, 95, 13);
//   border-radius : 5px;
//   padding: 10px 20px;
//   text-align:center;
//    font-weight:500;
// }
// &.Paused {
//   background:  orange;
//   border-radius : 5px;
//   padding: 10px 20px;
//   text-align:center;
//    font-weight:500;
// }
// `;

export default function Account() {
  function membership(subs_status) {
    if (subs_status === 1) {
      return "Active";
    } else if (subs_status === 2) {
      return "Paused";
    }
  }
  // const nevigate = useNavigate()

  const [error] = useState(null);
  const [, setUpdate] = useState();
  const [isLoaded, setIsLoaded] = useState(false);
  const token = localStorage.getItem("token");
  const [data, setData] = useState([]);
  const [link, setLink] = useState();

  const getuser = () => { 
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/account/user/profile`,
      data: data,
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
      },
    })
      .then(function (res) {
        setIsLoaded(true);
        setData(res.data.data);
        // console.log(res)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
      })
      .catch(function (res) {
        setIsLoaded(true);
        // toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" });
      });
  };
  useEffect(() => {
    getuser();
  }, []);
  // console.log(data);
  // selected subscribe product

  // const [selectedproduct, setSelectedProduct] = useState([])
  // const [price, setPrice] = useState()
  // const [wet, setWet] = useState()
  // const [total, setTotal] = useState()
  // const [description, setDescription] = useState()
  // const [subsstatus, setSubsStatus] = useState()
  // const [product_id, setProduct_id] = useState()

  // const SelectedProduct = (id) => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/product/details`,
  //     data: { id: id },
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     }
  //   }).then((res) => {
  //     setSelectedProduct(res.data.data.pdtInfo[0].id)
  //     setPrice(res.data.data.paymentInfo.price)
  //     setWet(res.data.data.paymentInfo.vat_tax)
  //     setTotal(res.data.data.paymentInfo.total)
  //     setDescription(res.data.data.paymentInfo.product_des)
  //     setSubsStatus(res.data.data.paymentInfo.subs_status)
  //     setProduct_id(res.data.data.pdtInfo[0].stripe_product_id)
  //     toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //   })
  //     .catch((res) => {
  //       toast.error(res.data.message)
  //     })
  // }

  // invoice
  // const [productname, setProductName] = useState([])
  // const downloadinvioce = () => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/invoice/links`,
  //     headers: {
  //       'content-type': 'multipart/form-data',
  //       'authorization': `Bearer ${token}`
  //     }
  //   })
  //     .then(function (res) {
  //       setIsLoaded(true);
  //       setLink(res.data.data.invoice)
  //       setProductName(res.data.data.productName)
  //     })
  //     .catch(function (res) {
  //       toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //     });

  // }
  // useEffect(() => {
  //   downloadinvioce()
  // }, [])

  // pause plan

  // const resume = () => {

  //   confirmAlert({
  //     title: 'Confirm to resume plan',
  //     message: 'Are You Sure to Resume Your Plan ?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => resumeplan(product_id, selectedproduct)
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });
  // }
  // const pauseed = () => {

  //   confirmAlert({
  //     title: 'Confirm to paused plan',
  //     message: 'Are You Sure to Paused Your Plan ?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => pauseplan(product_id, selectedproduct)
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });
  // }

  // const pauseplan = (product_id, selectedproduct) => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/subscription/pause`,
  //     data: { pro_id: product_id },
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     }
  //   }).then((res) => {
  //     toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //     SelectedProduct(selectedproduct)
  //   })
  //     .catch(function (res) {
  //       toast.error(res.data.message, { toastId: "unique-random-text-xAu9C9-" });

  //     });

  // }

  // const resumeplan = (product_id, selectedproduct) => {

  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/subscription/resume`,
  //     data: { pro_id: product_id },
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     }
  //   }).then((res) => {
  //     toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //     SelectedProduct(selectedproduct)
  //   })
  //     .catch(function (res) {
  //       toast.error(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //     });

  // }

  // const renderPlan = () => {
  //   if (subsstatus === 2) {
  //     return (
  //       <button className=" pause " onClick={resume}>
  //         <i className="bi bi-justify icon user-i"></i>
  //         <span className="btn-text"> Resume your Plan  </span>
  //       </button>
  //     );
  //   } else if (subsstatus === 1) {
  //     return (
  //       <button className=" resume " onClick={pauseed}>
  //         <i className="bi bi-justify icon user-i"></i>
  //         <span className="btn-text"> pause your Plan  </span>
  //       </button>
  //     );
  //   }
  // };
  // cancle plan

  // const cancelled = () => {

  //   confirmAlert({
  //     title: 'Confirm to cancelled plan',
  //     message: 'Are You Sure To Cancelled Your Plan ?',
  //     buttons: [
  //       {
  //         label: 'Yes',
  //         onClick: () => cancleplan(product_id, selectedproduct),
  //       },
  //       {
  //         label: 'No',
  //       }
  //     ]
  //   });
  // }
  // const cancleplan = (product_id, selectedproduct) => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/subscription/cancel`,
  //     data: { pro_id: product_id },
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     }

  //   }).then((res) => {
  //     toast.success(res.data.message);
  //     SelectedProduct(selectedproduct)
  //     setTimeout(() => {
  //       window.location.reload(true);
  //     }, 1000);
  //   })
  //     .catch(function (res) {
  //       toast.error(res.data.message);
  //     });
  // }

  // update change

  // const [cardDetail, setCardDetail] = useState(null)
  // const [addressDetail, setAddressDetail] = useState(null)
  // const elements = useElements()
  // const stripe = useStripe()

  // const handleChang = (e) => {
  //   console.log(e)
  //   if (e.complete === true) {
  //     setCardDetail(e)
  //   }
  //   else {
  //     setCardDetail(null)
  //   }
  // }
  // const addressChange = (e) => {
  //   if (e.complete === true) {
  //     const address = e.value;
  //     setAddressDetail(address)
  //   } else {
  //     setAddressDetail(null)
  //   }
  // }
  // const onSubmit = async (e) => {
  //   e.preventDefault()
  //   if (!stripe || !elements) throw new Error("problem with stripe hooks")
  //   if (cardDetail === null) throw new Error("fill full card info")

  //   const cardElement = elements.getElement(CardElement)
  //   const result = await stripe.createToken(cardElement)

  //   if (result.error) throw result.error

  //   if (result.token) {
  //     axios({
  //       method: "POST",
  //       url: `${process.env.REACT_APP_BASE_URL}/subscription/update`,
  //       data: { ...result, addressDetail },
  //       headers: {
  //         'authorization': `Bearer ${token}`
  //       }
  //     }).then((res) => {
  //       toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //       setTimeout(() => {
  //         window.location.href = "/user/account"
  //       }, 2000)
  //     })
  //       .catch((res) => {
  //         console.log(res)
  //         toast.error(res.data.message)
  //       })
  //   }

  // }

  // add

  // const [paymentmethod, setPymentMethod] = useState([])
  // const updatedata = () => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/render/info`,
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     }
  //   }).then((res) => {
  //     setPymentMethod(res.data.data.paymentInfo.payment_method)
  //   })
  //     .catch(function (res) {
  //       toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //     });
  // }
  // useEffect(() => {
  //   updatedata();
  // }, [])

  // fatch subscribe products

  // const [subscribeproducts, setSubscribeproducts] = useState([])

  // useEffect(() => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/user/getproduct`,
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     }
  //   }).then((res) => {
  //     setSubscribeproducts(res.data.data)
  //     // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
  //   })
  //     .catch((res) => {
  //       toast.error(res.data.message)
  //     })
  // }, [])

  // const [editdata, setEditdata] = useState([]);


  const [values, setValues] = useState({
    email: data.email,
    password: "",
    company: data.company,
    street: data.street,
    postalNum: data.postalNum,
    country: data.country,
    fname: data.fname,
    lname: data.lname,
    file: data.userImg,
    repeatpassword: "",
    ustId: data.ustId,
    number: data.number,
    city: data.city,
    code: data.ustId,
    paymentStripe: data.paymentStripe,
  });
  // console.log(values);
  const initialErrors = {
    email: '',
    password: '',
    company: '',
    street: '',
    postalNum: '',
    country: '',
    fname: '',
    lname: '',
    file: '',
    repeatpassword: '',
    ustId: '',
    number: '',
    city: '',
    code: '',
    paymentStripe: '',
  };
  const [errors, setErrors] = useState(initialErrors);

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };
  const validatePassword = (password, repeatpassword) => {
    return password === repeatpassword;
  };



  const [errors1, setError] = useState({
    email: '',
    password: '',
    repeatpassword: '',
    company: '',
    street: '',
    postalNum: '',
    country: '',
    fname: '',
    file: '',
    lname: '',
    ustId: '',
    number: '',
    city: '',
    code: '',
    paymentStripe: '',
  });
  const handleChange = (event) => {
    var newdata = data;
    const { name, value } = event.target;

    setData({ ...data, [name]: value });
    // console.log(data);
    if (name === 'email') {
      if (!validateEmail(value)) {
        setError({ ...errors1, email: 'Ungültig E-Mail...' });
      } else {
        setError({ ...errors1, email: '' });
      }
    }
    else {
      setError({ ...errors1, [name]: '' });
    }

  };
  const handleBlur = (event) => {
    const { name, value } = event.target;
    var newdata = data;
    // console.log(newdata.password);
    // console.log(value);
    if (name == "password" || name == "repeatpassword") {
      // console.log(value.length);
      if (value.length < 6) {
        setError({ ...errors1, [name]: 'Das Passwort darf maximal 6 Zeichen lang sein' });
      }
      else if (value.length > 20) {
        setError({ ...errors1, [name]: 'Das Passwort darf maximal 20 Zeichen lang sein' });
      }
      else {
        setError({ ...errors1, [name]: '' });
      }
    }

    setTimeout(() => {
      // console.log("hiii")
      if (newdata.password != undefined && newdata.repeatpassword != undefined) {
        // console.log('asdasd');
        if (!validatePassword(newdata.password, newdata.repeatpassword)) {
          setError({ ...errors1, repeatpassword: 'Passwort müss übereinstimmen' });
        }
        else {
          setError({ ...errors1, [name]: '' });
        }
      }
    }, 1000);

  };


  // console.log(errors1);

  const [isLoading, setIsLoading] = useState(false);

  const { touched, setFieldValue } = (event) => {

  };

  const handleSubmit = (event) => {

    // const [data, setData] = useState([]);
    var newdata = data;




    let hasEmptyFields = false;
      const errorMessages = {};
      for (const key in newdata) {
        // console.log('ASdas');
        if (newdata[key] === '' && key != "active_membership_status" && key != "role"  && key != "password"  && key != "repeatpassword" && key != "ustId" ) {
          if (key === "company") {
            errorMessages.company = 'Unternehmen...';
          } else if (key === "street") {
            errorMessages.street = 'Straße...';
          } else if (key === "postalNum") {
            errorMessages.postalNum = 'Postleitzahl...';
          } else if (key === "country") {
            errorMessages.country = 'Land...';
          } else if (key === "number") {
            errorMessages.number = 'Nummer...';
          } else if (key === "city") {
            errorMessages.city = 'Stadt...';
          } else if (key === "fname") {
            errorMessages.fname = 'Vorname...';
          } else if (key === "lname") {
            errorMessages.lname = 'Nachname...';
          } else if (key === "email") {
            errorMessages.email = 'E-Mail...';
          }
          hasEmptyFields = true;
        }
        
       
      }
      setError({ ...errors1, ...errorMessages });
 




    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {


      // console.log(validatePassword);
      if (data.password == undefined) {
        // console.log("sadd");
        newdata.password = "";
      }
      if (data.repeatpassword == undefined) {

        newdata.repeatpassword = "";

      }
      // console.log(newdata);
     
      if (hasEmptyFields) {
        setIsLoading(false);
        // console.log("Some fields are empty.");
        // You can display an error message or take appropriate action here
      } else { 
        axios({
          method: "PATCH",
          url: `${process.env.REACT_APP_BASE_URL}/account/user/profile`,
          data: newdata,
          headers: {
            "content-type": "multipart/form-data",
            authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            setIsLoading(false);
            // console.log(res);
            toast.success(res.data.message, {
              toastId: "unique-random-text-xAu9C9-",
            });
            // Handle the response as needed
          })
          .catch((res) => {
            // setIsLoading(false);
            // console.log(error);
            toast.error(res.response.data.message);
            // Handle the error response as needed
          })
          .finally(() => {
            setIsLoading(false); // Stop loading, whether success or error
          });
      }
    
    }, 1000);
  };







  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return (
      <img
        src={"https://i.gifer.com/VAyR.gif"}
        className="loader"
        alt="loading"
      />
    );
  } else {
    return (
      <>
        <div className="main-body dashboard" id="root1">
          <form onSubmit={handleSubmit}>
            <div className="account-header d-flex div">
              <i className="fa-solid fa-person fs-2 mt-2"></i>
              <h3>Konto </h3>
              <button
                type="submit"
                onClick={handleSubmit}
                className="order-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>
                    <i className="bi bi-hourglass-split icon pe-1"></i>Wird
                    bearbeitet...
                  </span> // Replace with your loader icon
                ) : (
                  <span>
                    <i class="bi bi-save2-fill pe-1"></i>
                    speichern
                  </span>
                )}
              </button>
              {/* <button type="submit" className='order-btn d-flex'><i className="fa-solid fa-print pt-1 pe-1"></i><h4> Safe</h4></button> */}
            </div>

            <div className="div ">
              <div className="description ">
                <div className="row  Registration ">
                  <div className="col-md-6 ">
                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>
                      <label className="user-label">
                        Vorname: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="fname"
                        defaultValue={data.fname}
                        placeholder="Vorname..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.fname ? (
                          <small className="form-error">{errors1.fname}</small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>
                      <label className="user-label">
                        E-Mail: <small>*</small>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="E-Mail..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.email ? (
                          <small className="form-error">{errors1.email}</small>
                        ) : null}
                      </div>
                    </div>
                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>

                      <label className="user-label">
                        Passwort: <small></small>
                      </label>
                      <input
                        type="password"
                        name="password"
                        defaultValue={data.password}
                        placeholder="Passwort..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.password ? (
                          <small className="form-error">
                            {errors1.password}
                          </small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>

                      <label className="user-label">
                        Unternehmen: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="company"
                        defaultValue={data.company}
                        placeholder="Unternehmen..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.company ? (
                          <small className="form-error">{errors1.company}</small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>

                      <label className="user-label">
                        Straße: <small>*</small>
                      </label>

                      <input
                        type="text"
                        name="street"
                        defaultValue={data.street}
                        placeholder="Straße...."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.street ? (
                          <small className="form-error">{errors1.street}</small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>

                      <label className="user-label">
                        Postleitzahl: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="postalNum"
                        defaultValue={data.postalNum}
                        placeholder="Postleitzahl..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.postalNum ? (
                          <small className="form-error">
                            {errors1.postalNum}
                          </small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>

                      <label className="user-label">
                        Land: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="country"
                        defaultValue={data.country}
                        placeholder="Land..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.country  ? (
                          <small className="form-error">{errors1.country}</small>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="field">
                      <i className="bi bi-list-ul user-i"></i>
                      <label className="user-label">
                        Nachname: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="lname"
                        defaultValue={data.lname}
                        placeholder="Nachname..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">

                        {errors1.lname? (
                          <small className="form-error">{errors1.lname}</small>
                        ) : null}
                      </div>
                    </div>
                    <div className="field">
                      <i className="bi bi-file-arrow-up registration-icon user-i"></i>
                      <label className="user-label">
                        Profilbild: <small></small>
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
                                const selectedFile = event.target.files[0];

                                // You can add validation here, e.g., checking file type, size, etc.
                                // If validation fails, you can set an error message in the 'errors1' state.
                            
                                setData({ ...data, file: selectedFile });
                              }}
                            />
                            <div className="user-input profile-input">
                              <div className="success">
                                <i className="bi bi-image"></i> Profilbild
                                hochladen
                              </div>
                            </div>
                            <div className="error">
                              {errors1.file ? (
                                <small className="form-error">
                                  {errors1.file}
                                </small>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="col-1 col-md-2 profile-img">
                          {data.file ? (
                            <img
                              src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${data.file}`}
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                height: "50px",
                                width: "50px",
                                borderRadius: "50%",
                                background: "grey",
                              }}
                            ></div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-exclamation-triangle user-i"></i>
                      <label className="user-label">
                        Passwort wiederholen: <small></small>
                      </label>
                      <input
                        type="password"
                        name="repeatpassword"
                        placeholder="Passwort wiederholen..."
                        className="user-input"
                        defaultValue={data.repeatpassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.repeatpassword ? (
                          <small className="form-error">
                            {errors1.repeatpassword}
                          </small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-exclamation-triangle user-i"></i>
                      <label className="user-label">
                        USt-IdNr.: <small></small>
                      </label>
                      <input
                        type="text"
                        name="ustId"
                        placeholder="USt-IdNr..."
                        className="user-input"
                        defaultValue={data.ustId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {" "}
                        {errors1.ustId  ? (
                          <small className="form-error">{errors1.ustId}</small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-exclamation-triangle user-i"></i>
                      <label className="user-label">
                        Nummer: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="number"
                        placeholder="Nummer..."
                        className="user-input"
                        defaultValue={data.number}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />

                      <div className="error">
                        {errors1.number  ? (
                          <small className="form-error">{errors1.number}</small>
                        ) : null}
                      </div>
                    </div>

                    <div className="field">
                      <i className="bi bi-exclamation-triangle user-i"></i>
                      <label className="user-label">
                        Stadt: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Stadt..."
                        className="user-input"
                        defaultValue={data.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error">
                        {errors1.city ? (
                          <small className="form-error">{errors1.city}</small>
                        ) : null}
                      </div>
                    </div>
                    <div className="field">
                      {/* <i className="bi bi-list-ul registration-icon"></i>

                      <label className="user-label">
                        Code: <small>*</small>
                      </label>
                      <input
                        type="text"
                        name="code"
                        value={7777777}
                        placeholder="Code..."
                        className="user-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      /> */}
                      {/* <div className="error">
                        {errors.code && touched.code ? (
                          <small className="form-error">{errors.code}</small>
                        ) : null}
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {/* <div className="div">
            <div className="description">
              <div className="header-left">
                <i className="bi bi-binoculars  user-i"></i>
                <b className="user-b">Your Payment-Method</b>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="field">
                    <i className="bi bi-exclamation-triangle user-i"></i>
                    <label className="user-label">
                      Your Payment-Method: <small>*</small>
                    </label>
                    <input
                      className="user-input"
                      type="text"
                      name="password"
                      placeholder="Stripe Kredit Card."
                      value={paymentmethod + " card"}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="field">

                  <!-- Button trigger modal -->

                  <button type="button" className=" user-update-payment" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    <i className="bi bi-justify icon user-i"></i>
                    update your payment method
                  </button>

                  <!-- Modal -->

                  <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5 text-dark" id="exampleModalLabel"> update your payment method</h1>
                          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <form className='form-container' onSubmit={(e) => onSubmit(e)}>
                          <CardElement onChange={(e) => handleChang(e)} />
                          <AddressElement options={{ mode: 'billing' }} onChange={(e) => addressChange(e)} />
                          <button type="submit" className='submit-button'>update</button>
                        </form>

                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="div">
            <div className="description">
              <div className="header-left">
                <i className="bi bi-binoculars i user-i"></i>
                <b className="user-b">Your invoice</b>
              </div>
              <div className="payment-field main_payment_invoice">

                {link && link.map((val) => {
                  return (<>
                    <button className=" account-downloadbtn payment-field1" onClick={downloadinvioce}>
                      <i className="bi bi-download icon user-i"></i>
                      <a href={val} className="btn-text"> download </a>
                    </button>
                  </>)
                })}
                <div className="pro_names">{productname && productname.map((val) => { return <p className="name_product">{val}</p> })}</div>
              </div>
            </div>
          </div> */}

          {/* <div className="div">
            <div className="description">
              <div className="header-left">
                <i className="bi bi-binoculars i user-i"></i>
                <b className="user-b">Your Subscribe products</b>
              </div>

              <div className="row">

                <div className="col-md-6">
                  <div className="field">
                    <i className="bi bi-exclamation-triangle user-i"></i>
                    <label className="user-label">
                      Your Subscribed Plan: <small>*</small>
                    </label>
                    <select
                      type="text"
                      name="customer"
                      placeholder="enter  customer"
                      className="user-input product_setect"
                      onChange={(e) => SelectedProduct(e.target.value)}>
                      <option value='' className="product_option">select subscribe products</option>
                      {subscribeproducts && subscribeproducts.map((e) => {
                        return <option value={e.id} className="product_option">{e.product_name}</option>
                      })}
                    </select>
                  </div>
                </div>
                <div className="col-md-6 ">
                  <div className="field">
                    <i className="bi bi-exclamation-triangle user-i"></i>
                    <label className="user-label">
                      status: <small>*</small>
                    </label>

                    <StyledCell className={membership(subsstatus)}>
                      {subsstatus && membership(subsstatus)}
                    </StyledCell>
                  </div>
                </div>
              </div>
              <div className="cost row">
                <div className="col-md-6">
                  <table className="account-table">
                    <tbody>
                      <tr className="account-tr">
                        <td>Price per month:</td>
                        <td>{price}€/month</td>
                      </tr>
                      <tr>
                        <td>19% VAT:</td>
                        <td>{wet}€/month</td>
                      </tr>
                      <tr>
                        <td>Total:</td>
                        <td>{total}€/month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="col-md-6">
                  <div className="field">
                    <i className="bi bi-exclamation-triangle user-i"></i>
                    <label className="user-label">
                      description: <small>*</small>
                    </label>
                    <div className="des">{description && description}</div>
                  </div>
                </div>
              </div>
              {renderPlan(product_id)}
              <button className="cancle-plan ms-2" onClick={() => cancelled(product_id)}>
                <i className="bi bi-justify icon user-i"></i>
                <span className="btn-text"> cancle your plan </span>
              </button>
            </div>
          </div> */}

          {/* <div className="div">
            <div className="description">
              <div className="header-left">
                <i className="bi bi-binoculars i user-i"></i>
                <b className="user-b">Subscribe New Products</b>
              </div>
              <div className="payment-field">
                <button className="order-btn">
                  <i class="bi bi-easel2-fill"></i>
                  <Link to="/products" className="btn-text"> Choose New Products </Link>
                </button>
              </div>
            </div>
          </div> */}
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
}
