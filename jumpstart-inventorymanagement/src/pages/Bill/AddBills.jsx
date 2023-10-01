import { faCartPlus, faDollar, faPencil, faPlus, faTrash, faTruck } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { getAllAvailableStaffsAPI } from "../../api/user";
import { AuthContext } from "../../context/auth-context";
import { addNewOutletAPI, getAllOutlets } from "../../api/outlet";
import { errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";
import { Button, ListGroup, Modal } from "react-bootstrap";
import { getAllSupplierAPI } from "../../api/supplier";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { findAllBySupplierIdAPI } from "../../api/product";
import { addNewBillsAPI, confirmPurchasesAPI } from "../../api/purchases";

const AddBills = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // -=-=-=-==-=-=-=--=  MODALS CONFIG -=-=-=-==-=-=-=-=-=--=
  const [configModal, setConfigModal] = useState(true);
  const [addItemsModal, setAddItemsModal] = useState(false);
  const [updateItemsModal, setUpdateItemsModal] = useState(false);
  const [confirmBillsModal, setConfirmBillsModal] = useState(false);
  const [cache, setCache] = useState(null);
  // --=-=-=-=-=--=-=-=- END OF MODALS CONFIG -=-=-=-=-=-=-==

  // -=-=-=-=-=-=-= CONFIG STATE --=-=-=-=-=-=-=
  const [config, setConfig] = useState({
    supplier: null,
    outlet: null,
  });
  const [outletConf, setOutletCond] = useState(null);
  const [supplierConf, setSupplierConf] = useState(null);
  const [billsConfirmDetails, setBillsConfirmDetails] = useState(null);
  // -=-=-=-=-=-=-= END OF CONFIG STATE --=-=-=-=-=-=-=

  // -=-=-=-=-=-=-=-= LIST UNTUK CONFIG _=-=-=-=-
  const [listSupplier, setListSupplier] = useState(null);
  const [listOutlet, setListOutlet] = useState(null);
  //  -=-=-=-=-=-=-= =-=-=-= LIST UNTUK CONFIG -=-=-=-==-=-

  //   -=-=-=-=-=-=-=-=-=-=-=- ITEMS STATE -=-=-=-=-=-=-=-=-=-=-=
  const [items, setItems] = useState({
    itemsId: 0,
    productId: null,
    productName: null,
    amount: null,
  });

  const [itemsCount, setItemsCount] = useState(1);
  const [listItems, setListItems] = useState([]);
  const [listSupplierProduct, setListSupplierProduct] = useState([]);

  const [updatedAmount, setUpdatedAmount] = useState(null);
  const [updatedItemsId, setUpdatedItemsId] = useState(null);

  const getAllListProductSupplier = () => {
    findAllBySupplierIdAPI(token, config.supplier.supplierId)
      .then((response) => {
        if (response.data.length === 0) {
          errorReturnConfAlert("Failed !", "This supplier doesn't have any product to supply yet !");
          return navigate("../all-purchases");
        }
        setListSupplierProduct(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleShowAddItemsModal = () => {
    console.log(config.supplier.supplierId);
    setItems({
      productId: listSupplierProduct[0].productId,
    });
    setAddItemsModal(true);
  };

  const addIndex = () => {
    setItemsCount(itemsCount + 1);
  };

  const handleItemsChange = (event) => {
    setItems({
      ...items,
      [event.target.name]: event.target.value,
    });
  };
  const handleItemsSubmit = (event) => {
    event.preventDefault();

    if (amount == 0) {
      return errorReturnConfAlert("Failed", "Amount at least must greater than 0 !");
    }

    addIndex();
    const product = listSupplierProduct.find((value) => value.productId == items.productId);

    let newDataItems = {
      itemsId: itemsCount,
      productId: items.productId,
      productName: product.productName,
      amount: items.amount,
    };

    deleteOption();

    setListItems([...listItems, newDataItems]);
    setItems({
      itemsId: 0,
      productName: null,
      productId: null,
      amount: null,
    });

    setAddItemsModal(false);
  };

  const deleteOption = () => {
    let deleteOption = listSupplierProduct.filter((item) => item.productId != items.productId);
    setListSupplierProduct(deleteOption);
  };

  const addMoreOption = (itemsId) => {
    findAllBySupplierIdAPI(token, config.supplier.supplierId).then((response) => {
      setListSupplierProduct([...listSupplierProduct, response.data.filter((item) => item.productId == itemsId)[0]]);
    });
  };

  const handleDeleteItems = (itemsId) => {
    const updatedItems = listItems.filter((item) => item.itemsId != itemsId);
    const addOption = listItems.filter((item) => item.itemsId == itemsId)[0];
    addMoreOption(addOption.productId);
    setListItems(updatedItems);
  };

  const handleUpdateItems = (itemsId) => {
    const updatedItems = listItems.filter((item) => item.itemsId === itemsId)[0];
    setUpdatedAmount(updatedItems.amount);
    setUpdatedItemsId(updatedItems.itemsId);
    setUpdateItemsModal(true);
  };

  const handleSubmitUpdatedItems = (e, itemsId) => {
    e.preventDefault();
    const updatedItems = [...listItems];
    const itemToUpdate = updatedItems.find((value) => value.itemsId === itemsId);
    itemToUpdate.amount = updatedAmount;
    setListItems(updatedItems);

    setUpdatedAmount(null);
    setUpdatedItemsId(null);
    setUpdateItemsModal(false);
  };

  //   -=-=-=-=-=-=-=-=-=-=-=- ITEMS STATE -=-=-=-=-=-=-=-=-=-=-=

  const metaPageData = {
    title: "Add New Bills",
    href: "all-purchases",
    header: ["purchases ", " / add new bills"],
    icon: faDollar,
  };

  const handleSubmitConf = async (e) => {
    e.preventDefault();

    if (outletConf === null || supplierConf === null) {
      errorReturnConfAlert("Failed", "You have to identify both constraints !");
      return navigate("../all-purchases");
    }

    const selectedSupplier = listSupplier.filter((value) => value.supplierId == supplierConf)[0];
    const selectedOutlets = listOutlet.filter((value) => value.outletId == outletConf)[0];

    setBothConfig(selectedSupplier, selectedOutlets);
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // 👈️ return early if initial render
    }

    console.log(config.outlet, config.supplier);

    if (config.outlet !== null && config.supplier !== null) {
      setConfigModal(false);
      getAllListProductSupplier();
    }
  }, [config]);

  const setBothConfig = (selectedSupplier, selectedOutlets) => {
    setConfig({
      supplier: selectedSupplier,
      outlet: selectedOutlets,
    });
  };

  useEffect(() => {
    getAllSupplierAPI(token)
      .then((response) => {
        let data = response.data;

        setListSupplier(response.data);
        if (data.length > 0) {
          setSupplierConf(data[0].supplierId);
        }
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });

    getAllOutlets(token)
      .then((response) => {
        let data = response.data;

        setListOutlet(response.data);
        if (data.length > 0) {
          setOutletCond(data[0].outletId);
        }
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  }, []);

  const actionsSupplierBody = (productId) => {
    return (
      <>
        <div className="text-center">
          <button className="btn btn-outline-primary" onClick={() => handleUpdateItems(productId)}>
            <FontAwesomeIcon icon={faPencil} /> Edit
          </button>
          <span className="px-2 text-dark">|</span>
          <button className="btn btn-danger" onClick={() => handleDeleteItems(productId)}>
            <FontAwesomeIcon icon={faTrash} /> Delete Items
          </button>
        </div>
      </>
    );
  };

  const handleSubmitBills = () => {
    const purchaseItems = [];
    listItems.forEach((value) => {
      let items = {
        productId: value.productId,
        quantity: parseInt(value.amount),
      };
      purchaseItems.push(items);
    });

    let data = {
      supplierId: config.supplier.supplierId,
      listProduct: purchaseItems,
      outletId: config.outlet.outletId,
    };

    console.log(data);

    addNewBillsAPI(token, data)
      .then((response) => {
        console.log(response.data);
        setBillsConfirmDetails(response.data);
        setConfirmBillsModal(true);
      })
      .catch((err) => {
        let statusError = err.response.data.message;
        errorReturnConfAlert("Failed !", statusError);
      });
  };

  const handleConfirmsBill = () => {
    confirmPurchasesAPI(token, billsConfirmDetails).then((response) => {
      successReturnConfAlert("Success", "Successfully Add new Bills")
        .then(() => {
          navigate("../all-purchases");
        })
        .catch((err) => {
          alert("Error Occured !");
          console.log(err);
        });
    });
  };

  return (
    <>
      {/* CONFIG MODAL  */}
      <Modal show={configModal} onHide={() => navigate("../all-purchases")}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Outlet & Supplier</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmitConf}>
          <Modal.Body>
            <div class="mb-3">
              <label for="outletId" class="form-label">
                Outlet
              </label>
              {listOutlet !== null && listOutlet.length > 0 ? (
                <>
                  <select name="outletId" id="outletId" className="form-control" value={outletConf} onChange={(e) => setOutletCond(e.target.value)}>
                    {listOutlet.map((value, index) => (
                      <>
                        <option key={value.outletId} value={value.outletId}>
                          {value.outletName}
                        </option>
                      </>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <small>
                    No Outlets available,
                    <Link to="../all-outlets" className="ps-2">
                      All Outlets
                    </Link>
                  </small>
                </>
              )}
            </div>

            <div class="mb-3">
              <label for="supplierId" class="form-label">
                Supplier
              </label>
              {listSupplier !== null && listSupplier.length > 0 ? (
                <>
                  <select name="supplierId" id="supplierId" className="form-control" value={supplierConf} onChange={(e) => setSupplierConf(e.target.value)}>
                    {listSupplier.map((value, index) => (
                      <>
                        <option key={value.supplierId} value={value.supplierId}>
                          {value.companyName}
                        </option>
                      </>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <small>
                    No Supplier available,
                    <Link to="../all-suppliers" className="ps-2">
                      All Suppliers
                    </Link>
                  </small>
                </>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => navigate("../all-purchases")}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* END OF CONFIG MODAL  */}

      {/* LAYOUT  */}
      <Layout>
        {config.outlet !== null && config.supplier !== null && listSupplierProduct !== null && (
          <>
            <DashHeading data={metaPageData} />

            <div className="d-flex justify-content-between align-items-center my-4">
              <div className="col-lg-3">
                <table className="table">
                  <tr>
                    <td>Supplier</td>
                    <td className="px-2">:</td>
                    <td>{config.supplier.supplierName}</td>
                  </tr>
                  <tr>
                    <td>Outlet</td>
                    <td className="px-2">:</td>
                    <td>{config.outlet.outletName}</td>
                  </tr>
                </table>
              </div>

              {listSupplierProduct !== null && listSupplierProduct.length != 0 && (
                <>
                  <button className="btn btn-primary" onClick={handleShowAddItemsModal}>
                    Add New Items <FontAwesomeIcon icon={faPlus} />
                  </button>
                </>
              )}
            </div>

            <div className="row min-scroll">
              <DataTable value={listItems} tableStyle={{ minWidth: "50rem" }}>
                <Column field="itemsId" header="No"></Column>
                {/* <Column header="Product Name" body={(rowData) => getNameItems(rowData.productId)}></Column> */}
                <Column field="amount" header="Amount"></Column>
                <Column field="productName" header="Product Name"></Column>
                <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.itemsId)}></Column>
              </DataTable>
            </div>

            <div className="mt-3">
              <button className="btn btn-outline-primary w-100 py-3" onClick={handleSubmitBills}>
                Submit Bills
              </button>
            </div>
          </>
        )}
      </Layout>
      {/* END OF LAYOUT  */}

      {/* ADD ITEMS MODAL  */}
      <Modal show={addItemsModal} onHide={() => setAddItemsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Outlet & Supplier</Modal.Title>
        </Modal.Header>
        <form>
          <Modal.Body>
            <div class="mb-3">
              <label for="productId" class="form-label">
                Product
              </label>
              {listSupplierProduct !== null && listSupplierProduct.length > 0 ? (
                <>
                  <select name="productId" id="productId" className="form-control" value={items.productId} onChange={handleItemsChange}>
                    {listSupplierProduct.map((value, index) => (
                      <>
                        <option key={value.productId} value={value.productId}>
                          {value.productName}
                        </option>
                      </>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <small>
                    No Products available,
                    <Link to="../all-products" className="ps-2">
                      All Products
                    </Link>
                  </small>
                </>
              )}
            </div>

            <div class="mb-3">
              <label for="amount" class="form-label">
                Amount
              </label>
              <input type="number" name="amount" id="amount" className="form-control" value={items.amount} onChange={handleItemsChange} required />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setAddItemsModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={handleItemsSubmit}>
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
      {/* END OF  ITEMS MODAL  */}

      {/* UPDATE ITEMS */}
      <Modal show={updateItemsModal} onHide={() => setUpdateItemsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Amount</Modal.Title>
        </Modal.Header>
        <form onSubmit={(e) => handleSubmitUpdatedItems(e, updatedItemsId)}>
          <Modal.Body>
            <div class="mb-3">
              <label for="amount" class="form-label">
                Amount
              </label>
              <input type="number" name="amount" id="amount" className="form-control" value={updatedAmount} onChange={(e) => setUpdatedAmount(e.target.value)} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setUpdateItemsModal(false)}>
              Close
            </Button>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* END OF UPDATE ITEMS */}

      {/* CONFIRM MODAL */}

      {billsConfirmDetails !== null && (
        <>
          <Modal show={confirmBillsModal} size="lg" onHide={() => setConfirmBillsModal(false)}>
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
                  <ListGroup.Item>Outlet Name : {billsConfirmDetails.purchases.outlet.outletName}</ListGroup.Item>
                  <ListGroup.Item>Outlet Code : {billsConfirmDetails.purchases.outlet.outletCode}</ListGroup.Item>
                  <ListGroup.Item>Outlet Address : {billsConfirmDetails.purchases.outlet.outletAddress}</ListGroup.Item>
                </ListGroup>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Supplier Info</h3>
                <ListGroup>
                  <ListGroup.Item>Supplier Name : {billsConfirmDetails.purchases.supplierName}</ListGroup.Item>
                  <ListGroup.Item>Supplier Code : {billsConfirmDetails.purchases.supplierCode}</ListGroup.Item>
                </ListGroup>
              </div>

              <div className="my-5">
                <h3 className="mb-3">Items Info</h3>
                <div className="row min-scroll">
                  <DataTable value={billsConfirmDetails.purchasesList} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="productName" header="Product Name"></Column>
                    <Column field="quantity" header="Amount"></Column>
                  </DataTable>
                </div>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Bills Info</h3>
                <ListGroup>
                  <ListGroup.Item>
                    Total Amount : <b>${billsConfirmDetails.purchases.totalAmount}</b>
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setConfirmBillsModal(false)}>
                Close
              </Button>
              <button className="btn btn-primary" type="submit" onClick={handleConfirmsBill}>
                Save
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}

      {/* END CONFIRM MODAL */}
    </>
  );
};

export default AddBills;
