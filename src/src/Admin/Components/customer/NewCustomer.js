import React, { useEffect, useState } from 'react';
import "./newcustomer.css"
import "../order/neworder.css"
import NewCustomerRegistrationSchma from './NewCustomerRegistrationSchma';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import jQuery from 'jquery';
import { useNavigate } from 'react-router-dom';
import Preview from '../../../Main/Registration/priview';

const NewCustomer = () => {

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
        this.$inputs.prop(    'checked', true);
      }
      else {
        this.areAllChecked = false;
        this.$checkAll.html('Alle überprüfen');
        this.$inputs.prop(    'checked', false);
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
  const nevigate = useNavigate()
  const initialValues = {

    email: "",
    fname: "",
    lname: "",
    password: "",
    company: "",
    street: "",
    postal: "",
    country: "",
    file: null,
    repeatpassword: "",
    ust: "",
    number: "",
    city: "",
    payment: "",
    postalNum: "",
    ustId: "",
  };

  const token = localStorage.getItem('token')

  // employee api
  const [employeedata, setemployeeData] = useState([])
  useEffect(() => {
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/employee/get/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setemployeeData(res.data.data)
      }).catch((err) => {
        console.log(err)
      })
  }, [])


  const [cdata, setcData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getRole = localStorage.getItem("role")
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: NewCustomerRegistrationSchma,
    onSubmit: (data) => {
      setIsLoading(true); // Start loading
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/signup`,
        data: {...data,isAdmin:true},
        headers: {
          'authorization': `Bearer ${token}`,
          'content-type': 'multipart/form-data'
        }
      })
        .then(function (res) {
          setcData(res);
          setTimeout(() => {
            toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
          }, 1000);
          
          if(getRole == 1){
            nevigate("/admin/customer")
          }else{
            nevigate("/employee/customer");
          }
        })
        .catch(function (res) {
          toast.error(res.response.data.message)
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });
    },

  })
  return (
    <>
      <div className="main-body newcustomer-main" id="root1">
        <form action="post" onSubmit={handleSubmit}>

          <div className='newcustomer-header div '>

          {values.file && <Preview file={values.file} />}
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

              <div className="error ps-2">
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
              <div className="error ps-2">
                {errors.lname && touched.lname ? <small className='form-error'>{errors.lname}</small> : null}</div>
            </div>
            {/* <button className='order-btn' type='submit'><i className="fa-solid fa-print pe-1"></i>Safe</button> */}
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
                  
                  Speichern
                  </span>
                )}
              </button>
          </div>
          <div className='newcustomer-body div'>
            <div className="row div1 d-flex justify-content-evenly pt-3 pb-3">
              {/* <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Membership Status : <small></small></label><br />
                <input type="text" placeholder='Active Enterprise Member' className='user-input' />
                <div className="error"></div>
              </div>
              <div className="col-md-5 allinputs" >
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> End of the subscription: </label> <br />
                <input type="text" placeholder='dd.mm.yyyy' className='user-input' />
                <div className="error"></div>
              </div> */}

              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> E-Mail :<small>*</small></label><br />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder="E-Mail..."
                  className="user-input "
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error">
                  {errors.email && touched.email ? <small className='form-error'>{errors.email}</small> : null}</div>
              </div>
              <div className="col-md-5 allinputs ">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Mitarbeiter: <small>*</small> </label><br />

                <div className=" dropdown " data-control="checkbox-dropdown">
                  <label className="dropdown-label text-dark">Wahlen</label>

                  <div className="dropdown-list custom-scrollbar">
                    {employeedata.length > 0 && employeedata.map((e) => {

                      return <label className=" admin-product-list">

                        <input type="checkbox" className="dropdown-group " name="employee" value={e.id} onChange={handleChange}
                          onBlur={handleBlur} />
                        {e.fname == "" ? "no Fname" : e.fname}{e.lname == "" ? "no Lname" : e.lname}
                      </label>
                    })}</div></div>

              </div>

              <div className="col-md-5 allinputs" >
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Passwort :<small>*</small></label><br />

                <input
                  type="password"
                  name="password"
                  value={values.password}
                  placeholder="Passwort..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error"> {errors
                  .password && touched.password ? <small className='form-error'>{errors.password}</small> : null}</div>
              </div>
              <div className="col-md-5 allinputs" >
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Paasswort wiederholen:<small>*</small></label><br />

                <input
                  type="password"
                  name="repeatpassword"
                  placeholder="Passwort..."
                  className="user-input"
                  value={values.repeatpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error"> {errors.repeatpassword &&
                  touched.repeatpassword ? <small className='form-error'>{errors.repeatpassword}</small> : null}</div>
              </div>

              <div className="col-md-5 allinputs">
                <div className="">
                  <i className="bi bi-file-earmark-arrow-up user-i"></i>
                  <label className="user-label">Profilbild : <small></small>
                  </label>

                 
                  <div className="row">
                      <div className="col-8 col-md-10">
                        <div className="file-area">
                          <input
                            type="file"
                            // ref={fileRef}
                            name="file"
                            multiple="multiple"

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
                          <div className="error">   {errors.file && touched.file ? (
                            <small className="form-error">{errors.file}</small>
                          ) : null} </div>
                        </div>
                      </div>


                      <div className="col-1 col-md-2 profile-img">

                        {values.file && <Preview file={values.file} />}
                      </div>
                    </div>
                </div>

              </div>

              <div className="col-md-5 allinputs ">
              </div>
            </div>
          </div>
          <div className='newcustomer-body div'>
            <div className="row div1 d-flex justify-content-evenly pt-3 pb-3">
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Unternehmen : <small>*</small></label><br />

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
                ) : null}</div>
              </div>
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i>USt-IdNr. :<small></small> </label> <br />

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
                ) : null} */}
                </div>
              </div>
              <div className="col-md-5 allinputs ">

                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Straße :<small>*</small></label><br />

                <input
                  type="text"
                  name="street"
                  value={values.street}
                  placeholder="Straße..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error">  {errors.street && touched.street ? (
                  <small className="form-error">{errors.street}</small>
                ) : null}</div>
              </div>
              <div className="col-md-5 allinputs  ">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Nummer: <small>*</small> </label><br />

                <input
                  type="text"
                  name="number"
                  placeholder="Nummer..."
                  className="user-input"
                  value={values.number}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error">   {errors.number && touched.number ? (
                  <small className="form-error">{errors.number}</small>
                ) : null}</div>
              </div>
              <div className="col-md-5 allinputs ">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Postleitzahl :<small>*</small></label><br />
                <input
                  type="text"
                  name="postalNum"
                  value={values.postalNum}
                  placeholder="Postleitzahl..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error"> {errors.postalNum && touched.postalNum ? (
                  <small className="form-error">{errors.postalNum}</small>
                ) : null}</div>
              </div>
              <div className="col-md-5 allinputs ">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Stadt :<small>*</small></label><br />
                <input
                  type="text"
                  name="city"
                  placeholder="Stadt..."
                  className="user-input"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error">    {errors.city && touched.city ? (
                  <small className="form-error">{errors.city}</small>
                ) : null}</div>
              </div>
              <div className="col-md-5 allinputs ">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Land :<small>*</small></label><br />
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
                ) : null}</div>
              </div>
              <div className="col-md-5 allinputs ">
              {/* <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Code:<small>*</small></label><br />
                <input
                  type="text"
                  name="code"
                  value={values.code}
                  placeholder="Code..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error">   {errors.code && touched.code ? (
                  <small className="form-error">{errors.code}</small>
                ) : null}</div> */}
              </div>
            </div>

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

export default NewCustomer;
