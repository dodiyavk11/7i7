import React, { useEffect, useState } from 'react';
import "./newcustomer.css"
import "../order/neworder.css"
import NewCustomerRegistrationSchma from './NewCustomerRegistrationSchma';
import { useFormik } from 'formik';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import jQuery from 'jquery';
import { useNavigate, useParams } from 'react-router-dom';
import Updateregistershcema from './Updateregisterschema';
import styled from 'styled-components';

const StyledCell = styled.div`

&.Active{
  background: rgb(13, 95, 13);
  border-radius : 5px;
  padding: 10px 20px;
  text-align:center;
   font-weight:500;
}
&.Quit {
  background: red;
  border-radius : 5px;
  padding: 10px 20px;
  text-align:center;
   font-weight:500;
}
&.Paused{
  background:  orange;
  border-radius : 5px;
  padding: 10px 20px;
  text-align:center;
   font-weight:500;
}
`;

const Updatecustomer = () => {

  // function membership(active_membership_status) {
  //   if (active_membership_status === 1) {
  //     return 'Active'
  //   }
  //   else if (active_membership_status === 0) {
  //     return 'Quit'
  //   }

  // }

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
  const [updatecustomer, setUpdateCustomer] = useState([])
  const [emp, setEmp] = useState([])
  const initialValues = {

    email: updatecustomer.email,
    // employee:updatecustomer.employee,
    fname: updatecustomer.fname,
    lname: updatecustomer.lname,
    company: updatecustomer.company,
    street: updatecustomer.street,
    country: updatecustomer.country,
    profile: updatecustomer.userImg,
    number: updatecustomer.number,
    city: updatecustomer.city,
    postalNum: updatecustomer.postalNum,
    ustId: updatecustomer.ustId,
    // end_date: updatecustomer.cancel_date == null ? updatecustomer.end_date + "end date" : updatecustomer.cancel_date + "cancle date",
    active_membership_status: updatecustomer.active_membership_status,
    password: "",

  };

  const token = localStorage.getItem('token')

  //   update customer

  const { id } = useParams();

  useEffect(() => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/account/user/profile/${id}`,
      data: updatecustomer,
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        responseType: "blob"
      },

    })
      .then((res) => {
        setUpdateCustomer(res.data.data);
        setEmp(res.data.data.employee)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      })
      .catch((res) => {
        toast.error(res.message)
      });
  }, [id]);

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
    enableReinitialize: true,
    validationSchema: Updateregistershcema,
    onSubmit: (data) => {
      setIsLoading(true); // Start loading
      axios({
        method: "PATCH",
        url: `${process.env.REACT_APP_BASE_URL}/account/user/profile/update/${id}`,
        data: { ...data, employee: emp },
        headers: {
          'content-type': 'multipart/form-data',
          'authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          setcData(res.data.data)
          setTimeout(() => {
            toast.success(res.data.message)
          }, 1000);
          if(getRole == 1){
            nevigate("/admin/customer")
          }else{
            nevigate("/employee/customer");
          }

        })
        .catch((res) => {
          toast.error(res.response.data.message);
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

          <div className='newcustomer-header d-flex div'>
            {values.profile ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
            {/* <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{height: "50px", width: "50px", borderRadius: "50%"}} /> */}
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
              {errors.fname && touched.fname ? <small className='form-error'>{errors.fname}</small> : null}
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
              {errors.lname && touched.lname ? <small className='form-error'>{errors.lname}</small> : null}
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
                <i class="bi bi-save2-fill pe-1"></i>

                  speichern
                </span>
              )}
            </button>
            {/* <button className='order-btn' type='submit'><i className="fa-solid fa-print pe-1"></i>Safe</button> */}
          </div>
          <div className='newcustomer-body div'>
            <div className="row d-flex justify-content-evenly div1 pt-3 pb-4">
            <div className="col-md-5 allinputs">
            <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Mitgliedschafts : <small>*</small></label>
                    <br />

                    <select
                      type="text"
                      name="active_membership_status"
                      placeholder="Geben Sie den Status ein"
                      className="user-input"
                      value={values.active_membership_status}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >

                      <option className="user-option" value="">Status auswählen</option>
                      <option className="user-option" value="true">Aktiv</option>
                      <option className="user-option" value="false">Gekündigt</option>
                    </select>
                  </div>
              {/* <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Membership Status : <small>*</small></label><br />
                <StyledCell className={membership(updatecustomer.active_membership_status)}>
                  {membership(updatecustomer.active_membership_status)}
                </StyledCell>
                <div className='error'></div>
              </div> */}
              {/* <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> End of the subscription: </label> <br />
                <input
                  type="text"
                  name="end_date"
                  value={values.end_date}
                  placeholder="dd.m.JJJJ"
                  className=" "
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'></div>
              </div> */}

              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> E-Mail :<small>*</small></label><br />
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  placeholder=" E-Mail..."
                  className="user-input "
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.email && touched.email ? <small className='form-error'>{errors.email}</small> : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Mitarbeiter: <small>*</small> </label><br />

                <div className=" dropdown user-input " data-control="checkbox-dropdown">
                  <label className="dropdown-label text-dark user-input user-select">Wahlen</label>

                  <div className="dropdown-list custom-scrollbar">

                    {employeedata.length > 0 && employeedata.map((val, index) => {
                      return <label className="product-option" onBlur={handleBlur} onChange={handleChange}>

                        <input
                          type="checkbox"
                          checked={emp && emp.includes(val.id)}
                          onChange={() => {
                            const selectedProducts = emp.slice();
                            const index = selectedProducts.indexOf(val.id);
                            if (index > -1) {
                              selectedProducts.splice(index, 1);
                            } else {
                              selectedProducts.push(val.id);
                            }
                            setEmp(selectedProducts)
                          }}

                          className="dropdown-group" name="products" value={val.id} key={index.toString()}
                          onBlur={handleBlur}
                        />
                        {val.fname + " " + val.lname}
                      </label>
                    })}
                  </div></div>
              </div>

              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Passwort :<small></small></label><br />

                <input
                  type="password"
                  name="password"
                  value={values.password}
                  placeholder="Passwort..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.password && touched.password ? <small className='form-error'>{errors.password}</small> : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-2"></i> Passwort wiederholen:<small></small></label><br />

                <input
                  type="password"
                  name="repeatpassword"
                  placeholder="Passwort..."
                  className="user-input"
                  value={values.repeatpassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.repeatpassword && touched.repeatpassword ? <small className='form-error'>{errors.repeatpassword}</small> : null}
                </div>
              </div>

              <div className="col-md-5 allinputs">
                <div className="">
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
                          placeholder="E-Mail..."
                          className="user-input"
                          onChange={(event) => {
                            setFieldValue("file", event.target.files[0]);
                          }}

                        />
                        <div className="user-input profile-input">
                          <div className="success">
                            <i className="bi bi-image"></i>  Profilbild hochladen
                          </div>
                        </div>
                        <div className="error"> {errors.file && touched.file ? (
                          <small className="form-error">{errors.file}</small>
                        ) : null}</div>
                      </div>
                    </div>


                    <div className="col-1 col-md-2 profile-img">
                      {values.profile ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
                      {/* <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${values.profile}`} style={{height: "50px", width: "50px", borderRadius: "50%"}} /> */}
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
          <div className='newcustomer-body div'>
            <div className="row d-flex justify-content-evenly div1 pt-4 pb-4">
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Unternehmen : <small>*</small></label><br />

                <input
                  type="text"
                  name="company"
                  value={values.company}
                  placeholder="Schreiben Sie Ihr Unternehmen."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.company && touched.company ? (
                    <small className="form-error">{errors.company}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i>USt-IdNr.:<small></small> </label> <br />

                <input
                  type="text"
                  name="ustId"
                  placeholder="USt-IdNr..."
                  className="user-input"
                  value={values.ustId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.ustId && touched.ustId ? (
                    <small className="form-error">{errors.ustId}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">

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
                <div className='error'>
                  {errors.street && touched.street ? (
                    <small className="form-error">{errors.street}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs ">
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
                <div className='error'>
                  {errors.number && touched.number ? (
                    <small className="form-error">{errors.number}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Postleitzahl:<small>*</small></label><br />
                <input
                  type="text"
                  name="postalNum"
                  value={values.postalNum}
                  placeholder="Postleitzahl..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.postalNum && touched.postalNum ? (
                    <small className="form-error">{errors.postalNum}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">
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
                <div className='error'>
                  {errors.city && touched.city ? (
                    <small className="form-error">{errors.city}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs">
                <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Land :<small>*</small></label><br />
                <input
                  type="text"
                  name="country"
                  value={values.country}
                  placeholder=" Land..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className='error'>
                  {errors.country && touched.country ? (
                    <small className="form-error">{errors.country}</small>
                  ) : null}
                </div>
              </div>
              <div className="col-md-5 allinputs ">
              {/* <label><i className="fa-solid fa-triangle-exclamation pe-1"></i> Code:<small>*</small></label><br />
                <input
                  type="text"
                  name="code"
                  value={7777777}
                  placeholder="Code..."
                  className="user-input"
                  onChange={handleChange}
                  onBlur={handleBlur}
                /> */}
                {/* <div className="error">   {errors.code && touched.code ? (
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

export default Updatecustomer;
