import { Link } from "react-router-dom";
import Layout from "../component/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartArrowDown, faDollar, faHome, faShop } from "@fortawesome/free-solid-svg-icons";
import { Table } from "react-bootstrap";

import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import BasicTables from "../component/Tables/BasicTables";
import { AuthContext } from "../context/auth-context";
import { getAllPendingTransactionAPI, getDashboardInfoAPI, getExpensesAndRevenueAPI } from "../api/dashboard";

const Dashboard = () => {
  const { isLoading } = useContext(AuthContext);
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);

  const [dashboardInfo, setDashboardInfo] = useState(null);
  const [listPendingTransaction, setListPendingTransaction] = useState(null);
  const [money, setMoney] = useState(null);

  useEffect(() => {
    getDashboardInfoAPI(token)
      .then((response) => {
        setDashboardInfo(response.data);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });

    getAllPendingTransactionAPI(token)
      .then((response) => {
        setListPendingTransaction(response.data);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });

    getExpensesAndRevenueAPI(token)
      .then((response) => {
        setMoney(response.data);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });
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
      {dashboardInfo != null && listPendingTransaction != null && money != null && (
        <>
          <Layout>
            {/* HEADING */}
            <div className="d-flex align-items-center justify-content-between">
              <h5>Dashboard</h5>

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
              <div className="col-lg-3">
                <div className="border border-dark  p-4 box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Outlets</h5>
                      <h6>{dashboardInfo.totalOutlet}</h6>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faShop} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="border border-dark  p-4 box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Products</h5>
                      <h6>{dashboardInfo.totalProduct}</h6>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faCartArrowDown} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="border border-dark  p-4 box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Expenses</h5>
                      <h6>{money.totalExpenses}</h6>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faDollar} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-3">
                <div className="border border-dark  p-4 box-shadow">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>Revenue</h5>
                      <h6>{money.totalRevenue}</h6>
                    </div>
                    <div>
                      <FontAwesomeIcon icon={faDollar} className="me-2 fs-3 bg-blue-primary p-2 border" style={{ color: "#33BFBF" }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* -=-=-=-=-=-=-=-=-=-=-=-= END OF CARD -=-=-=-=-=-=-=-=-=-=-=-=-=--== */}

            <div className="py border rounded p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <h5>Pending Transaction</h5>

                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faHome} className="me-2 bg-secondary-primary p-2 border" />
                  <h3>
                    <Link className="link" to={"/all-transactions"}>
                      Dashboard
                    </Link>
                  </h3>
                </div>
              </div>

              <div className="row min-scroll">
                <DataTable value={listPendingTransaction} dataKey="categoryId" tableStyle={{ minWidth: "50rem" }}>
                  <Column field="transactionCode" header="Transaction Code"></Column>
                  <Column field="dateTime" header="Date Created"></Column>
                  <Column field="customerName" header="Customer Name"></Column>
                </DataTable>
              </div>
            </div>
          </Layout>
        </>
      )}
    </>
  );
};

export default Dashboard;
