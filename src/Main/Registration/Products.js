import React, { useEffect, useState } from "react";
import "./ProductCard.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProductCard from "./ProductCard";


export default function RegistrationProduct(props) {

  const email = localStorage.getItem("email")
  const token = localStorage.getItem('token')
  const [product, setProduct] = useState([])

  const Allproducts = () => {
    // product api

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/product/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setProduct(res.data.data)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      }).catch((res) => {
        toast.error(res.response.data.message)
      })
  }
  useEffect(() => {
    Allproducts()
  }, [])


  // add cart
  const [cartItems, setCartItems] = useState([])
  useEffect(() => {
    props.cartItems(cartItems)
  }, [cartItems])

  const handleAddProduct = (products) => {
    console.log(products)
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/subscription/product/get`,
      data: { id: products.stripe_price_id, email: email }
    })
      .then((res) => {
        setCartItems(res.data.data)
        toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        setTimeout(() => {
          window.location = res.data.data
        }, 2000);
      }).catch((res) => {
        toast.error(res.response.data.message)
      })
  }

  const handleRemoveProduct = (product) => {
    const ProductExist = cartItems.find((item) => item.id === product.id);
    if (ProductExist.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...ProductExist, quantity: ProductExist.quantity - 1 }
            : item)
      );
    }
  };



  return (
    <>


      <div className="product-page-body">
        <div className="container-fluid ">
          <div className='product-page-header d-flex'>
            <i class="bi bi-easel2-fill fs-2"></i>

            <h3>Our All Products</h3>
          </div>
          <div className="row all_products ">
            <div className="col-12 allcards">

              {product.map(function ncard(val) {
                return (

                  <ProductCard products={val} name={val.product_name} price={val.price} des={val.description} cartItems={cartItems} handleAddProduct={handleAddProduct} handleRemoveProduct={handleRemoveProduct} />

                )
              })}


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
