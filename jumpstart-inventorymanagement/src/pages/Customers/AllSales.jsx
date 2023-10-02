import { faCartPlus, faDollar, faPencil, faSearch, faTrash, faTruck, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { deleteSupplierAPI, getAllSupplierAPI } from "../../api/supplier";
import { AuthContext } from "../../context/auth-context";
import { returnConfirm, successReturnConfAlert } from "../../alert/sweetAlert";
import Swal from "sweetalert2";
import { approveBillsAPI, getAllDetailsItem, getAllPurchasesAPI, getPurchasesDetailsAPI, makePaymentAPI, receiveGoodsAPI } from "../../api/purchases";
import { Button, ListGroup, Modal } from "react-bootstrap";
import Bayar from "../../component/Bayar";
import { deliveryTransactionAPI, getAllTransactionAPI, getTransactionDetailsAPI, getTransactionItemsAPI, processTransactionAPI } from "../../api/transaction";

const AllSales = () => {
  const { token, currentUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [itemsDetails, setItemsDetails] = useState(null);
  const [listTransaction, setListTransaction] = useState(null);
  const [arrivedConfirmModals, setArrivedConfirmModal] = useState(false);

  // -=-=-=-=-= ARRIVED STATE -=-=-=-=-=-=-=--=-=
  const [deliverInputs, setDeliverInputs] = useState(null);
  const [componentLoading, setComponentLoading] = useState(false);

  const metaPageData = {
    title: "All Transaction",
    href: "all-sales",
    header: ["Transaction", ""],
    icon: faDollar,
  };

  const getAllTransaction = () => {
    getAllTransactionAPI(token)
      .then((response) => {
        setListTransaction(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    getAllTransaction();
  }, []);

  const handleShowTransactionDetailsModals = (transactionId) => {
    getTransactionDetailsAPI(token, transactionId)
      .then((response) => {
        setTransactionDetails(response.data);
      })
      .catch((err) => {
        alert("errror occured");
        console.log(err);
      });

    getTransactionItemsAPI(token, transactionId)
      .then((response) => {
        setItemsDetails(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        alert("errror occured");
        console.log(err);
      });

    setArrivedConfirmModal(true);
  };

  const handleProsessTransaction = (transactionId) => {
    setComponentLoading(true);
    setArrivedConfirmModal(false);
    processTransactionAPI(token, transactionId)
      .then(() => {
        setComponentLoading(false);
        successReturnConfAlert("Process !", "Transaction proceed by outlet ").then(() => {
          getAllTransaction();
        });
      })
      .catch((err) => {
        setComponentLoading(false);
        alert("error occured ! ");
      });
  };

  const handleDeliveryProduct = (e, purchaseId) => {
    e.preventDefault();

    let data = {
      transactionId: purchaseId,
      deliveryDate: deliverInputs,
    };

    console.log(data);
    setComponentLoading(true);
    setArrivedConfirmModal(false);
    deliveryTransactionAPI(token, data)
      .then(() => {
        setComponentLoading(false);
        successReturnConfAlert("Success !", "Product start to deliver !").then(() => {
          getAllTransaction();
        });
      })
      .catch((err) => {
        setComponentLoading(false);
        alert("error occured ! ");
      });
  };

  const actionsSupplierBody = (transactionId) => {
    return (
      <>
        <div className="text-center">
          <button className="btn btn-primary" onClick={() => handleShowTransactionDetailsModals(transactionId)}>
            <FontAwesomeIcon icon={faTruck} /> Details
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      {!componentLoading && (
        <>
          <Layout>
            <DashHeading data={metaPageData} />
            <div className="d-flex justify-content-between my-4">
              <Link to={"/add-transaction"}>
                <button className="btn btn-primary">
                  Add New Transaction <FontAwesomeIcon icon={faDollar} />
                </button>
              </Link>
            </div>

            <DataTable value={listTransaction} tableStyle={{ minWidth: "50rem" }}>
              <Column field="transactionCode" header="Bills Code"></Column>
              <Column field="staffCode" header="Staff"></Column>
              <Column field="customerCode" header="Customer"></Column>
              <Column field="dateTime" header="Date Created"></Column>
              <Column field="transactionStatus" header="Status"></Column>
              <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.transactionId)}></Column>
            </DataTable>
          </Layout>
        </>
      )}

      {transactionDetails !== null && (
        <>
          <Modal show={arrivedConfirmModals} size="lg" onHide={() => setArrivedConfirmModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Detail Transaction</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="text-center py-4">
                <h2>Jumpstart Bills</h2>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Outlet Info</h3>
                <ListGroup>
                  <ListGroup.Item>Outlet Name : {transactionDetails.outlet.outletName}</ListGroup.Item>
                  <ListGroup.Item>Outlet Code : {transactionDetails.outlet.outletCode}</ListGroup.Item>
                  <ListGroup.Item>Outlet Address : {transactionDetails.outlet.outletAddress}</ListGroup.Item>
                </ListGroup>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Customer Info</h3>
                <ListGroup>
                  <ListGroup.Item>Customer Name : {transactionDetails.customerName}</ListGroup.Item>
                  <ListGroup.Item>Customer Code : {transactionDetails.customerCode}</ListGroup.Item>
                </ListGroup>
              </div>

              <div className="my-5">
                <h3 className="mb-3">Items Info</h3>
                <div className="row min-scroll">
                  <DataTable value={itemsDetails} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="productName" header="Product Name"></Column>
                    <Column field="quantity" header="Amount"></Column>
                  </DataTable>
                </div>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Bills Info</h3>
                <ListGroup>
                  <ListGroup.Item>
                    Total Amount : <b>${transactionDetails.totalAmount}</b>
                  </ListGroup.Item>
                  {transactionDetails.transactionStatus === "DELIVER" && (
                    <>
                      <ListGroup.Item>Delievered at : {transactionDetails.deliverStartDate}</ListGroup.Item>
                    </>
                  )}
                  {transactionDetails.transactionStatus === "COMPLETED" && (
                    <>
                      <ListGroup.Item>Received at : {transactionDetails.receiveDate}</ListGroup.Item>
                    </>
                  )}
                  <ListGroup.Item>Status : {transactionDetails.transactionStatus}</ListGroup.Item>

                  {transactionDetails.transactionStatus === "PROCESS" && (
                    <>
                      <ListGroup.Item>Status info : Wait for the goods to be packed and ready to deliver</ListGroup.Item>
                    </>
                  )}
                  {transactionDetails.transactionStatus === "DELIVER" && (
                    <>
                      <ListGroup.Item>Status info : Wait for the goods to arrived at customer</ListGroup.Item>
                    </>
                  )}
                  {transactionDetails.transactionStatus === "COMPLETED" && (
                    <>
                      <ListGroup.Item>Status info : Customer has payed this Transaction</ListGroup.Item>
                    </>
                  )}
                </ListGroup>
              </div>

              {transactionDetails.transactionStatus == "PROCESS" && (
                <>
                  <div className="my-3">
                    <h3 className="mb-3">Inputs</h3>

                    <form onSubmit={(e) => handleDeliveryProduct(e, transactionDetails.transactionId)} method="POST">
                      <div className="mb-3">
                        <label htmlFor="deliverInputs" className="form-label">
                          Delivery Date
                        </label>
                        <input type="date" name="deliverInputs" id="deliverInputs" className="form-control" value={deliverInputs} onChange={(e) => setDeliverInputs(e.target.value)} required />
                      </div>

                      <button className="btn btn-success w-100">Submit</button>
                    </form>
                  </div>
                </>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setArrivedConfirmModal(false)}>
                Close
              </Button>

              {currentUser.userRole == "STORE_ADMIN" && (
                <>
                  {transactionDetails.transactionStatus == "PENDING" && (
                    <>
                      <Button variant="success" onClick={() => handleProsessTransaction(transactionDetails.transactionId)}>
                        Process Transaction
                      </Button>
                    </>
                  )}
                </>
              )}
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default AllSales;
