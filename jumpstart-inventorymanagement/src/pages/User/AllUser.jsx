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
import { getAllUsersAPI } from "../../api/user";
import { AuthContext } from "../../context/auth-context";

const AllUser = () => {
  const [canvasShow, setCanvasShow] = useState(false);
  const handleCloseCanvas = () => setCanvasShow(false);
  const [modalShow, setModalShow] = useState(false);
  const handleCloseModal = () => setModalShow(false);
  const [users, setUsers] = useState(null);

  const { token } = useContext(AuthContext);

  const metaPageData = {
    title: "All Active Staffs",
    href: "all-users",
    header: ["Users", ""],
    icon: faUserGroup,
  };

  const actionsSupplierBody = () => {
    return (
      <>
        <div className="text-center">
          <a className="btn btn-primary" onClick={() => setCanvasShow(true)}>
            <FontAwesomeIcon icon={faPencil} /> Details
          </a>
        </div>
      </>
    );
  };

  useEffect(() => {
    getAllUsersAPI(token).then((response) => {
      setUsers(response.data);
    });
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

        <DataTable value={users} tableStyle={{ minWidth: "50rem" }}>
          <Column field="fullName" header="Full Name"></Column>
          <Column field="email" header="Email"></Column>
          <Column
            header="Country"
            body={(rowData) => (
              <>
                <span className="text-capitalize">{rowData.country}</span>
              </>
            )}
          ></Column>
          <Column field="userRole" header="Role"></Column>
          <Column header="actions" body={actionsSupplierBody}></Column>
        </DataTable>

        <Offcanvas show={canvasShow} onHide={handleCloseCanvas} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>User Details</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ width: "5000px !important" }}>
            <div className="row d-flex align-items-center">
              <img className="col-md-4" src={HeaderPic.defaultPicture} alt="picture" style={{ width: "130px", height: "102px", objectFit: "cover", borderRadius: "50%" }} />

              <div className="col-md">
                <h4>Asep Supriyadi</h4>
                <h3 className="my-1">asepsupyad789@gmail.com</h3>
                <p>Administrators</p>
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
              <button className="btn btn-danger">
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
      </Layout>

      <Modal show={modalShow} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Users</Modal.Title>
        </Modal.Header>
        <form>
          <Modal.Body>
            <h3 className="my-3">General Informations</h3>

            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Full Name
              </label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>

            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Email
              </label>
              <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
            </div>

            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Role
              </label>
              <select name="" id="" className="form-control">
                <option value="">-- choose category -- </option>
              </select>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button type="submit" class="btn btn-primary w-100" onClick={handleCloseModal}>
              Update User
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default AllUser;
