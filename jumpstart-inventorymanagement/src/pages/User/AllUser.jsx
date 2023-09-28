import { faPencil, faSearch, faTrash, faUserGroup, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { Button, Modal, Offcanvas, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { HeaderPic } from "../../assets/images/_images";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { deleteStaffAdminAPI, getAllUsersAPI, getStaffDetailsAPI, updateUserAdminAPI } from "../../api/user";
import { AuthContext } from "../../context/auth-context";
import Swal from "sweetalert2";
import { successReturnConfAlert } from "../../alert/sweetAlert";

const AllUser = () => {
  const [canvasShow, setCanvasShow] = useState(false);
  const handleCloseCanvas = () => setCanvasShow(false);
  const [modalShow, setModalShow] = useState(false);
  const handleCloseModal = () => setModalShow(false);
  const [users, setUsers] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  const [formValue, setformValue] = useState({
    email: "",
    fullName: "",
    phoneNumber: "",
    address: "",
  });

  const { token } = useContext(AuthContext);

  const metaPageData = {
    title: "All Active Staffs",
    href: "all-users",
    header: ["Users", ""],
    icon: faUserGroup,
  };

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const getAllUser = () => {
    getAllUsersAPI(token).then((response) => {
      setUsers(response.data);
    });
  };

  const handleDeleteUser = (staffId) => {
    setCanvasShow(false);
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
        deleteStaffAdminAPI(token, staffId)
          .then(() => {
            getAllUser();
            Swal.fire("Success!", "Staff has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Deleted!", "Failed to delete staff", "error");
          });
      }
    });
  };

  const handleUserDetails = (staffId) => {
    getStaffDetailsAPI(token, staffId)
      .then((response) => {
        let data = response.data;
        setUserDetails(data);
        setformValue({
          email: data.email,
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          address: data.address,
        });

        setCanvasShow(true);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });
  };

  const handleUpdateStaff = (event, staffId) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("fullName", formValue.fullName);
    formData.append("email", formValue.email);
    formData.append("phoneNumber", formValue.email);
    formData.append("address", formValue.address);
    updateUserAdminAPI(token, formData, staffId)
      .then(() => {
        setModalShow(false);
        successReturnConfAlert("Success", "User updated successfully");
        getAllUser(token);
      })
      .catch((err) => {
        setModalShow(false);
        alert("Error occured");
        console.log(err);
      });
  };

  const actionsSupplierBody = (staffId) => {
    return (
      <>
        <div className="text-center">
          <a className="btn btn-primary" onClick={() => handleUserDetails(staffId)}>
            <FontAwesomeIcon icon={faPencil} /> Details
          </a>
        </div>
      </>
    );
  };

  useEffect(() => {
    getAllUser();
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        <div className="d-flex justify-content-between my-4">
          <form action="" className="d-flex">
            <input type="text" className="form-control" placeholder="Search a Staff" />
            <button className="btn btn-secondary">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <Link to={"/add-user"}>
            <button className="btn btn-primary">
              New Staff Account <FontAwesomeIcon icon={faUserPlus} />
            </button>
          </Link>
        </div>

        <div className="row min-scroll">
          <DataTable value={users} tableStyle={{ maxWidth: "100%" }}>
            <Column field="fullName" header="Full Name"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="userRole" header="Role"></Column>
            <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.userId)}></Column>
          </DataTable>
        </div>

        {/* -=-=-=-=-=-=-=-= USER DETAILS -=-=-=-=-=-=-=-=-=-=  */}
        {userDetails !== null && (
          <>
            <Offcanvas show={canvasShow} onHide={handleCloseCanvas} placement="end">
              <Offcanvas.Header closeButton>
                <Offcanvas.Title>User Details</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body style={{ width: "5000px !important" }}>
                <div className="row d-flex align-items-center">
                  <img className="col-md-4" src={HeaderPic.defaultPicture} alt="picture" style={{ width: "130px", height: "102px", objectFit: "cover", borderRadius: "50%" }} />

                  <div className="col-md">
                    <h4>{userDetails.fullName}</h4>
                    <h3 className="my-1">{userDetails.email}</h3>
                    <p>{userDetails.userRole}</p>
                  </div>

                  <div className="col-md">
                    <h3 className="my-4">Contacts</h3>
                    <p>PhoneNumber : {userDetails.phoneNumber}</p>
                    <p className="my-3">Address : </p>
                    <textarea name="" id="" cols="30" rows="4" className="form-control" disabled value={userDetails.address}></textarea>
                  </div>
                </div>

                <div>
                  <h3 className="my-4">Actions</h3>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setModalShow(true);
                      setCanvasShow(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faPencil} /> Edit Users
                  </button>
                  <span className="p-2">|</span>
                  <button className="btn btn-danger" onClick={() => handleDeleteUser(userDetails.userId)}>
                    <FontAwesomeIcon icon={faTrash} />
                    Delete Users
                  </button>
                </div>

                <h3 className="my-4">Recent Activities</h3>

                <div class="table__responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th scope="col">datetime</th>
                        <th scope="col">Activities</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">1</th>
                        <td>Markdsfasasdf</td>
                      </tr>
                      <tr>
                        <th scope="row">1</th>
                        <td>Markdsfasasdf</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Offcanvas.Body>
            </Offcanvas>

            <Modal show={modalShow} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Users</Modal.Title>
              </Modal.Header>
              <form onSubmit={(event) => handleUpdateStaff(event, userDetails.userId)}>
                <Modal.Body>
                  <h3 className="my-3">General Informations</h3>

                  <div class="mb-3">
                    <label for="fullName" class="form-label">
                      Full Name
                    </label>
                    <input type="text" class="form-control" name="fullName" id="fullName" aria-describedby="emailHelp" value={formValue.fullName} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">
                      Email
                    </label>
                    <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" value={formValue.email} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="phoneNumber" class="form-label">
                      Phone Number
                    </label>
                    <input type="text" class="form-control" id="phoneNumber" name="phoneNumber" aria-describedby="emailHelp" value={formValue.phoneNumber} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="address" class="form-label">
                      Address
                    </label>
                    <textarea name="address" id="address" cols="30" rows="4" className="form-control" value={formValue.address} onChange={handleChange}></textarea>
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <button type="submit" class="btn btn-primary w-100">
                    Update User
                  </button>
                </Modal.Footer>
              </form>
            </Modal>
          </>
        )}

        {/* -=-=-=-=-=-=-=-= END OF USER DETAILS -=-=-=-=-=-=-=-=-=-=  */}
      </Layout>
    </>
  );
};

export default AllUser;
