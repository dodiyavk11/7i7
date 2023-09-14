import axios from 'axios'
import React, { useEffect, useState } from 'react'

import "./ProductCard.css"

const ProductCard = ({name,price,des,handleAddProduct,products}) => {
  let  All_product_price;
  if (price !== null) {
     All_product_price = price.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
  } 
  
  return (
    <>
    
    <div className="card1 bg-dark">
  <div className="card-body text-dark">
    <h3 className="card-title">{name}</h3>
    <div className='price'>{All_product_price}</div>
    <p className='par'>{des}</p>
    <button className='order-btn m-0 subscribe_btn add-btn' onClick={()=>handleAddProduct(products)}>Subscribe</button>
  </div>
</div>
        
    </>
  )
}

export default ProductCard;


