import { faSearch, faTrash, faUserPen, faUserPlus, faUsers } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import { errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";
import Swal from "sweetalert2";
import { deleteCustomerAPI, detailCustomerAPI, getAllCustomersAPI, updateCustomersAPI } from "../../api/customer";
import { Button, Modal } from "react-bootstrap";

const AllCustomers = () => {
  const { token, currentUser } = useContext(AuthContext);
  const [products, setProducts] = useState(null);
  const [listCustomers, setListCustomers] = useState(null);

  const [updateCustomerModal, setUpdateShow] = useState(false);
  const [customerDetails, setCustomerDetails] = useState(null);

  const metaPageData = {
    title: "All Customers",
    href: "all-customers",
    header: ["customers", ""],
    icon: faUsers,
  };

  const [formUpdateValue, setFormUpdateValue] = useState({
    customerFullName: null,
    phoneNumber: null,
    address: null,
    email: null,
  });

  const getAllCustomers = () => {
    getAllCustomersAPI(token)
      .then((response) => {
        setListCustomers(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  };

  const deleteCustomer = (customerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCustomerAPI(token, customerId)
          .then(() => {
            getAllCustomers();
            Swal.fire("Deleted!", "Customer has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Deleted!", "Failed to delete customer", "error");
          });
      }
    });
  };

  const handleChange = (e) => {
    setFormUpdateValue({ ...formUpdateValue, [e.target.name]: e.target.value });
  };

  const handleUpdateCustomer = (e, customerId) => {
    e.preventDefault();

    updateCustomersAPI(token, formUpdateValue, customerId)
      .then(() => {
        successReturnConfAlert("Success", "Customer updated successfully !").then(() => {
          getAllCustomers();
        });
      })
      .catch(() => {
        errorReturnConfAlert("Failed", "Failed to update customer !");
      });
  };

  const getDetailsCustomer = (customerId) => {
    detailCustomerAPI(token, customerId)
      .then((response) => {
        let data = response.data;
        setCustomerDetails(data);
        setFormUpdateValue({
          customerFullName: data.customerFullName,
          phoneNumber: data.phoneNumber,
          address: data.address,
          email: data.email,
        });
        setUpdateShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getAllCustomers();
  }, []);

  const actionsCustomerBody = (customerId) => {
    return (
      <>
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => getDetailsCustomer(customerId)}>
            <FontAwesomeIcon icon={faUserPen} /> Details
          </button>

          <span className="px-2 text-dark">|</span>
          <button className="btn btn-danger" onClick={() => deleteCustomer(customerId)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        <div className="d-flex justify-content-between my-4">
          <form action="" className="d-flex">
            <input type="text" className="form-control" placeholder="Search a customer" />
            <button className="btn btn-secondary">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <Link to={"/add-customers"}>
            <button className="btn btn-primary">
              New Customer <FontAwesomeIcon icon={faUserPlus} />
            </button>
          </Link>
        </div>
        <div className="row"></div>

        <DataTable value={listCustomers} tableStyle={{ minWidth: "50rem" }}>
          <Column field="customerFullName" header="Name"></Column>
          <Column field="phoneNumber" header="Phone Number"></Column>

          {currentUser.userRole != "STORE_ADMIN" && (
            <>
              <Column field="outlet.outletName" header="Outlet Name"></Column>
            </>
          )}

          <Column field="email" header="Email"></Column>
          <Column header="actions" body={(rowData) => actionsCustomerBody(rowData.customerId)}></Column>
        </DataTable>
      </Layout>

      {customerDetails !== null && (
        <Modal show={updateCustomerModal} onHide={() => setUpdateShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Customer</Modal.Title>
          </Modal.Header>
          <form onSubmit={(e) => handleUpdateCustomer(e, customerDetails.customerId)}>
            <Modal.Body>
              <div class="mb-3">
                <label for="customerFullName" class="form-label">
                  Customer Name
                </label>
                <input type="text" class="form-control" id="customerFullName" name="customerFullName" required value={formUpdateValue.customerFullName} onChange={handleChange} />
              </div>

              <div class="mb-3">
                <label for="phoneNumber" class="form-label">
                  Phone Number
                </label>
                <input type="text" class="form-control" id="phoneNumber" name="phoneNumber" required value={formUpdateValue.phoneNumber} onChange={handleChange} />
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">
                  Email
                </label>
                <input type="email" class="form-control" id="email" name="email" required value={formUpdateValue.email} onChange={handleChange} />
              </div>

              <div class="mb-3">
                <label for="address" class="form-label">
                  Address
                </label>
                <textarea name="address" id="address" rows="4" className="form-control" required value={formUpdateValue.address} onChange={handleChange}></textarea>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setUpdateShow(false)}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={() => setUpdateShow(false)}>
                Save
              </Button>
            </Modal.Footer>
          </form>
        </Modal>
      )}
    </>
  );
};

export default AllCustomers;
