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

const AllSales = () => {
  const { token, currentUser, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [itemsDetails, setItemsDetails] = useState(null);
  const [listPurchases, setListPurchases] = useState(null);
  const [arrivedConfirmModals, setArrivedConfirmModal] = useState(false);

  // -=-=-=-=-= ARRIVED STATE -=-=-=-=-=-=-=--=-=
  const [arrivedDateInputs, setArrivedDateInputs] = useState(null);

  const metaPageData = {
    title: "All Transaction",
    href: "all-sales",
    header: ["Transaction", ""],
    icon: faDollar,
  };

  const getAllTransaction = () => {
    getAllPurchasesAPI(token)
      .then((response) => {
        setListPurchases(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  };

  useEffect(() => {
    getAllPurchases();
  }, []);

  // const handleShowPurchaseDetailsModals = (purchaseId) => {
  //   getPurchasesDetailsAPI(token, purchaseId)
  //     .then((response) => {
  //       setPurchaseDetails(response.data);
  //     })
  //     .catch((err) => {
  //       alert("errror occured");
  //       console.log(err);
  //     });

  //   getAllDetailsItem(token, purchaseId)
  //     .then((response) => {
  //       setItemsDetails(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((err) => {
  //       alert("errror occured");
  //       console.log(err);
  //     });

  //   setArrivedConfirmModal(true);
  // };

  // const handleApproveBills = (purchaseId) => {
  //   let data = new FormData();
  //   data.append("purchaseId", purchaseId);

  //   approveBillsAPI(token, data)
  //     .then(() => {
  //       successReturnConfAlert("Approved !", "Bills has approved by admin ").then(() => {
  //         getAllPurchases();
  //         setArrivedConfirmModal(false);
  //       });
  //     })
  //     .catch((err) => {
  //       alert("error occured ! ");
  //     });
  // };

  // const handleReceiveGoods = (e, purchaseId) => {
  //   e.preventDefault();

  //   let data = {
  //     purchaseId: purchaseId,
  //     arrivedDate: arrivedDateInputs,
  //   };

  //   receiveGoodsAPI(token, data)
  //     .then(() => {
  //       successReturnConfAlert("Success !", "Stock has been updated !").then(() => {
  //         getAllPurchases();
  //         setArrivedConfirmModal(false);
  //       });
  //     })
  //     .catch((err) => {
  //       alert("error occured ! ");
  //     });
  // };

  // const handlePayBills = (purchaseId) => {
  //   makePaymentAPI(token, purchaseId)
  //     .then(() => {
  //       successReturnConfAlert("Success", "Bills payed successfully !").then(() => {
  //         getAllPurchases();
  //         setArrivedConfirmModal(false);
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  // const actionsSupplierBody = (purchasesStatus, purchaseId) => {
  //   return (
  //     <>
  //       <div className="text-center">
  //         <button className="btn btn-primary" onClick={() => handleShowPurchaseDetailsModals(purchaseId)}>
  //           <FontAwesomeIcon icon={faTruck} /> Details
  //         </button>
  //       </div>
  //     </>
  //   );
  // };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        <div className="d-flex justify-content-between my-4">
          <Link to={"/add-sales"}>
            <button className="btn btn-primary">
              Add New Transaction <FontAwesomeIcon icon={faDollar} />
            </button>
          </Link>
        </div>

        {/* <DataTable value={listPurchases} tableStyle={{ minWidth: "50rem" }}>
          <Column field="purchaseCode" header="Bills Code"></Column>
          <Column field="staffCode" header="Staff"></Column>
          <Column field="supplierCode" header="Supplier"></Column>
          <Column field="dateTime" header="Date Created"></Column>
          <Column field="purchasesStatus" header="Status"></Column>
          <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.purchasesStatus, rowData.purchasesId)}></Column>
        </DataTable> */}
      </Layout>

      {/* {purchaseDetails !== null && (
        <>
          <Modal show={arrivedConfirmModals} size="lg" onHide={() => setArrivedConfirmModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Detail Bills</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="text-center py-4">
                <h2>Jumpstart Bills</h2>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Outlet Info</h3>
                <ListGroup>
                  <ListGroup.Item>Outlet Name : {purchaseDetails.outlet.outletName}</ListGroup.Item>
                  <ListGroup.Item>Outlet Code : {purchaseDetails.outlet.outletCode}</ListGroup.Item>
                  <ListGroup.Item>Outlet Address : {purchaseDetails.outlet.outletAddress}</ListGroup.Item>
                </ListGroup>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Supplier Info</h3>
                <ListGroup>
                  <ListGroup.Item>Supplier Name : {purchaseDetails.supplierName}</ListGroup.Item>
                  <ListGroup.Item>Supplier Code : {purchaseDetails.supplierCode}</ListGroup.Item>
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
                    Total Amount : <b>${purchaseDetails.totalAmount}</b>
                  </ListGroup.Item>
                  {purchaseDetails.purchasesStatus === "ARRIVED" && (
                    <>
                      <ListGroup.Item>Arrived at : {purchaseDetails.receivedDate}</ListGroup.Item>
                    </>
                  )}
                  <ListGroup.Item>Status : {purchaseDetails.purchasesStatus}</ListGroup.Item>
                  {purchaseDetails.purchasesStatus === "PENDING" && (
                    <>
                      <ListGroup.Item>Status info : Waiting for admin approval</ListGroup.Item>
                    </>
                  )}
                  {purchaseDetails.purchasesStatus === "APPROVED" && (
                    <>
                      <ListGroup.Item>Status info : Wait for the goods to arrive at the outlet</ListGroup.Item>
                    </>
                  )}
                  {purchaseDetails.purchasesStatus === "ARRIVED" && (
                    <>
                      <ListGroup.Item>Status info : Waiting for admin to make payment</ListGroup.Item>
                    </>
                  )}
                </ListGroup>
              </div>

              {currentUser.userRole == "STORE_ADMIN" && (
                <>
                  {purchaseDetails.purchasesStatus == "APPROVED" && (
                    <>
                      <div className="my-3">
                        <h3 className="mb-3">Inputs</h3>

                        <form onSubmit={(e) => handleReceiveGoods(e, purchaseDetails.purchasesId)} method="POST">
                          <div className="mb-3">
                            <label htmlFor="arrivedDateInputs" className="form-label">
                              Arrived at ?
                            </label>
                            <input type="date" name="arrivedDateInputs" id="arrivedDateInputs" className="form-control" value={arrivedDateInputs} onChange={(e) => setArrivedDateInputs(e.target.value)} required />
                          </div>

                          <button className="btn btn-success w-100">Submit</button>
                        </form>
                      </div>
                    </>
                  )}
                </>
              )}

              {currentUser.userRole == "SUPER_ADMIN" && (
                <>
                  {purchaseDetails.purchasesStatus == "ARRIVED" && (
                    <>
                      <div className="my-3">
                        <h3 className="mb-3">Make a payment</h3>
                        <Bayar totalPrice={purchaseDetails.totalAmount} purchaseId={purchaseDetails.purchasesId} handleReceive={() => handlePayBills(purchaseDetails.purchasesId)}></Bayar>
                      </div>
                    </>
                  )}
                </>
              )}
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setArrivedConfirmModal(false)}>
                Close
              </Button>

              {currentUser.userRole == "SUPER_ADMIN" && (
                <>
                  {purchaseDetails.purchasesStatus == "PENDING" && (
                    <>
                      <Button variant="success" onClick={() => handleApproveBills(purchaseDetails.purchasesId)}>
                        Approve Bills
                      </Button>
                    </>
                  )}
                </>
              )}
            </Modal.Footer>
          </Modal>
        </>
      )} */}
    </>
  );
};

export default AllSales;
