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
import { getAllDetailsItem, getAllPurchasesAPI, getPurchasesDetailsAPI, receiveGoodsAPI } from "../../api/purchases";
import { Button, ListGroup, Modal } from "react-bootstrap";
import Bayar from "../../component/Bayar";

const AllBills = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState(null);
  const [purchaseDetails, setPurchaseDetails] = useState(null);
  const [itemsDetails, setItemsDetails] = useState(null);
  const [listPurchases, setListPurchases] = useState(null);
  const [arrivedConfirmModals, setArrivedConfirmModal] = useState(false);

  const metaPageData = {
    title: "All Purchases",
    href: "all-purchases",
    header: ["purchases", ""],
    icon: faTruck,
  };

  const getAllPurchases = () => {
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

  const handleShowPurchaseDetailsModals = (purchaseId) => {
    getPurchasesDetailsAPI(token, purchaseId)
      .then((response) => {
        setPurchaseDetails(response.data);
      })
      .catch((err) => {
        alert("errror occured");
        console.log(err);
      });

    getAllDetailsItem(token, purchaseId)
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

  const handleReceiveGoods = (purchaseId) => {
    receiveGoodsAPI(token, purchaseId)
      .then(() => {
        successReturnConfAlert("Success", "Bills status updated !").then(() => {
          getAllPurchases();
          setArrivedConfirmModal(false);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const actionsSupplierBody = (purchasesStatus, purchaseId) => {
    return (
      <>
        {purchasesStatus === "PENDING" && (
          <div className="text-center">
            <button className="btn btn-primary" onClick={() => handleShowPurchaseDetailsModals(purchaseId)}>
              <FontAwesomeIcon icon={faTruck} /> Is Arrived ?
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        <div className="d-flex justify-content-between my-4">
          <Link to={"/add-bills"}>
            <button className="btn btn-primary">
              Add New Bills <FontAwesomeIcon icon={faDollar} />
            </button>
          </Link>
        </div>

        <DataTable value={listPurchases} tableStyle={{ minWidth: "50rem" }}>
          <Column field="purchaseCode" header="Bills Code"></Column>
          <Column field="staffCode" header="Staff"></Column>
          <Column field="supplierCode" header="Supplier"></Column>
          <Column field="dateTime" header="Date Created"></Column>
          <Column field="purchasesStatus" header="Status"></Column>
          <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.purchasesStatus, rowData.purchasesId)}></Column>
        </DataTable>
      </Layout>

      {purchaseDetails !== null && (
        <>
          <Modal show={arrivedConfirmModals} size="lg" onHide={() => setArrivedConfirmModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Update Amount</Modal.Title>
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
                </ListGroup>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setArrivedConfirmModal(false)}>
                Close
              </Button>

              {/* <Button variant="primary" onClick={() => handleReceiveGoods(purchaseDetails.purchasesId)}>
                Receive Product ?
              </Button> */}

              <Bayar totalPrice={purchaseDetails.totalAmount} purchaseId={purchaseDetails.purchasesId} handleReceive={() => handleReceiveGoods(purchaseDetails.purchasesId)}></Bayar>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default AllBills;
