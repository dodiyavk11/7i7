import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import "./newemployee.css"
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import jQuery from 'jquery';
import { useNavigate, useParams } from 'react-router-dom';
import UpdateEmployeeRegistrationSchema from './UpdateEmployeeRegistrationSchema';

const UpdateEmployee = () => {

  // dropdown
  (function ($) {
    var CheckboxDropdown = function (el) {
      var _this = this;
      this.isOpen = false;
      this.areAllChecked = false;
      this.$el = $(el);
      this.$label = this.$el.find('.dropdown-label');
      this.$checkAll = this.$el.find('[data-toggle="check-all"]').first();
      this.$inputs = this.$el.find('[type="checkbox"]');

      this.onCheckBox();

      this.$label.on('click', function (e) {
        e.preventDefault();
        _this.toggleOpen();
      });

      this.$checkAll.on('click', function (e) {
        e.preventDefault();
        _this.onCheckAll();
      });

      this.$inputs.on('change', function (e) {
        _this.onCheckBox();
      });
    };

    CheckboxDropdown.prototype.onCheckBox = function () {
      this.updateStatus();
    };

    CheckboxDropdown.prototype.updateStatus = function () {
      var checked = this.$el.find(':checked');

      this.areAllChecked = false;
      this.$checkAll.html('Alle überprüfen');

      if (checked.length <= 0) {
        this.$label.html('Mitarbeiter zuordnen');
      }
      else if (checked.length === 1) {
        this.$label.html(checked.parent('label').text());
      }
      else if (checked.length === this.$inputs.length) {
        this.$label.html('Alle ausgewählt');
        this.areAllChecked = true;
        this.$checkAll.html('Alle deaktivieren');
      }
      else {
        this.$label.html(checked.length + 'Ausgewählt');
      }
    };

    CheckboxDropdown.prototype.onCheckAll = function (checkAll) {
      if (!this.areAllChecked || checkAll) {
        this.areAllChecked = true;
        this.$checkAll.html('Alle deaktivieren');
        this.$inputs.prop('checked', true);
      }
      else {
        this.areAllChecked = false;
        this.$checkAll.html('Alle überprüfen');
        this.$inputs.prop('checked', false);
      }

      this.updateStatus();
    };

    CheckboxDropdown.prototype.toggleOpen = function (forceOpen) {
      var _this = this;

      if (!this.isOpen || forceOpen) {
        this.isOpen = true;
        this.$el.addClass('on');
        $(document).on('click', function (e) {
          if (!$(e.target).closest('[data-control]').length) {
            _this.toggleOpen();
          }
        });
      }
      else {
        this.isOpen = false;
        this.$el.removeClass('on');
        $(document).off('click');
      }
    };

    var checkboxesDropdowns = document.querySelectorAll('[data-control="checkbox-dropdown"]');
    for (var i = 0, length = checkboxesDropdowns.length; i < length; i++) {
      new CheckboxDropdown(checkboxesDropdowns[i]);
    }
  })(jQuery);
  // dropdown end


  // getemployee
  const nevigate = useNavigate()
  const [customer, setCustomer] = useState([])
  useEffect(() => {
    // customer
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/user/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setCustomer(res.data.data);
    }).catch((err) => {
      console.log(err)
    });
  }, [])


  // get employee
  const { id } = useParams();
  const [getemployee, setGetEmployee] = useState([])
  const [customers, setCutomers] = useState([])
  const [per, setPer] = useState([])
  const [img, setImg] = useState()
  useEffect(() => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/employee/get/${id}`,
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        responseType: "blob"
      },

    })
      .then((res) => {
        setIsLoaded(true);
        setGetEmployee(res.data.data);
        setCutomers(res.data.data.customers)
        setPer(res.data.data.permission)
        setImg(res.data.data.userImg)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      })
      .catch((res) => {
        setIsLoaded(true);
        toast.error(res.message)
      });
  }, [id]);


  const initialValues = {
    fname: getemployee.fname,
    lname: getemployee.lname,
    email: getemployee.email,
    profile: getemployee.userImg,
    password: ''
  };

  const token = localStorage.getItem('token')
  const [data, setData] = useState([])

  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: UpdateEmployeeRegistrationSchema,
    onSubmit: (values) => {
      console.log(values)
      setIsLoading(true); // Start loading
      axios({
        method: "PATCH",
        url: `${process.env.REACT_APP_BASE_URL}/employee/add/${id}`,
        data: { ...values, customers: customers, permission: per },
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'multipart/form-data'
        }
      }).then((res) => {
        setData(res)
        console.log(res.data.data)
        setTimeout(() => {
          toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        }, 1000);
        if(getRole == 1){
          nevigate("/admin/employee")
        }else{
          nevigate("/employee/employee");
        }
        
      }).catch((res) => {
        console.log(res)
        toast.error(res.response.data.message)
      })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });
    },

  })

  const getRole = localStorage.getItem("role")
  const [isLoaded, setIsLoaded] = useState(false);
  if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {

    return (
      <>
        <div className="main-body" id="root1">
          <form action="post" onSubmit={handleSubmit}>

            <div className='newcustomer-header div '>
              {values.profile ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}

              <div className="col-12 col-md-2 col-lg-3 col-xl-3 col-xxl-2 pt-2">
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
                  {errors.fname && touched.fname ? <small className='form-error'>{errors.fname}</small> : null}</div>
              </div>
              <div className="col-12 col-md-2 col-lg-3 col-xl-3 col-xxl-2 pt-2 lname">
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
                  {errors.lname && touched.lname ? <small className='form-error'>{errors.lname}</small> : null}</div>
              </div>
              <button
                type="submit"
                onClick={handleSubmit}
                className="order-btn order_btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                ) : (
                  <span>
                    <i class="bi bi-save2-fill pe-1 "></i>
                    speichern
                  </span>
                )}
              </button>
            </div>


            <div className='newemployee-body div'>
              <form>
                <div className="row d-flex justify-content-evenly div1 pt-4 pb-4">

                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> E-Mail :<small>*</small></label><br />
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

                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Berechtigungen: <small>*</small> </label><br />
                    <div className=" dropdown user-input " data-control="checkbox-dropdown">
                      <label className="dropdown-label text-darkuser-input">Wahlen</label>

                      <div className="dropdown-list custom-scrollbar ">
                        <label className="admin-product-list">

                          <input type="checkbox"
                            checked={per && per.includes(1)}
                            onChange={() => {
                              const selectedProducts = per.slice();
                              const index = selectedProducts.indexOf(1);
                              if (index > -1) {
                                selectedProducts.splice(index, 1);
                              } else {
                                selectedProducts.push(1);
                              }

                              setPer(selectedProducts);

                            }}
                            className="dropdown-group " name="permission" value="1"
                            onBlur={handleBlur} />
                          Befehl
                        </label>
                        <label className="admin-product-list">
                          <input type="checkbox" className="dropdown-group " checked={per && per.includes(2)} name="permission" value="2"
                            onChange={() => {
                              const selectedProducts = per.slice();
                              const index = selectedProducts.indexOf(2);
                              if (index > -1) {
                                selectedProducts.splice(index, 1);
                              } else {
                                selectedProducts.push(2);
                              }

                              setPer(selectedProducts);

                            }}
                            onBlur={handleBlur} />
                          Kunden
                        </label>
                        <label className="admin-product-list">
                          <input type="checkbox" className="dropdown-group " checked={per && per.includes(3)} name="permission" value="3"
                            onChange={() => {
                              const selectedProducts = per.slice();
                              const index = selectedProducts.indexOf(3);
                              if (index > -1) {
                                selectedProducts.splice(index, 1);
                              } else {
                                selectedProducts.push(3);
                              }

                              setPer(selectedProducts);

                            }}
                            onBlur={handleBlur} />
                          Mitarbeiter
                        </label>
                        
                        <label className="admin-product-list">
                          <input type="checkbox" className="dropdown-group " checked={per && per.includes(5)} name="permission" value="5"
                            onChange={() => {
                              const selectedProducts = per.slice();
                              const index = selectedProducts.indexOf(5);
                              if (index > -1) {
                                selectedProducts.splice(index, 1);
                              } else {
                                selectedProducts.push(5);
                              }

                              setPer(selectedProducts);

                            }}
                            onBlur={handleBlur} />
                          Events
                        </label>
                        <label className="admin-product-list">
                          <input type="checkbox" className="dropdown-group " checked={per && per.includes(4)} name="permission" value="4"
                            onChange={() => {
                              const selectedProducts = per.slice();
                              const index = selectedProducts.indexOf(4);
                              if (index > -1) {
                                selectedProducts.splice(index, 1);
                              } else {
                                selectedProducts.push(4);
                              }
  
                              setPer(selectedProducts);
  
                            }}
                            onBlur={handleBlur} />
                          Email
                        </label>

                      </div>
                    </div>
                    <div className="error"> </div>
                  </div>

                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Passwort :<small></small></label><br />
                    <input
                      type="password"
                      name="password"
                      value={values.password}
                      placeholder="Passwort..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.password && touched.password ? <small className='form-error'>{errors.password}</small> : null}
                    </div>
                  </div>
                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Passwort wiederholen :<small></small></label><br />
                    <input
                      type="password"
                      name="repeatpassword"
                      placeholder="Passwort..."
                      className="user-input"
                      value={values.repeatpassword}

                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.repeatpassword && touched.repeatpassword ? <small className='form-error'>{errors.repeatpassword}</small> : null}
                    </div>
                  </div>

                  <div className="col-md-5 allinputs">
                    <div className="">
                      <i className="bi bi-file-arrow-up registration-icon user-i"></i>
                      <label className="user-label">
                        Profil: <small></small>
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
                          {values.profile ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
                          {/* <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> */}


                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-5 allinputs">
                    <label><i className="fa-solid fa-triangle-exclamation pe-1" id='profile'></i> Kunden :<small>*</small></label><br />

                    <div className=" dropdown user-input " data-control="checkbox-dropdown">
                      <label className="dropdown-label text-dark user-input user-select">Wahlen</label>

                      <div className="dropdown-list custom-scrollbar">



                        {customer.length > 0 && customer.map((val, index) => {
                          return <label className="product-option" onBlur={handleBlur} onChange={handleChange}>

                            <input
                              type="checkbox"
                              checked={customers && customers.includes(val.id)}
                              onChange={() => {
                                const selectedProducts = customers.slice();
                                const index = selectedProducts.indexOf(val.id);
                                if (index > -1) {
                                  selectedProducts.splice(index, 1);
                                } else {
                                  selectedProducts.push(val.id);
                                }
                                setCutomers(selectedProducts)
                              }}

                              className="dropdown-group" name="products" value={val.id} key={index.toString()}
                              onBlur={handleBlur}
                            />
                            {val.company}
                          </label>
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </form>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
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

export default UpdateEmployee;
