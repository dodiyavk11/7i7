import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "./neworder.css"
import { useFormik } from "formik";
import jQuery from 'jquery';
import NeworderRegistrationSchema from "./OrderRegistrationSchima";
import { toast, ToastContainer } from "react-toastify";


export default function NewOrder() {


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
  const nevigate = useNavigate();
  const token = localStorage.getItem('token')
  const [customerdata, setCustomerdata] = useState([])
  const [employeedata, setemployeeData] = useState([])
  const [product, setProduct] = useState([])

  useEffect(() => {
    // customer api
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/user/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setCustomerdata(res.data.data)
      }).catch((err) => {
        console.log(('errr'))
      })

    // employee api
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

  const [orderdata, setorderData] = useState([])
  const initialValues = {
    ordername: "",
    products: [],
    orderpriority: "",
    files: [],
    orderdetail: "",
    employee: [],

  };


  const [isLoading, setIsLoading] = useState(false);
  const getRole = localStorage.getItem("role")
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  const [filename, SetFilename] = useState([])

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: NeworderRegistrationSchema,
    onSubmit: (data) => {
      setIsLoading(true); // Start loading

      // progress bar
      const formData = new FormData();
      fileValue.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/order/add`,
        data: { ...data, "files[]": fileValue, employee: emp, uId: ids, name: filename },
        headers: {
          "content-type": "multipart/form-data",
          'authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImageUploadProgress(progress);
        },
      })
        .then((res) => {
          setTimeout(() => {
            toast.success(res.data.message);
          }, 1000);
          if (getRole == 1) {
            nevigate("/admin/order");
          } else {
            nevigate("/employee/order");
          }
          setorderData(res.data.data);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
          setImageUploadProgress(0); // Reset the progress bar
        });
    }
  })

  function refreshPage() {
    window.location.reload(true);
  }

  // file add
  const [fileValue, setFileValue] = useState([]);
  const [getFiles, setGetFiles] = useState([]);

  const handleRemoveFile = (file) => {
    const updatedFiles = fileValue.filter((f) => f !== file);
    setFileValue(updatedFiles);
  };

  const handleImageChange = (event, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      file.preview = reader.result;
      setGetFiles([...getFiles]);
    };
    reader.readAsDataURL(file);
  };

  // selected employee
  const [emp, setEmp] = useState([])
  const [ids, setID] = useState([])
  const SelectedCompany = (id) => {
    setID(id)
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/employee/get`,
      data: { id: id },
      headers: {
        'authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setEmp(res.data.data)
    })
      .catch((res) => {
        toast.error(res.data.message)
      })
  }

  return (
    <>
      <div className="main-body" id="root1">

        <div className="order-header d-flex div">
          {/* <i className="fa-solid fa-binoculars fs-2 mt-1 "> </i> */}
          <i className="bi bi-vector-pen user-i header-i fs-2"></i>
          <h3 className="me-2 overflow-auto">{values.ordername}</h3>
          {/* <input type="text" name="" id="" value={values.ordername} className='order-input ms-3' /> */}
        </div>

        <form action="" onSubmit={handleSubmit}>
          <div className="navigation-links row">
            <div className="overview-page col-12 col-md-3 col-xxl-2">
              <i className="bi bi-chevron-left pe-2"></i>

              {/* <button className="nav-link-first" onClick={() => refreshPage()} style={{ background: 'none' }}>
              zürŸck zür †bersicht
              </button> */}
              {getRole == 1 ? <Link to="/admin/order" className="nav-link-first">zurück zur Übersicht</Link> : <Link to="/employee/order" className="nav-link-first">zurück zur Übersicht</Link>}
            </div>
            <div className="btn-customer col-12 col-md-4 col-xxl-2">

              <select
                type="text"
                name="uId"
                value={values.customer}
                placeholder="Kunde auswählen"
                className="user-input"
                // onChange={handleChange}
                onChange={(e) => SelectedCompany(e.target.value)}
                onBlur={handleBlur}
              >

                <i className="bi bi-list-ul"></i>
                <option value="" className="admin-select-customer">Kunde auswählen</option>
                {customerdata.map((e) => {
                  return <option value={e.id} key={e.id} className="admin-select-customer border border-1 border-danger">{e.company}</option>
                })}
              </select>
              {/* <div className="error">
  {errors.uId && touched.uId ? (
    <small className='form-error'>{errors.uId}</small>
  ) : null}
</div> */}
            </div>
            <div className="btn-employee  col-12 col-md-4 col-xxl-2">


              <div className="dropdown " data-control="checkbox-dropdown">
                <label className="dropdown-label text-dark  admin-user-select">Mitarbeiter zuordnen</label>

                <div className="dropdown-list admin-select-employee-dropdown-list">
                  {employeedata.map((e, index) => {
                    return <label className="select-employee-label ">
                      <input
                        type="checkbox"
                        checked={emp && emp.includes(e.id)}
                        onChange={() => {

                          const selectedProducts = emp.slice();
                          const index = selectedProducts.indexOf(e.id);
                          if (index > -1) {
                            selectedProducts.splice(index, 1);
                          } else {
                            selectedProducts.push(e.id);
                          }
                          setEmp(selectedProducts)
                        }}

                        className="dropdown-group" name="products" value={e.id} key={index.toString()}
                        onBlur={handleBlur}
                      />
                      {/* <input type="checkbox" className="dropdown-group  " name="employee" value={e.id} onChange={handleChange}
                        onBlur={handleBlur} /> */}
                      {e.fname + " " + e.lname}
                    </label>
                  })

                  }
                </div>
              </div>
              {/* <div className="error">
  {errors.employee && touched.employee ? (
    <small className='form-error'>{errors.employee}</small>
  ) : null}
</div> */}
            </div>


            <select
              type="text"
              name="orderstatus"
              value={values.orderstatus}
              className="nav-select col-12 col-md-2"
              onChange={handleChange}
              onBlur={handleBlur}
            >
              <option value="">Status ändern</option>
              <option value='1'>Neuer Auftrag</option>
              <option value='2'>Wird bearbeitet</option>
              <option value='3'>Abgeschlossen</option>
            </select>
            <div className="error">
              {/* {errors.status && touched.status ? (
    <small className='form-error'>{errors.status}</small>
  ) : null} */}
            </div>

          </div>

          <div className="div">

            <div className="description">
              <i className="bi bi-person-lines-fill user-i user-i"></i>

              <label className="user-label">
                Titel: <small>*</small>
              </label>
              <input
                type="text"
                name="ordername"
                value={values.ordername}
                placeholder="Schreiben Sie Ihre Bestellung"
                className="w-100 neworder-input"
                onChange={handleChange}
                onBlur={handleBlur}

              />
              <div className="error">
                {errors.ordername && touched.ordername ? <small className='form-error'>{errors.ordername}</small> : null}
              </div>

              <div className="row">
                <div className="col-md-12">
                  <div className="order-field">
                    <i className="bi bi-exclamation-triangle user-i"></i>

                    <label className="user-label">
                      Priorität: <small>*</small>
                    </label>

                    <select className="Priority user-input form-select user-select" name="orderpriority" value={values.orderpriority} onChange={handleChange}
                      onBlur={handleBlur}>
                      <option value="" className="admin-select">Priorität auswählen</option>
                      <option value='1' className="admin-select">Hoch</option>
                      <option value='0' className="admin-select">Standard</option>

                    </select>

                    <div className="error">
                      {errors.orderpriority && touched.orderpriority ? (
                        <small className="form-error">
                          {errors.orderpriority}
                        </small>
                      ) : null}</div>
                  </div>
                </div>
              </div>


              <div className="order-field">
                <i className="bi bi-file-earmark-arrow-up user-i"></i>
                <label className="user-label">
                  Dateien: <small>*</small>
                </label>
                <div className="file-area file-area-border">
                  <input
                    type="file"
                    id="files"
                    name="files[]"
                    multiple="multiple"
                    className="user-input"
                    onChange={(event) => {
                      const files = Array.from(event.target.files);
                      files.forEach((file) => {
                        handleImageChange(event, file);
                      });
                      setFileValue(files);
                      const fileNames = Array.from(event.target.files).map(file => { return file.name });
                      SetFilename(fileNames); // Set the original file names separated by commas
                    }}
                  />
                  <div className="user-input profile-input">
                    <div className="success">
                      <i className="bi bi-image"></i>   Dateien hochladen
                    </div>
                  </div>
                </div>
                <div className="error"></div>
              </div>
              <div className="img-previews">
                {fileValue.map((file, index) => (
                  <div className="file-item" key={index}>
                    {file.type.startsWith('image/') ?
                      <img src={file.preview} alt="Preview" style={{ height: "100px", width: "100px" }} title={file.name} />
                      :
                      <>
                        <div className="d-flex flex-column" >
                          <i class="bi bi-file-earmark-pdf-fill" title={file.name} ></i>

                        </div>
                      </>
                    }
                    <div className="cancle_icon" onClick={() => handleRemoveFile(file)}>
                      <i class="bi bi-x-circle-fill red_icon"></i>
                    </div>
                  </div>
                ))}

              </div>
              {
                fileValue.length > 0 ? <div className="ps-2"> <progress value={imageUploadProgress} max="100" />
                  <span className="ps-2">{`${imageUploadProgress}%`}</span></div> : ""
              }

              <div className="order-field order-field1">
                <i className="bi bi-person-vcard user-i"></i>

                <label className="user-label">
                  Briefing: <small>*</small>
                </label>

                <textarea
                  className="user-input user-textarea"
                  placeholder="Briefing zü dem Auftrag..."
                  name="orderdetail"
                  id="orderdetail"
                  value={values.orderdetail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                ></textarea>
                <div className="error">
                  {errors.orderdetail && touched.orderdetail ? (
                    <small className="form-error">{errors.orderdetail}</small>
                  ) : null}</div>
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="login-btn send-btn w-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span><i className="bi bi-hourglass-split icon"></i>Wird bearbeitet...</span> // Replace with your loader icon
                ) : (
                  <span><i class="bi bi-save2-fill ps-2 pe-2 icon"></i>
                    <b>Speichern</b>
                  </span>
                )}
              </button>


            </div>
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
        theme="dark"
      />
    </>
  )
}