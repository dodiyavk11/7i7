import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./customer.css"
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import { confirmAlert } from 'react-confirm-alert';

const StyledCell = styled.div`

&.Aktiv{
  background: #C0DE60;
  border-radius : 5px;
  padding: 0px;
  width : 100%;
  text-align : center;
  padding : 5px 0px;
  font-weight: 500;
  
}
&.Gekündigt{
  background:  #DE6060;
  border-radius : 5px;
  width : 100%;
  text-align : center;
  padding : 5px 0px;
  font-weight: 500;
}

`;
const Customers = () => {
  const getRole = localStorage.getItem("role")
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([])

  function membership(active_membership_status) {
    if (active_membership_status == 1) {
      return 'Aktiv'
    }
    else if (active_membership_status == 0) {
      return 'Gekündigt'
    }
  }

  const customCell = (row, func2) => (
    <>
      <Link to={`/admin/customer/updatecustomer/${row.id}`}><i className="fa-regular fa-pen-to-square mx-1" ></i></Link>
      <i className="fa-solid fa-trash mx-1" onClick={() => func2(row.id)}></i>
    </>
  );
  const columns = [
    {
      name: 'Bild ',
      selector: row => row.userImg ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${row.userImg}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }} /> : <div style={{ height: "50px", width: "50px", borderRadius: "50%", background: "grey" }}></div>,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.company,
      sortable: true,
    },
    {
      name: 'Nr.',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Mitarbeiter',
      selector: row => row.assign_emp_name.map(name => <React.Fragment>{name}<br /></React.Fragment>),
      sortable: true,
    },
    {
      name: 'Mitgliedschaft',
      cell: (row) => (
        <StyledCell className={membership(row.active_membership_status)}>
          {membership(row.active_membership_status)}
        </StyledCell>
      ),
      sortable: true,
    },
    {
      name: 'Aktion',
      selector: row => customCell(row, click),
      sortable: true,
      responsive: 'sm',
    }
  ];

  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const alluser = () => {
    axios({
      method: "POST",

      url: `${process.env.REACT_APP_BASE_URL}/user/all`,
      headers: {
        'authorization': `Bearer ${token}`
      }
    }).then((res) => {
      setIsLoaded(true);
      setData(res.data.data);
      // toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
    }).catch((res) => {
      setIsLoaded(true);
      toast.error(res.response.message)
    });
  }
  useEffect(() => {
    alluser()
  }, []);


  // delete cutomer
  const click = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'Ja',
          onClick: () => deletcustomer(id)
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const deletcustomer = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/user/remove/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      alluser()
    }).catch((res) => {
      toast.error(res.response.data.message)
    })
  }
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
        <div className="main-body" id="root1">
          <div className='customer-header div'>

            <i class="bi bi-people fs-2" ></i>
            <h3>Kunde</h3>
            <Link to="NewCustomer" className='order-btn'><i class="bi bi-people pe-1" ></i>Kunden anlegen </Link>
          </div>

          <div className=' datatable'>


            <div id="admin-dashboarddata">

              <DataTable
                columns={columns}
                data={data}
                noHeader={true}
                pagination
                paginationPerPage={20}
                paginationComponentOptions={{
                  rowsPerPageText: 'Anzahl/Seite:',
                }}
                paginationRowsPerPageOptions={[20,30,40]}
                noDataComponent={<CustomEmptyState />}
                theme="solarized"

                onRowClicked={(row) => {
                  if (getRole == 1) {
                    navigate(`/admin/customer/updatecustomer/${row.id}`)
                  } else if (getRole == 2) {

                  navigate(`/employee/customer/updatecustomer/${row.id}`)
                   }
                }}
              />
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
}
export default Customers;
