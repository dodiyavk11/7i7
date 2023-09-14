
import React from 'react'
import { Outlet } from 'react-router-dom'
import Usermenu from './Usermenu';

export default function Userlayout() {

  return (
    <>
      <Usermenu/>
      <Outlet />   
    </>
  )
}

