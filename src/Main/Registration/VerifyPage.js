import React from 'react'
import "./Registration.css";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
const VerifyPage = () => {
  const email = localStorage.getItem("email")
  const name = localStorage.getItem("name")
  const [isLoading, setIsLoading] = useState(false);

  const Resendmail = () => {
    setIsLoading(true); // Start loading
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/resendmail`,
      data: { "email": email, "name": name },
    })
      .then(function (res) {
        toast.success(res.data.message);
      })
      .catch(function (res) {
        toast.error(res.response.data.message);
      })
      .finally(() => {
        setIsLoading(false); // Stop loading, whether success or error
    });
  }

  return (
    <>
      <div className='verification_page' id="root1">
        <div className='VerifyPage '>
          <div className="card2 bg-dark pt-5 pb-4">

            <i class="bi bi-envelope fs-1 evolep_icon pb-3"></i>


            <div className="card-body text-dark">
              <h3 className="car">Bestätigen Sie Ihre E-Mail-Ädresse</h3>
              <p className='paregraph'>Eine Bestätigüngs-E-Mail wurde än gesendet</p>
              <h6>{email}</h6>
              <p className='paregraph pt-2'>Überprüfen Sie Ihren Posteingäng ünd klicken Sie aüf „Klicken“. <br />  Klicken Sie hier, üm Ihre E-Mail-Ädresse zü bestätigen <br /> Ädresse</p>
              <p className='paregraph'>Wenn nicht, senden Sie die E-Mail erneüt ünter dem Link</p>


              <button className="order-btn m-0 add-btn" onClick={() => { Resendmail() }}>
            {isLoading ? (
                                <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                            ) : (
                                <span>
                                <i className="bi bi-box-arrow-in-right pe-2"></i>
                                Erneüt senden
                                </span>
                            )}
              
            </button>

              <a href={`mailto:${email}`} className='resend_btn'>Gehen Sie zür Mäil-Seite</a>
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
  )
}

export default VerifyPage
