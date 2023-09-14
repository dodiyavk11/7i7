import axios from "axios";

import React, { useEffect, useState } from "react";

import "./userEvents.css";

import styled from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import { GiPartyPopper } from "react-icons/gi";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { SlideshowLightbox } from "lightbox.js-react";
import 'lightbox.js-react/dist/index.css'

// style components
const StyledCell = styled.div`
  &.teilnehmen {
    background-color:#C0DE60;
    border-radius: 5px;
    font-size: 18px;
    line-height: 18px;
    padding: 10px 20px;
      display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
   cursor : pointer;
   height:auto;
   text-align: center;
  }
  &.akzeptiert{
    height: 40px;
  background-color: #263238;
  font-size: 18px;
  display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 15px;
    border-radius: 5px;
    cursor: pointer;
  color: white;
  margin-top: 10px;
  }
  &.stornieren{
    height: 40px;
  margin-left: 3%;
  display: flex;
  cursor: pointer;
  border-radius: 5px;
    justify-content: center;
    align-items: center;
    padding: 15px 15px;
  background-color:#DE6060;
  font-size: 18px;
  color: white;
  margin-top: 10px;
  }
`;

// UserEvents start
export default function UserEvents() {
  const [error,] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const token = localStorage.getItem("token");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [, setallEvents] = useState([]);
  const [, setEvent] = useState();

  // get event
  useEffect(() => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/event/get`,

      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "multipart/form-data",
      },
    })
      .then((res) => {
        setIsLoaded(true);
        res.data.data.length > 0 && setProducts(res.data.data);
        setallEvents(res.data.data);
      })
      .catch((res) => {
        setIsLoaded(true);
        toast.error(res.response.message)

      });

  }, [token]);

  // fatch images
  const [images, setImages] = useState([])
  const fatchImages = (id) => {
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


  //accept event
  const sendmail = (e) => {
    e.event_status === 0 ? (e.event_status = 1) : (e.event_status = 0);
    const a = { id: e.id, event_status: e.event_status };
    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_BASE_URL}/event/add`,
      data: a,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success(res.data.message);
        setEvent(res);
      })
      .catch((err) => {
        toast(err);
      });
  };

  // cancle event
  const cancleEvent = (e) => {
    e.event_status === 1 ? (e.event_status = 0) : (e.event_status = 1);

    const a = { id: e.id, event_status: e.event_status };

    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_BASE_URL}/event/add`,
      data: a,
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        toast.success(res.data.message, {
          toastId: "unique-random-text-xAu9C9-",
        });

        setEvent(res);
      })
      .catch((res) => {
        toast.error(res.response.message, {
          toastId: "unique-random-text-xAu9C9-",
        });
      });
  };

  // style components based on status
  function Eventstatus(event_status) {
    if (event_status === 0) {
      return "teilnehmen";
    }
  }
  function Accepted(event_status) {
    if (event_status === 1) {
      return "akzeptiert";
    }
  }
  function cancle(event_status) {
    if (event_status === 1) {
      return "stornieren";
    }
  }

  // pagination
  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= parseInt(products.length / 1) &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };
  // loader
  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" alt="loading" />;
  } else {
    return (
      <>
        <div className="main-body user-event" id="root1">
          <div className="event-header d-flex div">

            <IconContext.Provider value={{ className: "shared-class", size: 40 }}>
              <GiPartyPopper />
            </IconContext.Provider>
            <h3>Events</h3>
          </div>

          <div className="div">
            <div className="description">
              <b className="events-info">
                Wichtige Informationen zu den Events:
              </b>
              <hr className="user-hr" />
              <p className="evet-information">
                7i7® engagiert sich leidenschaftlich dafür, regelmäßig inspirierende Events exklusiv
                für seine geschätzten 7i7® Enterprise Kunden zu organisieren. Denn bei diesen
                besonderen Anlässen steht nicht nur der geschäftliche Austausch im Vordergrund,
                sondern vor allem der persönliche Kontakt und das Schaffen von unvergesslichen
                Momenten.
              </p>
              <p className="evet-information">
                Wir legen großen Wert darauf, dass unsere Kunden in einer angenehmen und
                herzlichen Atmosphäre zusammenkommen, um sich auszutauschen, voneinander zu
                lernen und neue Beziehungen aufzubauen. Denn wir sind überzeugt, dass der
                persönliche Kontakt die Basis für langfristige Partnerschaften und gemeinsamen
                Erfolg bildet.
              </p>
            </div>
          </div>



          <div className="div scroll-events pb-4">
            <div className="description child-scroll ">
              <div className="row user-event-header">
                <div className="col-2">
                  <p className="event-p">Datum </p>
                </div>
                <div className="col-4">
                  <p className="event-p">Event</p>
                </div>
                {/* <div className="col-2">
                  <p className="event-p">Einladung</p>
                </div> */}

                <div className="col-2">
                  <p className="event-p">Kosten</p>
                </div>
                <div className="col-2">
                  <p className="event-p">Status</p>
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
                                <div className="col-4">
                                  <p className="event-para">{e.eventname}</p>
                                </div>
                                {/* <div className="col-2">
                                  <p className="event-para">{e.eventname}</p>
                                </div> */}
                                <div className="col-2">
                                  <p className="event-para">{priceWithSymbol}</p>
                                </div>

                                <div className="col-3 d-flex event-para">
                                  <StyledCell
                                    className={Eventstatus(e.event_status)}
                                    onClick={() => sendmail(e)}
                                  >
                                    {Eventstatus(e.event_status)}

                                  </StyledCell>


                                  <StyledCell
                                    className={Accepted(e.event_status)}
                                  >
                                    {Accepted(e.event_status)}
                                  </StyledCell>

                                  <StyledCell
                                    className={cancle(e.event_status)}
                                    onClick={() => cancleEvent(e)}
                                  >
                                    {cancle(e.event_status)}
                                  </StyledCell>
                                </div>
                                <div className="col-1 d-flex event-para">

                                  <button
                                    className="accordion-button collapsed accordian-btn text-light"


                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#abc${e.id}`}
                                    aria-expanded="true"
                                    aria-controls={`abc${e.id}`}
                                    onClick={() => fatchImages(e.id)}
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
                              <div className="user-accordion-body">
                                <div className="event-details">
                                  {e.eventdetail}
                                  <div className="d-flex">
                                    {images && images.map((val) => {
                                      return <SlideshowLightbox className="container grid grid-cols-3 gap-2 mx-auto ">
                                        <img src={`${process.env.REACT_APP_IMG_URL}/assets/event_image/${val}`} style={{ height: "100px", width: "100px",marginLeft: "5px" }} />
                                      </SlideshowLightbox>
                                    })

                                    }
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
