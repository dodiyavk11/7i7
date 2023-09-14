import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import { toast, ToastContainer } from "react-toastify";
import "./event.css";
import jQuery, { data } from 'jquery';
import moment from "moment";
import { GiPartyPopper } from "react-icons/gi";
import { IconContext } from "react-icons";
import AddeventRegistrationschema from "./AddeventRegistrationschema";
import { SlideshowLightbox } from "lightbox.js-react";

const AdminEvent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [customername, setCustomerName] = useState([])
  const [customervalues, setCutomerValues] = useState([])
  const [acceptdate, setAcceptDate] = useState([])


  function getstatus(status) {
    if (status == 1) {
      return <span style={{ color: '#C0DE60', fontSize: '22px', fontWeight: 500 }}>accepted</span>
    } else if (status == 0) {
      return <span style={{ color: '#DE6060', fontSize: '22px', fontWeight: 500 }}>Not accepted</span>
    }
  }

  // pagination
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [allEvents, setallEvents] = useState([]);

  const fetchEvents = async () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/event/get/all`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setIsLoaded(true);
        setProducts(res.data.data);
        setallEvents(res.data.data);
      })
      .catch((err) => {
        setIsLoaded(true);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= products.length / 1 &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  //pagination over
  const token = localStorage.getItem("token");

  // delete event
  const [deleteevent, setDeleteEvent] = useState([])
  const click = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deletevents(id),
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const deletevents = (id) => {

    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/event/remove/${id}`,

      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      setDeleteEvent(res.data.data)
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      fetchEvents();
    }).catch((res) => {
      toast.error(res.response.data.message)
    })

  }

  // customer
  const [customerdata, setCustomerdata] = useState([]);
  useEffect(() => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/user/all`,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setCustomerdata(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // event edit
  const reff = useRef(null);
  const [editevent, setEditEvent] = useState([])
  const selectevent = (e) => {
    values.id = e.id
    values.date = e.date
    values.eventname = e.eventname
    values.cost = e.cost
    values.eventdetail = e.eventdetail
    fetchEvents();
    const element = document.getElementById('abd');
    if (element) {
      // 👇 Will scroll smoothly to the top of the next section
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const eventedit = (id, data) => {
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
      url: `${process.env.REACT_APP_BASE_URL}/event/edit/${id}`,
      data: { ...data, "files[]": fileValue },
      headers: {
        'authorization': `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setImageUploadProgress(progress);
      },
    }).then((res) => {
      setEditEvent(res.data.data)
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      for (let val in values) {
        values[val] = ""
      }
      setFileValue([])
      setIsLoaded(true);
      fetchEvents()
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
      .finally(() => {
        setIsLoading(false); // Stop loading, whether success or error
        setImageUploadProgress(0); // Reset the progress bar
      });
  }


  // fatch images
  const [images, setImages] = useState([]);
  const fatchImages = (id) => {
    setImages([]);
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/fetch/images`,
      data: { event_id: id },
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setImages(res.data.data);
      })
      .catch((res) => {
        toast.error(res.response.message)
      });
  }

  // delete photo
  const imgdelete = (val) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => Delete_Photo(val),
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const Delete_Photo = (val) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/delete/image`,
      data: { name: val },
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        fatchImages()
        toast.success(res.data.message, {
          toastId: "unique-random-text-xAu9C9-",
        });
        // setTimeout(() => {
        //   window.location.reload(true);
        // }, 1000); 
      })
      .catch((res) => {
        toast.error(res.response.message)
      });

  }

  // downlodepdf
  const downloadPdf = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/event/pdf/${id}`,
      headers: {
        'authorization': `Bearer ${token}`,
      },
    }).then((res) => {
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }

  const loadPdf = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/event/pdf/${id}`,
      headers: {
        'authorization': `Bearer ${token}`,
      },
    }).then((res) => {
   
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }

  const [fileValue, setFileValue] = useState([])
  const [event, setEvent] = useState([]);
  const initialValues = {
    invitation: [],
  };

  const [isLoading, setIsLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  let {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: AddeventRegistrationschema,
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
      if (data.id) {
        eventedit(data.id, data)
      }
      else {


        axios({
          method: "POST",
          url: `${process.env.REACT_APP_BASE_URL}/event/add`,
          headers: {
            'authorization': `Bearer ${token}`,
            "content-type": "multipart/form-data",
          },
          data: { ...data, "files[]": fileValue },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setImageUploadProgress(progress);
          }
        })
          .then((res) => {
            setEvent(res.data.data);
            for (let val in values) {
              values[val] = ""
            }
            toast.success(res.data.message, {
              toastId: "unique-random-text-xAu9C9-",
            });
            setIsLoaded(true);
            fetchEvents();
            setFileValue([])
          })
          .catch((res) => {
            toast.error(res.response.data.message)
          })
          .finally(() => {
            setIsLoading(false); // Stop loading, whether success or error
            setImageUploadProgress(0); // Reset the progress bar
          });
      }
    },
  });

  const [Profile, setProfile] = useState()
  const getInviteInfo = (val, e) => {


    setCustomerName(val.user_name)
    setProfile(val.user_img)

    if (val.accept_date === null) {

      setAcceptDate('')
      setCutomerValues('')
    }
    else {
      setCutomerValues(val.status)
      setAcceptDate(val.accept_date)
    }

  }

  const hell = (e) => {
    fatchImages(e.id)
    setCustomerName()
    setAcceptDate()
    setCutomerValues()
    setProfile()
    // loadPdf(e.id)
  }

  // file add
  // const [fileValue, setFileValue] = useState([]);
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

  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {
    return (
      <>
        <div className="main-body" id="root1">
          <div className="event-header d-flex div">

            <IconContext.Provider value={{ className: "shared-class", size: 40 }}>
              <GiPartyPopper />
            </IconContext.Provider>
            <h3>Events</h3>
          </div>

          <div className="div scroll-events pb-5">
            <div className=" child-scroll ">
              <div className="row user-event-header">
                <div className="col-2">
                  <p className="event-p">Datum </p>
                </div>
                <div className="col-6">
                  <p className="event-p">Das Event</p>
                </div>
                {/* <div className="col-2">
                  <p className="event-p">Einladung</p>
                </div> */}

                <div className="col-2">
                  <p className="event-p">Kosten</p>
                </div>

                <div className="col-2 ms-auto">
                  <p className="event-p float-end">Mehr Details</p>
                </div>
              </div>

              <div id="accordionExample">

                {products.length > 0 && (
                  <div className="products">
                    {products
                      .slice(page * 3 - 3, page * 3)
                      .map((e, index) => {
                        const price = parseFloat(e.cost);
                        const formattedPrice = new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(price);
                        const currencySymbol = '€'; // Add the currency symbol you want to use
                        const priceWithSymbol = formattedPrice.replace(currencySymbol, '') + currencySymbol;
                        return (

                          <div
                            className="accordion user-accordian"
                            id="accordionPanelsStayOpenExample"
                            key={index}
                          >

                            <h2
                              className="accordion-header"
                              id={`heading${e.id}`}
                            >
                              <div className="row user-event-dis ">
                                <div className="col-2">
                                  <p className="event-para">{e.date}</p>
                                </div>
                                <div className="col-6">
                                  <p className="event-para">{e.eventname}</p>
                                </div>
                                {/* <div className="col-2">
                                  <p className="event-para">{e.eventname}</p>
                                </div> */}
                                <div className="col-2">
                                  <p className="event-para">{priceWithSymbol}</p>
                                </div>
                                <div className="col-2 d-flex event-para ms-auto more-details">
                                  <i className="fa-regular fa-pen-to-square mx-2 fs-3 mt-2" onClick={() => selectevent(e)}></i>
                                  <i className="fa-solid fa-trash mx-2 fs-3 mt-2" onClick={() => click(e.id)}></i>
                                  <button
                                    className="accordion-button collapsed accordian-btn text-light"
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#abc${e.id}`}
                                    aria-expanded="true"
                                    aria-controls={`abc${e.id}`}
                                    onClick={() => hell(e)}
                                  //  onClick={()=>fatchImages(e.id)}
                                  ></button>
                                </div></div>
                            </h2>
                            <div
                              id={`abc${e.id}`}
                            
                              className="accordion-collapse collapse "
                              data-parent={`#abc${e.id}`}
                              aria-labelledby={`heading${e.id}`}
                              data-bs-parent="#accordionExample"
                             
                            >
                              <div className="admin-accordion-body">
                                <div className="event-details">
                                  {e.eventdetail}
                                  <div className="d-flex ">
                                    {images && images.map((val) => {

                                      return <div className="sidebox" onClick={() => imgdelete(val)}>
                                        <div className="delete_photo"> <i class="fa-solid fa-trash mx-1"></i></div>
                                        <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto  ">
                                          <img src={`${process.env.REACT_APP_IMG_URL}/assets/event_image/${val}`} style={{ height: "100px", width: "100px", marginLeft: "5px" }} />
                                        </SlideshowLightbox>

                                      </div>
                                    })}
                                  </div>
                                </div>

                                <div className="customer-details d-flex">
                                  <div className="customer-image">
                                    {Profile ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${Profile}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%" }}></div>}

                                  </div>

                                  <div className="col-3 customer-name dropdown ms-3">
                                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                      {customername}
                                    </button>
                                    <ul className="dropdown-menu custom-dropdown-menu custom-scrollbar">
                                      {e.customers_info.map((val) => {
                                        return <li onClick={() => getInviteInfo(val, e.id)} className="custom-li">{val.user_name}</li>
                                      })
                                      }
                                    </ul>
                                  </div>

                                  <div className="col-3 accept-reject ms-3 ">
                                    <span>{getstatus(customervalues)}</span>  <span className="ms-3">{acceptdate && moment(acceptdate).format("DD.MM.YYYY")}</span>
                                  </div>

                                  <div className="col-4 ms-3 h-100">
                                    <button className="download_btn" type="button">
                                      <i className="bi bi-download icon user-i"></i>
                                      <a
                                        download
                                        href={
                                          `${process.env.REACT_APP_IMG_URL}/assets/eventaccept/${e.eventname}.pdf`
                                        }
                                        target="_blank"
                                        className="btn-text"
                                        onClick={() => downloadPdf(e.id)}
                                      >
                                        Download
                                      </a>
                                    </button>
                                  </div>

                                </div>
                              </div>
                            </div>
                          </div>

                        );
                      })}
                  </div>
                )}

              </div>
            </div>
          </div>
          {products.length > 0 && (
            <div className="pagination">
              <span
                onClick={() => selectPageHandler(page - 1)}
                className={page > 1 ? "" : "!pagination__disable"}
              >
                ◀
              </span>

              {products.length > 0 &&
                [...Array(parseInt(products.length / 3))].map(
                  (_, i) => {
                    return (
                      <span
                        key={i}
                        className={
                          page === i + 1 ? "pagination__selected" : ""
                        }
                        onClick={() => selectPageHandler(i + 1)}
                      >
                        {i + 1}
                      </span>
                    );
                  }
                )}

              <span
                onClick={() => selectPageHandler(page + 1)}
                className={
                  page < products.length / 3
                    ? ""
                    : "pagination__disable"
                }
              >
                ▶
              </span>
            </div>
          )}

          <div className="add-event div " id="abd">
            <form action="post" onSubmit={handleSubmit}>
              <div className="add-event-data">
                <div className="contin-one d-flex ">
                  <div>
                    <input
                      type="date"
                      name="date"
                      value={values.date}
                      placeholder="Datum"
                      className="add-event-input user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error">
                      {errors.date && touched.date ? (
                        <small className="form-error">{errors.date}</small>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="eventname"
                      value={values.eventname}
                      placeholder="Das Event..."
                      className="add-event-input user-input lname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error ms-4">
                      {errors.eventname && touched.eventname ? (
                        <small className="form-error">{errors.eventname}</small>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="contain-two d-flex justify-content-between ">
                  <div className="order-fiel ">

                    <div className="file-area file-area-border">
                      <input
                        type="file"
                        id="files"
                        name="files[]"
                        multiple="multiple"
                        className="user-input"
                        accept="image/*"
                        onChange={(event) => {
                          const files = Array.from(event.target.files);
                          files.forEach((file) => {
                            handleImageChange(event, file);
                          });
                          setFileValue(files);
                        }}
                      />
                      <div className="user-input profile-input">
                        <div className="success">
                          <i className="bi bi-image me-1"></i>Bild hinzufügen...
                        </div>
                      </div>
                    </div>
                    <div className="error"></div>
                  </div>

                  <div>
                    <input
                      type="text"
                      name="cost"
                      value={values.cost}
                      placeholder="Kosten..."
                      className="add-event-input user-input lname"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <div className="error ms-4">
                      {errors.cost && touched.cost ? (
                        <small className="form-error">{errors.cost}</small>
                      ) : null}
                    </div>
                  </div>
                  <button
                    type="submit"
                    onClick={handleSubmit}
                    className="order-btn safe-btn lname event_safe"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span><i className="bi bi-hourglass-split icon pe-1"></i></span> // Replace with your loader icon
                    ) : (
                      <p className="m-0"><i class="bi bi-save2-fill pe-1 "> </i> speichern</p>

                    )}
                  </button>
                </div>
              </div>
              <div className="img-previews">

                {fileValue.map((file, index) => (
                  <div className="file-item" key={index}>
                    {file.type.startsWith('image/') && (
                      <img src={file.preview} alt="Preview" style={{ height: "100px", width: "100px" }} />
                    )}
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
              <div className="text-area w-100">
                <textarea
                  className="area-text user-input"
                  name="eventdetail"
                  value={values.eventdetail}
                  id=""
                  cols="100"
                  rows="4"
                  placeholder="Event beschreiben..."
                  type="texta area"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="error">
                  {errors.eventdetail && touched.eventdetail ? (
                    <small className="form-error">{errors.eventdetail}</small>
                  ) : null}
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
  };
}
export default AdminEvent;
