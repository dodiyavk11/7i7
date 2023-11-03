
import React, { useEffect, useState } from "react";
import './Dashboard.css';
import '../../User/Userstyle/Userglobal.css';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DataTable, { createTheme } from 'react-data-table-component';
import axios from "axios";
import styled from "styled-components";
import moment from "moment/moment";
import { confirmAlert } from "react-confirm-alert";
// style components
const StyledCell = styled.div`

  &.Standard {
    background: rgb(60, 60, 60);;
    border-radius : 5px;
    padding: 10px 10px;
  }
  &.Hoch {
    background: rgb(69, 85, 52);
    border-radius : 5px;
    padding: 10px 10px;
  }
  &.Neuer {
    background: rgb(69, 85, 52);;
    border-radius : 5px;
    padding: 10px 0px;
    width : 100%;
   text-align: center;
  }
  &.Wird {
    background:  #C0DE60;
    border-radius : 5px;
    padding: 10px 0px;
    width : 100%;
   text-align: center;
  }
  &.Abgeschlossen {
    background: rgb(60, 60, 60);;
    border-radius : 5px;
    padding: 10px 0px;
    width : 100%;
   text-align: center;
  }
`;

// conditional styling
function getPriorityClass(orderpriority) {
  if (orderpriority === 1) return "Hoch";
  else if (orderpriority === 0) return "Standard";

}
function getStatusClass(orderstatus) {
  if (orderstatus === 1) return "Neuer Auftrag";
  else if (orderstatus === 2) return "Wird bearbeitet";
  else if (orderstatus === 3) return "Abgeschlossen"
  return "low";
}
function updatestatus(update_status) {
  if (update_status === true) return  <i class="bi bi-envelope-exclamation-fill warninng"></i>;
  else if (update_status == 2) return <i class="bi bi-envelope-exclamation-fill abcd"></i>;
  else if (update_status === 0) return "";
}

export default function Dashboard() {

  const navigate = useNavigate()

  const customCell = (row, func2) => (
    <>
      <Link to={`/user/vieworder/${row.id}`}><i className="fa-regular fa-pen-to-square mx-1" ></i></Link>
      <i className="fa-solid fa-trash mx-1" onClick={() => func2(row.id)}></i>
    </>
  );

  const columns = [
    {
      name: '',
      cell: (row) => ( 
        <StyledCell className={updatestatus(row.update_status)}>
          {updatestatus(row.update_status)}
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
      name: 'Auftrag',
      selector: row => row.ordername,
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
      className: 'abc'
    },
    {
      name: 'Nummer',
      selector: row => row.id,
      sortable: true,
    },

    {
      name: 'Aktion',
      selector: row => customCell(row, click),
      sortable: true,
      responsive: 'sm',

    }
  ];

  const [error,] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const token = localStorage.getItem('token')
  const email = localStorage.getItem('email')
  const getorder = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/order/get`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setIsLoaded(true);
      // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      setData(res.data.data);
    }).catch((res) => {
      toast.error(res.response.data.message, { toastId: "unique-random-text-xAu9C9-" })
      setIsLoaded(true);
    });
  }

  useEffect(() => {
    getorder()
  }, []);

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
      getorder()
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }

  // nosubscribe product send to product page
  // const NoSubsproduct = () => {
  //   axios({
  //     method: "POST",
  //     url: `${process.env.REACT_APP_BASE_URL}/subscribe/products`,
  //     data:{email:email},
  //     headers: {
  //       'authorization': `Bearer ${token}`
  //     },
  //   }).then((res) => {
  //     if(res.data.expire == true){
  //       toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
  //         navigate("/products")
  //     }else{
  //         navigate("/user/neworder")
  //     }
      
  //   }).catch((res) => {
  //     toast.error(res.response.data.message)
  //   })
  // }

  const CustomEmptyState = () => (
    <div className="custom-empty-state p-3">
    Keine Einträge vorhanden
  </div>
  );
  if (error) {
    return <div>Error:  {error.message}</div>;
  } else if (!isLoaded) {
    return <img src={"https://i.gifer.com/VAyR.gif"} className="loader" alt="loaging" />
  }
  else {

    return (
      <>

        <div className="main-body dashboard" id="root1">
          <div className="vieworder">
            <div className="order-header d-flex div">
              <i className="bi bi-binoculars i fs-2"></i>
              <h3>Dashboard</h3>
              <Link to="/user/neworder" className="order-btn" ><i class="bi bi-plus-square pe-2"></i>Neuer Auftrag</Link>
              
            </div>

          </div>
          <div className="datatable dashboard" id="dashboarddata" >
            <DataTable
           
              columns={columns}
              data={data}
              pagination={true}
              paginationPerPage={20}
              paginationComponentOptions={{
                    rowsPerPageText: 'Anzahl/Seite:',
                  }}
                  paginationRowsPerPageOptions={[20,30,40]}
              noHeader={true}
              theme="solarized"
              responsive={true}
              onRowClicked={(row) => {
                navigate(`/user/vieworder/${row.id}`)
              }}
              noDataComponent={<CustomEmptyState/>}
              
            />
            
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

}


