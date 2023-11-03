import React from 'react'
import img1 from "../src/Assets/images/error404.gif"


export default function Nopage() {
  return (
    <div className='404error' style={{height:"100vh" , width:"100vw"}}>
      <img src={img1}  className="img-fluid" />
    </div>
  )
}
