import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import "../Main/verification.css"
import success from "../Assets/images/success-removebg-preview.png"
import wrong from "../Assets/images/wrong-removebg-preview.png"
import img from "../Assets/images/logo.png"
const Verification = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { token } = useParams()
    const [velid, setVelid] = useState()

    useEffect(() => {
        axios({
            method: "POST",
            url: `${process.env.REACT_APP_BASE_URL}/verify/email/${token}`,
        }).then((res) => {
            setVelid(res.data.status)
            setIsLoaded(true);
            setTimeout(() => {
                toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
            }, 1000);
            console.log(res.data.message)

        }).catch((res) => {
            setIsLoaded(true);
            console.log(res.response.data.message)
            setTimeout(() => {
                toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
            }, 1000);

        })
    }, [])


    if (!isLoaded) {
        return (
            <>
                <div className='bg-dark w-100 verify_page' id="root1">
                 <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
                </div>
            </>
        )
      } else {
          return (
              <>
                  {velid && velid ? (
                      <>
                          <div className='bg-dark w-100 verify_page' id="root1">
                              <div className='main_div div'>
                                  <div className='img_logo' ><img src={img} alt="logo" /></div>
                                  <div className='success-done'>
                                      <h2>Verifizierung erfolgreich</h2>
                                      <img src={success} className="success-done-img" alt="success_img" />
                                      <p>Die Verifizierung war erfolgreich. Sie können sich nun anmelden</p>
                                      <p>Jetzt anmelden</p>
                                      <Link to="/" className='green-btn'>Klicken Sie zum Änmelden</Link>
                                  </div>
                              </div>
                          </div>
      
                      </>
      
                  ) : (
      
                      <div className='bg-dark w-100 verify_page' id="root1">
                          <div className='main_div div'>
                              <div className='img_logo' ><img src={img} alt="logo" /></div>
                              <div className='success-done'>
                                  <h2 style={{ color: 'red' }}>Verification wrong</h2>
                                  <img src={wrong} className="success-done-img" alt="success_img" />
                                  <p>Dänke für Ihre Ünterstützüng</p>
                                  <p>Verifizierung erfolgreich nicht.</p>
                                  <p>verifiziert .</p>
                                  <Link to="/" className='red-btn'>Klicken Sie zum Änmelden</Link>
                              </div>
                          </div>
                      </div>
                  )
      
                  }
                  <div className='fs-5 bg-dark'>{velid}</div>
      
                  <ToastContainer
      
                      position="top-center"
                      autoClose={3000}
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

export default Verification
