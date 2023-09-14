
import React from 'react'
import { Outlet } from 'react-router-dom'
import Adminmenu from './Adminmenu'


export default function Adminlayout() {
  return (
    <>
          <Adminmenu />   
          <Outlet />
    </>
  )
}

