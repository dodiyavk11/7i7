import React from "react";
import './Support.css'

export default function Support() {
  return (
    <>
      <div className="main-body"  id="root1">
        <div className="order-header d-flex div">
          <i className="bi bi-question-circle fs-3 mt-1"></i>
          <h3>Support </h3>
        </div>
        <div class="row accounts-btn divone g-2 d-flex" >
          <div class="col-lg-6 d-flex">
            <div class="col-md-12 payroll">
              <div className="container d-flex">
                <i className="bi bi-question-circle  support-icon"></i>
                <b className="support-b">Kontakt</b>
              </div>
              <div className="description">
                <p>Bei Fragen zu Deinem 7i7® Enterprise Paket:<br />
                  7i7® | Britta Jureczek<br />
                  Gooskamp 7<br />
                  23795 Klein Galdebrügge<br />
                  buchhaltung@7i7.de</p>
              </div>
            </div></div>
          <div class="col-lg-6 d-flex">
            <div class="col-md-12 contect-hr">

              <div className="container d-flex">
                <i className="bi bi-question-circle support-icon"></i>
                <b className="support-b">Telefon</b>
              </div>
              <div className="description ">
                <p className="user-phone">Nummer: +49 4551 890 3120</p>
                <button className=" support-btn " type="btn" >
                  <i class="bi bi-telephone"> </i>
                  <a href="tel:+49 4551 890 3120" className="btn-text">Anrufen</a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}





