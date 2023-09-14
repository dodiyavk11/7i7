import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import DataTable, { createTheme } from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';


import "./product.css";
import Productvelidationschema from './Productvelidationschema';
const Products = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')
  const [product, setProduct] = useState([])
  const [page, setPage] = useState(1);
  const [deleteproduct, setDeletproduct] = useState([])
  const [Editproduct, setEditProduct] = useState([])

  function products() {
    // all product
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/product/all`,
      // data: data,
      headers: {
        'authorization': `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      }
    }).then((res) => {
      setIsLoaded(true);
      setProduct(res.data.data)
    }).catch((err) => {
      setIsLoaded(true);
      console.log(err)
    })
  }
  useEffect(() => {
    products();
  }, [])



  const selectPageHandler = (selectedPage) => {
    if (
      selectedPage >= 1 &&
      selectedPage <= product.length / 1 &&
      selectedPage !== page
    ) {
      setPage(selectedPage);
    }
  };

  // delete product

  const click = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ne',
          onClick: () => deletproduct(id)
        },
        {
          label: 'Nein',
          //onClick: () => alert('Click No')
        }
      ]
    });
  }

  const deletproduct = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/product/remove/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      setDeletproduct(res)
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      products();

    }).catch((res) => {
      toast.error(res.response.data.message)
    })

  }

  // editproduct

  const selectproduct = (e) => {
    values.id = e.id
    values.product = e.product_name
    values.price = e.price
    values.description = e.description
    products();
  }

  const editproduct = (id, data) => {
    axios({
      method: "PATCH",
      url: `${process.env.REACT_APP_BASE_URL}/product/add/${id}`,
      data: { ...data, price: Number(data.price) },
      headers: {
        'authorization': `Bearer ${token}`,
      },
    }).then((res) => {
      setEditProduct(res.data.data)
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      for (let val in values) {
        values[val] = ""
      }
      products();
    }).catch((res) => {
      console.log(res)
      toast.error(res.response.data.message)
    })
      .finally(() => {
        setIsLoading(false); // Stop loading, whether success or error
      });
  }

  const initialValues = {
  };

  const [isLoading, setIsLoading] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Productvelidationschema,
    onSubmit: (data) => {
      setIsLoading(true); // Start loading
      if (data.id) {
        editproduct(data.id, data)
      }
      else {

        axios({
          method: "POST",
          url: `${process.env.REACT_APP_BASE_URL}/product/add`,
          data: { ...data, price: Number(data.price) },
          headers: {
            'authorization': `Bearer ${token}`,
          }
        })
          .then(function (res) {
            toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
            for (let val in values) {
              values[val] = ""
            }
            products();
          })
          .catch(function (res) {
            toast.error(res.response.data.message)
          })
          .finally(() => {
            setIsLoading(false); // Stop loading, whether success or error
          });
      }
    },

  })
  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {

    return (
      <>
        <div className="main-body container-fluid"  id="root1">
          <div className='product-header d-flex div'>
            <i class="bi bi-easel2-fill fs-2"></i>

            <h3>Product</h3>
          </div>

          <div className='product-body div'>
            <div className="field-add scroll-events ">
              <div className=" child-scroll ">
                <div className="row user-product-header">
                  <div className="col-2 p-0">
                    <p className="event-p">Id</p>
                  </div>
                  <div className="col-6 p-0">
                    <p className="event-p">Product Name</p>
                  </div>
                  <div className="col-2 p-0">
                    <p className="event-p">Price</p>
                  </div>
                  <div className="col-2 ms-auto">
                    <p className="event-p float-end">Action</p>
                  </div>
                </div>

                <div id="accordionExample">

                  {product.length > 0 && (
                    <div className="">
                      {product
                        .slice(page * 3 - 3, page * 3)
                        .map((e, index) => {
                          const product_price = e.price.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

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
                                    <p className="event-para">{e.id}</p>
                                  </div>
                                  <div className="col-6">
                                    <p className="event-para">{e.product_name}</p>
                                  </div>
                                  <div className="col-2">
                                    <p className="event-para">{product_price}</p>
                                  </div>
                                  <div className="col-2 d-flex event-para ms-auto more-details">
                                    <i className="fa-regular fa-pen-to-square mx-2 fs-3 mt-2" onClick={() => selectproduct(e)}></i>
                                    <i className="fa-solid fa-trash mx-2 fs-3 mt-2" onClick={() => click(e.id)}></i>
                                    <button
                                      className="accordion-button collapsed accordian-btn text-light"
                                      type="button"
                                      data-bs-toggle="collapse"
                                      data-bs-target={`#abc${e.id}`}
                                      aria-expanded="true"
                                      aria-controls={`abc${e.id}`}
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
                                    {e.description}
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
            {product.length > 0 && (
              <div className="pagination">
                <span
                  onClick={() => selectPageHandler(page - 1)}
                  className={page > 1 ? "" : "!pagination__disable"}
                >
                  ◀
                </span>

                {product.length > 0 &&
                  [...Array(parseInt(product.length / 3))].map(
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
                    page < product.length / 3
                      ? ""
                      : "pagination__disable"
                  }
                >
                  ▶
                </span>
              </div>
            )}

            <div className="field-add pe-4">
              <form action="post" onSubmit={handleSubmit}>
                <div className="add-event-data">
                  <div className="contin-one d-flex justify-content-between">
                    <div className=" added-input">
                      <input
                        type="text"
                        name="product"
                        value={values.product}
                        placeholder="write your product"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className="add-event-input user-input "
                      />
                      <div className="error">
                        {errors.product && touched.product ? (
                          <small className="form-error">{errors.product}</small>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="contain-two d-flex justify-content-between ">

                    <div>
                      <input
                        type=""
                        name="price"
                        value={values.price}
                        placeholder="enter Price"
                        className="add-event-input user-input lname"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <div className="error ms-4">
                        {errors.price && touched.price ? (
                          <small className="form-error">{errors.price}</small>
                        ) : null}
                      </div>
                    </div>
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      className="order-btn safe-btn lname"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span><i className="bi bi-hourglass-split icon pe-1"></i>Processing...</span> // Replace with your loader icon
                      ) : (
                        <span>
                          <i className="fa-solid fa-print pe-1"></i>
                          Safe New Product
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                <div className="text-area w-100">
                  <textarea
                    className="area-text user-input"
                    name="description"
                    value={values.description}
                    id=""
                    cols="100"
                    rows="4"
                    placeholder="describe the new Product"
                    type="texta area"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <div className="error">
                    {errors.description && touched.description ? (
                      <small className="form-error">{errors.description}</small>
                    ) : null}
                  </div>
                </div>
              </form>
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
    )
  }
}

export default Products;
