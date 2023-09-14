import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./Vieworder.css";
import { ViewworderSchema } from "./vieworderSchema";
import jQuery from 'jquery';
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";
import { SlideshowLightbox } from "lightbox.js-react";
import ChatImgPart from "../../CommonComponents/chat-components/ChatImgPart";
import EmojiPicker from 'emoji-picker-react';


export default function Vieworder() {
  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);
  const [error,] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const textareaRef = useRef();
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


  const navigate = useNavigate();
  // get file
  const [file, setFile] = useState([])
  const GetFile = () => {

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/get/${id}`,
      headers: {
        "authorization": `Bearer ${token}`,
      },
    })
      .then((res) => {
        setFile(res.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    GetFile();
  }, [])
  const token = localStorage.getItem("token");


  // fetch product detail  by id

  const { id } = useParams();
  const [data, setData] = useState([]);
  const [adminMsg, setAdminmsg] = useState([])
  const [pdts, setpdts] = useState([])
  const [getfiles, setGetFiles] = useState([])

  const getOrder = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/get/${id}`,
      data: data,
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        responseType: "blob"
      },
    })
      .then((res) => {
        if (res.data.status == 404) {
          navigate("/user/dashboard")
        } else {
          setIsLoaded(true);
          setData(res.data.data);
          setpdts(res.data.data.selected_products)
          setGetFiles(res.data.data.files)
        }

      })
      .catch((res) => {
        toast.error(res.message, { toastId: "unique-random-text-xAu9C9-" })
      });
  }
  useEffect(() => {
    getOrder()
  }, []);


  // get msg

  const getmsg = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/get/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setAdminmsg(res.data.data);
      })
      .catch((res) => {
        toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
      });
  }
  useEffect(() => {
    getmsg();
  }, [id]);

  const [, setEditdata] = useState([]);


  const initialValues = {
    orderid: data.id,
    ordername: data.ordername,
    orderpriority: data.orderpriority,
    files: data.files,
    orderdetail: data.orderdetail,
    products: data.selected_products,
    userImg: data.userImg
  };

  const [filename, SetFilename] = useState([])
  const [fileValue, setFileValue] = useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: ViewworderSchema,
    onSubmit: (value) => {
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
        method: "PATCH",
        url: `${process.env.REACT_APP_BASE_URL}/order/update/${id}`,
        data: { ...value, products: pdts, "files[]": fileValue, name: filename },
        headers: {
          'content-type': 'multipart/form-data',
          'authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setImageUploadProgress(progress);
        },
      })
        .then((res) => {
          // Handle success
          setEditdata(res.data);
          navigate("/user/dashboard");
          setTimeout(() => {
            toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
          }, 1000);
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
  })

  const deletFile = (val) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/file_delete`,
      data: { name: val },
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success(res.data.message)
        getOrder()
      })
      .catch((err) => {
        console.log(err)
        toast.error(err.data.message)
      });


  }
  // const downloadFile = () => {

  //   if (data.orderfile) {
  //     toast.success("image download")
  //   }
  // }
  const [imgevalue, setImageValue] = useState()

  const [chatImg, setChatImg] = useState([]);
  const [chatonchange, setchatonchange] = useState([]);

  const handleRemoveImg = (file) => {
    const updatedFiles = chatImg && chatImg.filter((f) => f !== file);
    setChatImg(updatedFiles);
    let chatonchange1 = [];
    // setchatonchange([]);
    // console.log(file);
    // console.log(chatonchange);
    const fileName = file.name;
    const foundFiles = [];
    // const foundFile = '';
    // console.log(fileName);
    chatonchange.forEach((file) => {
      if (file.originalname === fileName) {
        // Perform an action for the file with a matching originalname
        // console.log("Found File:", file.fileName);
        foundFiles.push(file.fileName);
        // Add your custom logic here for the found file
      }
    });
  

    axios({
      method: 'post', 
      url: `${process.env.REACT_APP_BASE_URL}/message/filechangedelete/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
      data: { text: foundFiles }
    })
      .then((res) => {
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" });
        // console.log(res);
        // fetchChatData();
        // setEditDisabled(false);
        // console.log(chatonchange);
          // Remove the found files from chatonchange
        setchatonchange(chatonchange.filter((file) => file.originalname !== fileName));

    
        // chatonchange1 = [];
      }).catch((res) => {
        // toast.error(res.response.message)
      })
      .finally(() => {
        // setIsLoading(false); // Stop loading, whether success or error
      });
  };
  const handleImagech = (event, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      file.preview = reader.result;
      setGetFiles([...getfiles]);
    };
    reader.readAsDataURL(file);
  };
  const onchangeinput = (files) => {
    // You can perform any operations you want with the selected files here.
    // For example, you can update the state to store the selected files.
    // console.log(files);
    // setSelectedFiles(files);
    setchatonchange([]);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/filechange/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      data: {
        
        // file_detail: imgNames,
        "files": files,

      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      }
   
    }).then((res) => {
      console.log(res.data.uploadedFileNames);
      setchatonchange(res.data.uploadedFileNames);

    }).catch((err) => {
      
    }).finally(() => {


     
    })
    // You can also perform additional actions, such as uploading the files to a server.
    // Example: uploadFilesToServer(files);
  };



  const sendText = () => {
    scrollToBottom();
    // progress bar
    const formData = new FormData();
    fileValue.forEach((file, index) => {
      formData.append(`files[${index}]`, file);
    });
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const imgNames = chatImg.map((val) => val.name)


    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/send/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
      data: {
        message: message,
        file_detail: imgNames,
        "files": chatImg,
        "image": chatonchange,
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      },
    }).then((res) => {
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      getmsg()
      setMessage('')
      fileInputRef.current.value = '';
      scrollToBottom();
      setChatImg([]);
       setchatonchange([]);
    }).catch((err) => {
      toast.error(err.response.data.message)

    }).finally(() => {
      setImageUploadProgress(0); // Reset the progress bar
    })
  }

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }
  useEffect(() => {
    // Initialize a counter
    let counter = 0;

    // Scroll to the bottom of the chat box if it exists
    const scrollToBottomIfAvailable = () => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    };

    // Scroll to the bottom on component mount
    scrollToBottomIfAvailable();

    // Set up the interval
    const chatBoxInterval = setInterval(() => {
      // Check if the counter has reached 2
      if (counter < 2) {
        scrollToBottomIfAvailable();
        counter++; // Increment the counter
      } else {
        // If the counter reaches 2, clear the interval
        clearInterval(chatBoxInterval);
      }
    }, 1000); // Adjust the interval as needed

    return () => {
      // console.log('Cleanup function called');
      clearInterval(chatBoxInterval); // Cleanup the interval when the component unmounts
    };
  }, [chatBoxRef]);
  useEffect(() => {
    scrollToBottom();
  }, [adminMsg]);

  // delete final file

  const clickToDelete = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deletFinalFile(id)
        },
        {
          label: 'Nein',
          //onClick: () => alert('Click No')
        }
      ]
    });
  }


  const deletFinalFile = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/finalfile_delete/${id}`,
      headers: {
        "content-type": "multipart/form-data",
        authorization: `Bearer ${token}`,
        responseType: "blob",
      },
    })
      .then((res) => {
        toast.success(res.data.message);
        GetFile()
      })
      .catch((res) => {
        toast.error(res.data.message);
      });
  }


  const handleRemoveFile = (file) => {
    const updatedFiles = fileValue.filter((f) => f !== file);
    setFileValue(updatedFiles);
  };

  const handleImageChange = (event, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      file.preview = reader.result;
      setGetFiles([...getfiles]);
    };
    reader.readAsDataURL(file);
  };

  //! code of cloud links section
  function DeleteCloudLink(val) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deleteCLinks(val.id)
        },
        {
          label: 'Nein',
          //onClick: () => alert('Click No')
        }
      ]
    });
  }
  function deleteCLinks(id) {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/orderfile/finalfile_delete/${id}`,
      headers: {
        authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        toast.success(res.data.message);
        GetFile()
      })
      .catch((res) => {
        toast.error(res.data.message);
      });
  }

  // remove chat message
  function confirmDeleteMessage(val) {
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deleteMessage(val),
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const deleteMessage = (val) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/message/delete/${val.id}`,
      data: { ...val },
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      getmsg()
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }

  // emoji part
  const [showEmoji, setShowEmoji] = useState(false)


  const handleInsertEmoji = (emoji) => {
    const textarea = document.getElementById('messageInput1');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const updatedMessage = message.substring(0, start) + emoji + message.substring(end);

    setMessage(updatedMessage);
    // Place the cursor after the inserted text
    // textarea.selectionStart = start + emoji.length;
    // textarea.selectionEnd = start + emoji.length;
    // textarea.focus();
  };


  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" alt="loading" />
  } else {
    return (
      <>
        <div className="main-body vieworder" id="root1">

          {/* <div className="event-header d-flex div">

            <i className="bi bi-vector-pen user-i header-i fs-3"></i>

            <input type="text" value={values.ordername} className='order-input ms-3' />
          </div> */}

          <div className="order-header d-flex div ">
            <i className="bi bi-vector-pen user-i header-i fs-2"></i>
            <h3 className="me-2 overflow-auto">{values.ordername}</h3>
            <h3 className="ms-auto me-4 ">{values.orderid}</h3>
          </div>

          <div className="div pb-2">
            <form onSubmit={handleSubmit}>
              <div className="description">
                <i className="bi bi-person-lines-fill user-i user-i"></i>

                <label className="user-label">
                  Titel: <small>*</small>
                </label>
                <input
                  type="text"
                  id="ordername"
                  name="ordername"
                  value={values.ordername}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Beispiel-Auftrag, der hoch priorisiert wurde."
                  className="user-input"
                />
                <div className="error">
                  {errors.ordername && touched.ordername ? (
                    <small className="form-error">{errors.ordername}</small>
                  ) : null}
                </div>

                <div className="row">

                  <div className="col-md-12">
                    <div className="order-field">
                      <i className="bi bi-exclamation-triangle user-i"></i>

                      <label className="user-label">
                        Priorität: <small>*</small>
                      </label>
                      <select
                        className="Priority user-input form-select user-select"
                        name="orderpriority"
                        id="orderpriority"
                        value={values.orderpriority}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >

                        <option className="user-option" value="" disabled>Priorität auswählen</option>
                        <option className="user-option" onChange={handleChange} onBlur={handleBlur} value='1'>Hoch</option>
                        <option className="user-option" onChange={handleChange} onBlur={handleBlur} value='0'>Standard</option>
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

                {getfiles && getfiles.map((val) => {

                  return <div className="file-btn d-block align-content-center">

                    <button className="downloadbtn" type="button"
                    >
                      <i className="bi bi-download icon user-i"></i>

                      <a
                        download={val.orignal_name}
                        href={
                          `${process.env.REACT_APP_IMG_URL}/assets/neworder/` +
                          `${val.files}`
                        }
                        className="btn-text"
                      >
                        Download
                      </a>

                    </button>

                    <button className="ms-2 deletebtn"
                      onClick={() => deletFile(val.files)}
                      type="button">
                      <i className="bi bi-trash icon user-i"></i>
                      <span className="btn-text"> löschen </span>
                    </button>
                    <b className="ms-5 ">{val === null ? "" : `${val.orignal_name}` && `${val.orignal_name}`}</b>
                    {fileValue && <b className="ms-5">{fileValue.name}</b>}


                  </div>
                })}




                <div className="order-field">
                  <i className="bi bi-person-vcard user-i"></i>

                  <label className="user-label">
                    Briefing: <small>*</small>
                  </label>

                  <textarea
                    className="user-input user-textarea"
                    placeholder="Briefing zu dem Auftrag..."
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
                  className="login-btn"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right icon"></i>
                      <b className="btn-text">Speichern</b>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* chat */}
          <div className="div">
            <div className="description">
              <h1 className="">Chat</h1>


              {/* start */}
              <div className="main-chat custom-scrollbar" ref={chatBoxRef}>
                {adminMsg.length > 0 ?
                  adminMsg.map((val, index) => {

                    return <div className={val.role === 0 ? ' row chat-box user' : ' row chat-box admin'} key={index}>

                      {val.role === 0 ?
                        <React.Fragment>
                          <div className=" col-md-1 view-order-img">
                            {/* <img className="msg-profile" src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${val.userImg}`} alt="profile" /> */}
                            {val.userImg ? <img className="msg-profile" src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/` + `${val.userImg}`} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
                          </div>
                          <div className="chat-msg col-7 col-sm-7 col-md-7 col-lg-7">
                            <div className="chat-box-one u1 pt-0">

                              <p className="chat-date d-flex justify-content-between">
                                <div> <span style={{ color: '#ffd279' }}> {val.name}</span>  <span className="ps-2">{moment(val.createdAt).format("DD.MM.YYYY")}</span> </div>
                                <i className="bi bi-trash icon user-i fs-6" onClick={() => confirmDeleteMessage(val)} style={{ cursor: "pointer" }}></i>
                              </p>
                              <p style={{ whiteSpace: "break-spaces" }}>

                                {(val.message && val.files == null) && (val.message && val.message != null && val.message.toString()) ||

                                  (val.files && val.message == null) && <ChatImgPart val={val} /> ||

                                  (val.message && val.files) && ((val.message && val.message != null &&

                                    <span>
                                      <ChatImgPart val={val} />
                                      {val.message.toString()}
                                    </span>

                                  ))
                                }</p>
                              <p className="chat_time"><span className="ps-2">{moment(val.createdAt).format("HH:mm")}</span></p>
                            </div>
                          </div>
                        </React.Fragment>
                        :
                        <React.Fragment>
                          <div className="chat-msg col-7 col-sm-7 col-md-7 col-lg-7">
                            <div className="chat-box-two u2 pt-0">
                              <p className="chat-date d-flex justify-content-between">
                                <div>{val.role === 2 ? (
                                    <span style={{ color: '#53bdeb' }}>{val.name}</span>
                                  ) : (
                                    <span style={{ color: '#C0DE60' }}>{val.name}</span>
                                  )}<span className="ps-2">{moment(val.createdAt).format("DD.MM.YYYY")}</span> </div>
                                {/* <i className="bi bi-trash icon user-i fs-6" onClick={() => confirmDeleteMessage(val)} style={{ cursor: "pointer" }}></i> */}
                              </p>
                              <p style={{ whiteSpace: "break-spaces" }}>

                                {(val.message && val.files == null) && (val.message && val.message != null && val.message.toString()) ||

                                  (val.files && val.message == null) && <ChatImgPart val={val} /> ||

                                  (val.message && val.files) && ((val.message && val.message != null &&

                                    <span>
                                      <ChatImgPart val={val} />
                                      {val.message.toString()}
                                    </span>

                                  ))
                                }
                              </p>
                              <p className="chat_time"><span className="ps-2">{moment(val.createdAt).format("HH:mm")}</span></p>
                            </div>
                          </div>
                          <div className="col-md-1 view-order-img">
                            {/* <img className="msg-profile" src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${val.userImg}`} alt="profile" /> */}
                            {val.userImg ? <img className="msg-profile" src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/` + `${val.userImg}`} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>}
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  })
                  : null}
              </div>

              <div className="img-previews pt-3">
                {chatImg.map((file, index) => (
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
                    <div className="cancle_icon" onClick={() => handleRemoveImg(file)}>
                      <i class="bi bi-x-circle-fill red_icon"></i>
                    </div>
                  </div>
                ))}

              </div>

              {
                chatImg.length > 0 ? <div className="ps-2" style={{ width: `${100 * chatImg.length}px` }}> <progress value={imageUploadProgress} max="100" />
                  <span className="ps-2">{`${imageUploadProgress}%`}</span></div> : ""
              }


              <div className="row pt-2 pb-2 position-relative">

                <div className="col-lg-1  emoji_file">
                  <div className="order-field1 d-flex">


                    {/* emoji */}
                    {
                      showEmoji &&
                    <button className="col-lg-1 me-2" style={{ all: "unset", cursor: "pointer" }} onClick={() => setShowEmoji(oldVal => !oldVal)}>
                      <i className="bi bi-x-lg fs-5"></i>
                    </button>
                        }
                    <button className="col-lg-1" style={{ all: "unset", cursor: "pointer" }} onClick={() => setShowEmoji(oldVal => !oldVal)}>
                      <i className="bi bi-emoji-smile fs-5"></i>
                    </button>
                    {
                      showEmoji && <div class="emoji-wrapper">
                        <EmojiPicker onEmojiClick={(emojiData, event) => {
                          handleInsertEmoji(emojiData.emoji)
                          // setMessage((oldVal) => oldVal + emojiData.emoji)
                        }}
                          theme="dark"
                          emojiStyle="google"
                        />
                      </div>
                    }
                    <div className="file-area fileupload">
                      <input
                        type="file"
                        id="orderfile"
                        name="files"
                        className="user-input"
                        style={{ background: 'transparent', cursor: 'pointer' }}
                        ref={fileInputRef}
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          onchangeinput(files);
                          files.forEach((file) => {
                            handleImagech(event, file);
                          });
                          setChatImg(files);
                        }}
                        multiple
                      />

                      <div className="user-input profile-input" style={{ background: 'transparent', cursor: 'pointer' }}>
                        <div className="success">
                          <i className="bi bi-paperclip h4" style={{ verticalAlign: '-webkit-baseline-middle', cursor: 'pointer' }}></i>
                        </div>
                      </div>
                    </div>
                    <div className="error"></div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <textarea
                    type="text"
                    placeholder="Deine Nachricht an den Designer..."
                    className="form-control user-input"
                    value={message}
                    name="message"
                    onChange={(e) => setMessage(e.target.value)}
                    id="messageInput1"
                    required
                    ref={textareaRef}
                    style={{minHeight:'42px'}}
                  ></textarea>
                </div>
                {/* send message */}
                <div className="col-lg-2">
                  <button type="button" className="chat-btn  d-flex align-items-center justify-content-center px-2" onClick={sendText} style={{ width: '100%' }}>

                    <i class="bi bi-send-fill"></i>
                    <b className="btn-text">Senden</b>
                  </button>
                </div>
              </div>



            </div>
          </div>

          {/* cloud files */}
          <div className="div">
            <div className="description">
              <div className="row">
                <div className="col-12">
                  <h3 className="">Link zu den finalen Dateien</h3>

                  {/* show cloud links */}
                  {file && file.map((val) => {
                    return val.isLink &&
                      (<div className="file-btn link1">
                        <button className="downloadbtn cloud-link-download-btn" type="button">
                          <i className="bi bi-download icon user-i"></i>
                          <a
                            target="_blank"
                            href={val.link}
                            className="btn-text"
                          >
                            {val.link}
                          </a>
                        </button>

                        {/* <button className="ms-2 deletebtn" id={id}
                          onClick={() => DeleteCloudLink(val)}
                          type="button">
                          <i className="bi bi-trash icon user-i"></i>
                          <span className="btn-text"> löschen </span>
                        </button> */}

                        {/* <b className="ms-5 text-cente">{val === null ? "" : `${val}` && `${val.link_name}`}</b> */}
                      </div>)
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* local files */}
          <div className="div">
            <div className="description">
              <div className="row">
                <div class="col-12">

                  <h3 className="">Dateien zum Download</h3>
                  {
                    file && file.map((val) => {
                      return !val.isLink && <div className="file-btn align-content-center">
                        <button className="downloadbtn" type="button">
                          <i className="bi bi-download icon user-i"></i>
                          <a
                            download={val.orignal_name}
                            href={
                              `${process.env.REACT_APP_IMG_URL}/assets/neworder/` +
                              `${val.file}`
                            }
                            className="btn-text"
                          >
                            Download
                          </a>
                        </button>

                        {/* <button
                          className=" deletebtn"

                          onClick={() => clickToDelete(val.id)}
                          type="button"

                        >
                          <i className="bi bi-trash icon user-i"></i>
                          <a className="btn-text"> löschen </a>
                        </button> */}
                        <div className="justify-content-center  d-flex" style={{margin:'auto 0px'}}>
                        <b className="ms-5">{val.file === null ? "" : `${val.orignal_name}` && `${val.orignal_name}`}</b>
                        {fileValue && <b className="ms-5">{fileValue.name}</b>}
                        </div>
                       
                      </div>
                    })
                  }
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
    );
  }
}
