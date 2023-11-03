
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Neworder.css";
import { useFormik } from "formik";
import { NeworderSchema } from "./NeworderSchema";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";





import jQuery from 'jquery';

export default function Neworder() {

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

  const [array, setArray] = useState([])

  // const [option, setOption] = useState([])
  // const [option, ] = useState([])


  const token = localStorage.getItem('token')

  const navigate = useNavigate();
  // const email = localStorage.getItem('email')
  // // nosubscribe product send to product page
  // const NoSubsproduct = () => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/subscribe/products`,
  //     data: { email: email },
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     },
  //   }).then((res) => {
  //     if (res.data.expire == true) {
  //       toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
  //       navigate("/products")
  //     }

  //   }).catch((res) => {
  //     toast.error(res.response.data.message)
  //   })
  // }
  // useEffect(() => {
  //   NoSubsproduct()
  // }, [])

  // const getproductname = []
  useEffect(() => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/product/all`,
      // data: option,
      headers: {
        'content-type': 'multipart/form-data',
        'authorization': `Bearer ${token}`
      }
    }).then(async (res) => {
      setArray(res.data.data)
    }).catch((err) => {
      toast(err)
    })

  }, [token])

  const [, setEditdata] = useState([]);

  // const [editdata, setEditdata] = useState([]);
  const initialValues = {
    ordername: "",
    products: [],
    orderpriority: "",
    files: [],
    orderdetail: "",
  };
  const [orderfilechange, setorderFilechange] = useState([]);
 
  const [isLoading, setIsLoading] = useState(false);

  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [filename, SetFilename] = useState([])
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

    enableReinitialize: true,

    validationSchema: NeworderSchema,
    onSubmit: (value) => {
      setIsLoading(true); // Start loading

      const formData = new FormData();
      fileValue.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
      });
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      const filenames = [];
      // console.log(orderfilechange);
      // Iterate through the orderfilechange array using forEach

      orderfilechange.forEach((file) => {
        // Assuming each item in orderfilechange is an object with a 'filename' property
        if (file.filename) {
          filenames.push(file.fileName);
        }
      });

      axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/order/add`,
        data: { ...value, "files": orderfilechange, filenames: orderfilechange},
        headers: {
          'content-type': 'multipart/form-data',
          'authorization': `Bearer ${token}`,
        },
       

      })
        .then((res) => {
          // Handle success
          setEditdata(res.data.data);
          setTimeout(() => {
            toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
          }, 1000);
          navigate("/user/dashboard");
        })
        .catch((error) => {
          // Handle error
          toast.error(error.response.data.message, { toastId: "unique-random-text-xAu9C9-" });
        })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
          setImageUploadProgress(0); // Reset the progress bar
        });
    }
  });

  // file add
  const [fileValue, setFileValue] = useState([]);
  const [getFiles, setGetFiles] = useState([]);

  const handleRemoveFile = (file) => {
    const updatedFiles = fileValue.filter((f) => f !== file);
    setFileValue(updatedFiles);
    const fileName = file.name;
    const foundFiles = [];
 
    orderfilechange.forEach((file) => {
      if (file.originalname === fileName) {
       
        foundFiles.push(file.fileName);
       
      }
    });
    axios({
      method: 'post',
      url: `${process.env.REACT_APP_BASE_URL}/order/filechangedelete/`,
      headers: {
        'authorization': `Bearer ${token}`
      },
      data: { text: foundFiles }
    })
      .then((res) => {
        
        setorderFilechange(orderfilechange.filter((file) => file.originalname !== fileName));


        // chatonchange1 = [];
      }).catch((res) => {
        // toast.error(res.response.message)
      })
      .finally(() => {
        // setIsLoading(false); // Stop loading, whether success or error
      });
  };

  const handleImageChange = (event, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      file.preview = reader.result;
      setGetFiles([...getFiles]);
    };
    reader.readAsDataURL(file);
  };
  const onchangeinputorder = (files) => {
    // console.log(file);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/filechange/`,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      data: {
        "files": files,

      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      }

    }).then((res) => {
      // console.log(res.data.uploadedFileNames);
      setorderFilechange(res.data.uploadedFileNames);

    }).catch((err) => {

    }).finally(() => {



    })
    // You can also perform additional actions, such as uploading the files to a server.
    // Example: uploadFilesToServer(files);
  };

  return (
    <>
      <div className=" main-body Neworder" id="root1">

        <div className="event-header d-flex div">

          <i className="bi bi-vector-pen user-i header-i fs-2"></i>
          <h3 className="me-2 overflow-auto">{values.ordername}</h3>
          
        </div>

        <form onSubmit={handleSubmit}>
          <div className="div">
            <div className="description">
              <div className="row">
                <div className="col-12">
                  <div className="order-field">

                    <i className="bi bi-person-lines-fill user-i"></i>

                    <label className="user-label">Auftragsname: <small>*</small>
                    </label>
                    <input
                      type="text"
                      name="ordername"
                      value={values.ordername}
                      placeholder="Title..."
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.ordername && touched.ordername ? (
                        <small className="form-error">{errors.ordername}</small>
                      ) : null}</div>
                  </div></div></div>
              <div className="row border-border-info border-2">

                <div className="col-md-6">
                  <div className="order-field">
                    <i className="bi bi-exclamation-triangle user-i"></i>

                    <label className="user-label">
                      Priorität: <small>*</small>
                    </label>
                    <select className="form-select user-input user-select" name="orderpriority" value={values.orderpriority} onChange={handleChange}
                      onBlur={handleBlur}>
                      <option className="user-option" value="">Priorität auswählen</option>
                      <option className="user-option" value='1'>Hoch</option>
                      <option className="user-option" value='0'>Standard</option>

                    </select>
                    <div className="error">

                      {errors.orderpriority && touched.orderpriority ? (
                        <small className="form-error">{errors.orderpriority}</small>
                      ) : null}</div>

                  </div>
                </div>
                <div className="col-md-6">

                  <div className="order-field ">
                    <i className="bi bi-file-earmark-arrow-up user-i"></i>
                    <label className="user-label">  Dateien hochladen: <small>*</small>
                    </label>
                    <div className="file-area">
                      <input
                        type="file"

                        name="files[]"
                        multiple="multiple"
                        className="user-input"
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          setFileValue(files);
                       
                          onchangeinputorder(files);
                          files.forEach((file) => {
                            handleImageChange(event, file);
                          });
                          
                          const fileNames = Array.from(event.target.files).map(file => { return file.name });
                          SetFilename(fileNames);
                        }}

                      />
                      <div className="user-input profile-input">
                        <div className="success"><i className="bi bi-image"></i> Dateien hochladen</div>

                      </div>
                      <div className="error">
                        {errors.files && touched.files ? (
                          <small className="form-error">{errors.files}</small>
                        ) : null}</div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="img-previews">
                {fileValue.map((file, index) => (
                  <div className="file-item" key={index}>
                    {file.type.startsWith('image/') ?           
                  <img src={file.preview} alt="Preview" style={{ height: "100px", width: "100px" }} title={file.name}/>
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
                  fileValue.length >0 ? <div className="ps-2"> <progress value={imageUploadProgress} max="100" />
                        <span className="ps-2">{`${imageUploadProgress}%`}</span></div> : ""
                }


              <div className="row">

              </div>




              <div className="order-field">
                <i className="bi bi-person-vcard user-i"></i>

                <label className="user-label">Details zum Auftrag: <small>*</small>
                </label>



                <textarea className="user-input user-textarea" placeholder="Mehr Informatiomem zu dem Neuer Auftrag." name="orderdetail" value={values.orderdetail} onChange={handleChange}
                  onBlur={handleBlur}>

                </textarea>
                <div className="error">
                  {errors.orderdetail && touched.orderdetail ? (
                    <small className="form-error">{errors.orderdetail}</small>
                  ) : null}</div>

                <button
                  type="submit"
                  className="order-btn w-100"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right icon"></i>
                      <b className="btn-text">Auftrag einreichen</b>
                    </>
                  )}
                </button>

              </div>


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
  );
}

