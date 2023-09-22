import { Link } from "react-router-dom";
import Layout from "../component/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";

import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import BasicTables from "../component/Tables/BasicTables";
import { AuthContext } from "../context/auth-context";

const Dashboard = () => {
  const { isLoading } = useContext(AuthContext);

  const [products, setProducts] = useState([]);

  const columns = [
    { field: "code", header: "Code" },
    { field: "name", header: "Name" },
    { field: "category", header: "Category" },
    { field: "quantity", header: "Quantity" },
  ];

  useEffect(() => {
    setProducts([
      {
        code: 1,
        name: "Asep",
        category: "Shirt",
        quantity: 1,
      },
    ]);
  }, []);

  const actionsBody = () => {
    return (
      <>
        <a href="">Edit</a> |<a href="">Delete</a>
      </>
    );
  };

  return (
    <>
      <Layout>
        {/* HEADING */}
        <div className="d-flex align-items-center justify-content-between">
          <h5>Default Dashboard</h5>

          <div className="d-flex align-items-center">
            <FontAwesomeIcon icon={faHome} className="me-2 bg-secondary-primary p-2 border" />
            <h3>
              <Link className="link">Dashboard</Link>
            </h3>
          </div>
        </div>
        {/* HEADING */}

        {/* -=-=-=-=-=-=-=-=-=-=-=-= CARD -=-=-=-=-=-=-=-=-=-=-=-=-=--== */}
        <div className="row my-4">
          <div className="col-lg-4">
            <div className="border border-dark  p-4 box-shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Users</h5>
                  <h6>123</h6>
                </div>
                <div>
                  <FontAwesomeIcon icon={faHome} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="border border-dark  p-4 box-shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Users</h5>
                  <h6>123</h6>
                </div>
                <div>
                  <FontAwesomeIcon icon={faHome} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="border border-dark  p-4 box-shadow">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Total Users</h5>
                  <h6>123</h6>
                </div>
                <div>
                  <FontAwesomeIcon icon={faHome} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* -=-=-=-=-=-=-=-=-=-=-=-= END OF CARD -=-=-=-=-=-=-=-=-=-=-=-=-=--== */}

        <div className="py border rounded p-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5>Default Dashboard</h5>

            <div className="d-flex align-items-center">
              <FontAwesomeIcon icon={faHome} className="me-2 bg-secondary-primary p-2 border" />
              <h3>
                <Link className="link">Dashboard</Link>
              </h3>
            </div>
          </div>

          <BasicTables data={products} columns={columns} />
        </div>
      </Layout>
    </>
  );
};

export default Dashboard;
