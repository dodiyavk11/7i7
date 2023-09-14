import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import DataTable from "react-data-table-component";
import { BsFillEnvelopeFill } from "react-icons/bs";
import { IconContext } from "react-icons";
import { BsPlus } from "react-icons/bs";

const Email_template = () => {

  const customCell = (row, func2) => (
      <Link to={`/admin/email_templete/update_email_template/${row.id}`}><i className="fa-regular fa-pen-to-square mx-1" ></i></Link>
  );

  const column = [
    {
      name: 'Nr.',
      selector: row => row.id,
      sortable: true,
      responsive: 'sm',
    },
    {
      name: 'Titel',
      selector: row => row.email_title,
      sortable: true,
      responsive: 'sm',
    },

    {
      name: 'Aktion',
      selector: row => customCell(row),
      sortable: true,
      responsive: 'sm',

    }
  ];


  const customCell1 = (row, func2) => (
    <Link to={`/admin/chat_templete/update_chat_template/${row.id}`}><i className="fa-regular fa-pen-to-square mx-1" ></i></Link>
);

const column1 = [
  {
    name: 'Nr.',
    selector: row => row.id,
    sortable: true,
    responsive: 'sm',
  },
  {
    name: 'Titel',
    selector: row => row.msg_title,
    sortable: true,
    responsive: 'sm',
  },

  {
    name: 'Aktion',
    selector: row => customCell1(row),
    sortable: true,
    responsive: 'sm',

  }
];


  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')




    // email api
    const [chatdata, setchatData] = useState([])
    const navigate1 = useNavigate()
  useEffect(() => {
    // console.log('chat');rs
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/chat/template`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        // console.log(res);
        setIsLoaded(true);
        setchatData(res.data.data)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      }).catch((res) => {
        setIsLoaded(true);
        toast.error(res.response.message)
      })
  }, []);


    // email api
    const [emaildata, setemailData] = useState([])
    const navigate = useNavigate()
  useEffect(() => {

    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/email/template`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setIsLoaded(true);
        setemailData(res.data.data)
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      }).catch((res) => {
        setIsLoaded(true);
        toast.error(res.response.message)
      })
  }, []);
  const CustomEmptyState = () => (
    <div className="custom-empty-state p-3">
    Keine Einträge vorhanden
  </div>
  );  

  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {

    return (
      <>

        <div className="main-body"  id="root1">
          <div className="order-header d-flex div">
            <IconContext.Provider value={{ className: "shared-class", size: 40 }}>
              <BsFillEnvelopeFill />
            </IconContext.Provider>

            <h3>E-Mail</h3>
          </div>

          <div className=" datatable">
            <div className="admin-dashboard">
              <div id="admin-dashboarddata">
                <DataTable
                  columns={column}
                  data={emaildata}
                  noHeader={true}
                  pagination={true}
                  paginationPerPage={10}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Anzahl/Seite:',
                  }}
                  paginationRowsPerPageOptions={[5, 10]}
                  noDataComponent={<CustomEmptyState/>}
                  onRowClicked={(row) => {
                    navigate(`/admin/email_templete/update_email_template/${row.id}`)
                  }}
                  theme="solarized" />
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
  };
}
export default Email_template;
