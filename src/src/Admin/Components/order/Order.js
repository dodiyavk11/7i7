import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./order.css";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import DataTable, { createTheme } from "react-data-table-component";
import { useFormik } from "formik";
import styled from "styled-components";
import moment from "moment";
import { confirmAlert } from "react-confirm-alert";

const StyledCell = styled.div`

  &.Standard{
    background: rgb(60, 60, 60);;
    border-radius : 5px;
    padding: 10px 10px;
  }
  &.Hoch{
    background: rgb(69, 85, 52);
    border-radius : 5px;
    padding: 10px 10px;
  }
  &.Neuer{
    background: rgb(69, 85, 52);;
    border-radius : 5px;
    padding: 10px 25px;
  }
  &.Wird{
    background:  #C0DE60;
    border-radius : 5px;  
    padding: 10px 25px;
  }
  &.Abgeschlossen{
    background: rgb(60, 60, 60);;
    border-radius : 5px;   
    padding: 10px 25px;
  }
`;

function getPriorityClass(orderpriority) {
  if (orderpriority == 1) return "Hoch";
  else if (orderpriority == 0) return "Standard";

}
function getStatusClass(orderstatus) {
  if (orderstatus == 1) return "Neuer Auftrag";
  else if (orderstatus == 2) return "Wird bearbeitet";
  else if (orderstatus == 3) return "Abgeschlossen"
  return "low";
}
function updatestatus(update_status_admin) {
  if (update_status_admin === true) return <i class="bi bi-envelope-exclamation-fill warninng"></i>;
  else if (update_status_admin == 2) return <i class="bi bi-envelope-exclamation-fill abcd"></i>;
  else if (update_status_admin === 0) return "";
}

{/* <i className="bi bi-exclamation  warninng"></i> */ }
{/* <i className="bi bi-exclamation  abcd"></i> */ }
const Order = () => {

  const customCell = (row, func2) => (
    <>
      <Link to={`/admin/order/updateorder/${row.id}`}><i className="fa-regular fa-pen-to-square mx-1" ></i></Link>
      <i className="fa-solid fa-trash mx-1" onClick={() => func2(row.id)}></i>
    </>
  );
  const column = [
    {
      name: '',
      cell: (row) => (
        <StyledCell className={updatestatus(row.update_status_admin)}>
          {updatestatus(row.update_status_admin)}
        </StyledCell>
      ),
      width: "2%",
    },
    {
      name: 'Priorität',
      sortable: true,
      cell: (row) => (
        <StyledCell className={getPriorityClass(row.orderpriority)}>
          {getPriorityClass(row.orderpriority)}
        </StyledCell>
      ),

    },
    {
      name: 'Kunde',
      selector: row => row.customerName.map((val) => { return val.company }),
      sortable: true,
    },
    {
      name: 'Titel',
      selector: row => row.ordername,
      sortable: true,
    },
    {
      name: 'Mitarbeiter',
      selector: row => row.employeeName.map((val) => {
        return (
          <div className="Employee">
            <span>
              {val.fname} {val.lname}
              <br />
            </span>
          </div>
        )
      }),
      sortable: true,
    },
    {
      name: 'Nr.',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Datum',
      selector: row => row.createdAt,
      format: (row) => moment(row.createdAt).format("DD.MM.YYYY"),
      sortable: true,
    },
    {
      name: 'Status',
      sortable: true,
      cell: (row) => (
        <StyledCell className={getStatusClass(row.orderstatus)}>
          {getStatusClass(row.orderstatus)}
        </StyledCell>),
    },
    {
      name: 'Aktion',
      selector: row => customCell(row, click),
      sortable: true,

    }
  ];

  const getRole = localStorage.getItem("role")
  const getName = localStorage.getItem("name")

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [orderdata, setOrderData] = useState([])
  const token = localStorage.getItem('token')
  const [employeedata, setemployeeData] = useState([])
  const [customerdata, setCustomerdata] = useState([])
  const [empname, setEmpname] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    // employee api
    axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/employee/get/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setemployeeData(res.data.data)
        setEmpname(res.data.data.fname)
      }).catch((err) => {
        console.log(err)
      })
  }, [])
  useEffect(()=>{
     // customer api
     axios({
      method: 'POST',
      url: `${process.env.REACT_APP_BASE_URL}/user/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        setIsLoaded(true);
        setCustomerdata(res.data.data)
      }).catch((err) => {
        setIsLoaded(true);
        console.log(err)
      })
  },[])

  // all order
  // // get filter order
  const filterOrder = localStorage.getItem("filter")
  const filterOrders = JSON.parse(filterOrder);
  const allorder = (filter) => {
    if(filter){
      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/order/get/filter?orderstatus=${filterOrders.orderstatus}&employee=${filterOrders.employee}&orderpriority=${filterOrders.orderpriority}&customer=${filterOrders.customer}`, 
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          setOrderData(res.data.data)
          // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        }).catch((res) => {
          toast.error(res.response.message)
        })
    }
    else{

      axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BASE_URL}/order/get/filter?`,
        headers: {
          'authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          setOrderData(res.data.data)
          // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
        }).catch((res) => {
          toast.error(res.response.message)
        })
      
    }
  }
  useEffect(() => {
    allorder(filterOrders)
  }, [])
let initialValues;
  if(filterOrders){
    initialValues = {
      orderstatus: filterOrders.orderstatus,
      employee: filterOrders.employee,
      customer: filterOrders.customer,
      orderpriority: filterOrders.orderpriority,
    };
  }
  else{
     initialValues = {
      orderstatus: "",
      employee: "",
      customer: '',
      orderpriority: ""
    };
  }

  const [isLoading, setIsLoading] = useState(false);
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: initialValues,
    onSubmit: (chngedata) => {
      setIsLoading(true); // Start loading
      axios({
        method: "POST",
        url: `${process.env.REACT_APP_BASE_URL}/order/get/filter?orderstatus=${chngedata.orderstatus}&employee=${chngedata.employee}&orderpriority=${chngedata.orderpriority}&customer=${chngedata.customer}`,
        data: chngedata,
        headers: {
          'authorization': `Bearer ${token}`
        }
      }).then((res) => {
        setOrderData(res.data.data)
        localStorage.setItem("filter",JSON.stringify(chngedata))
        // localStorage.setItem("filter",JSON.stringify(res.data.data))
        // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      }).catch((res) => {
        toast.error(res.response.data.message)
      })
        .finally(() => {
          setIsLoading(false); // Stop loading, whether success or error
        });

    },

  })

  // delete order
  const click = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deletorder(id)
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const deletorder = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/remove/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      allorder()

    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }
  // datatable component
  const CustomEmptyState = () => (
    <div className="custom-empty-state p-3">
      Keine Eintrage vorhanden
    </div>
  );

  // // get filter order
  // const filterOrder = localStorage.getItem("filter")
  // const filterOrders = JSON.parse(filterOrder);
  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" />
  } else {

    return (
      <>

        <div className="main-body" id="root1">
          <div className="order-header d-flex div">
            <i className="bi bi-binoculars i fs-2"></i>
            <h3>Auftrag</h3>
            <Link to="neworder" className="order-btn" >
              <i class="bi bi-plus-square pe-2"></i>Neuer Auftrag
            </Link>
          </div>

          <div className="order-body div">
            <form action="" onSubmit={handleSubmit}>
              <div className="container">
                <div className="row d-flex justify-content-evenly">
                  <div className="col-md-6">
                    <label className="admin-lable">
                      <i className="fa-solid fa-triangle-exclamation me-2"></i>
                      Mitarbeiter :
                    </label>
                    <br />
                    {
                      getRole == 1 ?
                        <select
                          type="text"
                          name="employee"
                          value={values.employee}
                          placeholder="Mitarbeiter auswählen"
                          className="user-input "
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option value="" className="admin-select">Mitarbeiter auswählen</option>
                          {employeedata.map((e) => {
                            return <option value={e.id} className="admin-select">{e.fname + " " + e.lname}</option>
                          })}
                        </select>

                        :
                        <input
                          type="text"
                          name="employee"
                          value={getName}
                          // value={values.employee}
                          className="user-input "
                        />

                    }

                  </div>
                  <div className="col-md-6">

                    <label className="admin-lable">
                      <i className="fa-solid fa-triangle-exclamation me-2"></i>
                      Status :
                    </label>
                    <br />

                    <select
                      type="text"
                      name="orderstatus"
                      placeholder="Status auswählen"
                      className="user-input"
                      value={values.orderstatus}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >

                      <option value="">Status auswählen</option>
                      <option value="1">Neuer Auftrag</option>
                      <option value="2">Wird bearbeitet</option>
                      <option value="3">Abgeschlossen</option>
                    </select>
                  </div>
                  <div className="col-md-6 pt-2">
                    <label className="admin-lable">
                      <i className="fa-solid fa-triangle-exclamation me-2"></i>
                      Priorität :
                    </label>
                    <br />

                    <select
                      type="text"
                      name="orderpriority"
                      placeholder="Priorität auswählen"
                      className="user-input"
                      value={values.orderpriority}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option value="">Priorität auswählen</option>
                      <option value="1">Hoch</option>
                      <option value="0">Standard</option>
                    </select>
                  </div>

                  <div className="col-md-6 pt-2">
                    <label className="admin-lable">
                      <i className="fa-solid fa-triangle-exclamation me-2"></i>
                      Kunde :
                    </label>
                    <br />

                    <select
                      type="text"
                      name="customer"
                      value={values.customer}
                      placeholder="Kunde auswählen"
                      className="user-input"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >


                      <option value="">Kunde auswählen</option>
                      {customerdata.map((e) => {
                        return <option value={e.id}>{e.company}</option>
                      })}
                    </select>
                  </div>
                  <div className="btn-src col-2 ">
                    <button
                      type="submit"
                      className="btn-src-link"
                      disabled={isLoading}
                      style={{ background: 'none' }}
                    >
                      {isLoading ? (
                        <span><i className="bi bi-hourglass-split icon pe-1"></i>Wird bearbeitet...</span> // Replace with your loader icon
                      ) : (
                        <span>
                          <i className="fa-solid fa-magnifying-glass pe-2"></i>Aktualisieren
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="datatable">
            <div className="admin-dashboard">
              <div id="admin-dashboarddata">
              <DataTable
                  columns={column}
                  data={orderdata}
                  noHeader={true}
                  pagination={true}
                  paginationPerPage={20}
                  noDataComponent={<CustomEmptyState />}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Anzahl/Seite:',
                  }}
                  paginationRowsPerPageOptions={[20,30, 40]}
                  onRowClicked={(row) => {
                    if (getRole == 1) {
                      navigate(`/admin/order/updateorder/${row.id}`)
                    } else if (getRole == 2) { 

                    navigate(`/employee/order/updateorder/${row.id}`)
                    }
                  }}
                  theme="solarized" />
                        {/* {filterOrder ? 
                          <DataTable
                  columns={column}
                  data={filterOrders}
                  noHeader={true}
                  pagination={true}
                  paginationPerPage={20}
                  noDataComponent={<CustomEmptyState />}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Anzahl/Seite:',
                  }}
                  paginationRowsPerPageOptions={[20,30, 40]}
                  onRowClicked={(row) => {
                    if (getRole == 1) {
                      navigate(`/admin/order/updateorder/${row.id}`)
                    } else if (getRole == 2) { 

                    navigate(`/employee/order/updateorder/${row.id}`)
                    }
                  }}
                  theme="solarized" />

                        
                        :
                        <DataTable
                  columns={column}
                  data={orderdata}
                  noHeader={true}
                  pagination={true}
                  paginationPerPage={20}
                  noDataComponent={<CustomEmptyState />}
                  paginationComponentOptions={{
                    rowsPerPageText: 'Anzahl/Seite:',
                  }}
                  paginationRowsPerPageOptions={[20,30, 40]}
                  onRowClicked={(row) => {
                    if (getRole == 1) {
                      navigate(`/admin/order/updateorder/${row.id}`)
                    } else if (getRole == 2) { 

                    navigate(`/employee/order/updateorder/${row.id}`)
                    }
                  }}
                  theme="solarized" />

                        } */}

                
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
export default Order;
