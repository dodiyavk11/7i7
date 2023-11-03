import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./employee.css"
import DataTable, { createTheme } from 'react-data-table-component';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';

const Employees = () => {

  const customCell = (row, func2) => (
    <>
      <Link to={`/admin/employee/updateemployee/${row.id}`}><i className="fa-regular fa-pen-to-square mx-1" ></i></Link>
      <i className="fa-solid fa-trash mx-1" onClick={() => func2(row.id)}></i>
    </>
  );
  const columns = [
    {
      name: 'Bild ',
      selector: row =>row.userImg ? <img src={`${process.env.REACT_APP_IMG_URL}/assets/profilepic/${row.userImg}`} style={{ height: "50px", width: "50px", borderRadius: "50%" }}/> : <div style={{ height: "50px", width: "50px", borderRadius: "50%" , background:"grey"}}></div> ,
      sortable: true,
    },
    {
      name: 'Name',
      selector: row => row.fname + " " + row.lname,
      sortable: true,
    },
    {
      name: 'Nr.',
      selector: row => row.id,
      sortable: true,
    },
    {
      name: 'Neu',
      selector: row => row.allOrderStatus[1],
      sortable: true,
    },
    {
      name: 'Dran',
      selector: row => row.allOrderStatus[2],
      sortable: true,
    },
    {
      name: 'Done',
      selector: row => row.allOrderStatus[3],
      sortable: true,
    },
    {
      name: 'Kunden',
      selector: row => row.customers,
      sortable: true,
    },
    {
      name: 'Aktion',
      selector: row => customCell(row, click),
      sortable: true,
    }
  ];

  const getRole = localStorage.getItem("role")
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token')
  const [data, setData] = useState([])

  const allemp = () => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/employee/get/all`,
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
    allemp();
  }, []);

  // delete employee
  const click = (id) => {

    confirmAlert({
      title: 'Confirm to delete',
      message: 'Möchten Sie diesen Datensatz löschen?',
      buttons: [
        {
          label: 'ja',
          onClick: () => deletemp(id)
        },
        {
          label: 'Nein',
        }
      ]
    });
  }

  const deletemp = (id) => {
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_BASE_URL}/user/remove/${id}`,
      headers: {
        'authorization': `Bearer ${token}`
      },
    }).then((res) => {
      toast.success(res.data.message, { toastId: "unique-random-text-xAu9C9-" })
      allemp()

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
        <div className="main-body "  id="root1">
          <div className='employee-header d-flex div'>
            <i class="bi bi-person-square fs-2"></i>

            <h3>Mitarbeiter</h3>
            <Link to="NewEmployee" className='order-btn'><i class="bi bi-person-square pe-1"></i>Mitarbeiter anlegen</Link>
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
                noDataComponent={<CustomEmptyState/>}
                theme="solarized"
                onRowClicked={(row) => {
                    if (getRole == 1) {
                      navigate(`/admin/employee/updateemployee/${row.id}`)
                    } else if (getRole == 2) { 

                    navigate(`/employee/employee/updateemployee/${row.id}`)
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
export default Employees;
