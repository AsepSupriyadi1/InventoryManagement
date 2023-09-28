import { addNewCategory, deleteCategoryAPI, detailCategoryAPI, getAllCategory, updateCategoryAPI } from "../../../api/category";
import Layout from "../../../component/Layout";
import DashHeading from "../../../component/part/DashHeading";
import { AuthContext } from "../../../context/auth-context";
import { Button, Modal } from "react-bootstrap";
import { errorAlert, errorReturnConfAlert, successConfAlert, successReturnConfAlert } from "../../../alert/sweetAlert";
import Swal from "sweetalert2";
import { useContext, useEffect, useState } from "react";
import { faPencil, faSearch, faShop } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getAllStocksLevelAPI } from "../../../api/stocks";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getAllOutlets } from "../../../api/outlet";

const AllStok = () => {
  const { token } = useContext(AuthContext);
  const [addCategoryModal, setAddShow] = useState(false);
  const [updateCategoryModal, setUpdateShow] = useState(false);

  //  -=-=-=-=-=-=-=-=-= COMPONENT STATE -=-=-=-=-=--=-=
  const [listStocksLevel, setListStocksLevel] = useState(null);
  const [filteredSrockLevel, setFilteredStockLevel] = useState(null);
  const [listStores, setListStores] = useState(null);
  //  -=-=-=-=-=-=-=-=-= END OF COMPONENT STATE -=-=-=-=-=--=-=

  //  -=-=-=-=-=-=-=-=-= FILTER STATE -=-=-=-=-=--=-=
  const [selectedOutlet, setSelectedOutlet] = useState("reset");
  //  -=-=-=-=-=-=-=-=-= END OF Filter STATE -=-=-=-=-=--=-=

  //  -=-=-=-=-=-=-=-=-= DETAILS STATE -=-=-=-=-=--=-=
  const [detailsStockLevel, setSelectedStockLevel] = useState({
    outletName: "",
    productName: "",
    minimumQuantity: 0,
    maximumQuantity: 0,
  });
  const [detailsStockLevelModal, setDetailsStockLevelModal] = useState(false);
  //  -=-=-=-=-=-=-=-=-= END OF Filter STATE -=-=-=-=-=--=-=

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const metaPageData = {
    title: "All Stocks Level",
    href: "all-stocks",
    header: ["all-stocks", ""],
    icon: faShop,
  };

  const getAllStocksLevel = () => {
    getAllStocksLevelAPI(token)
      .then((response) => {
        let responseData = response.data;

        setListStocksLevel(responseData);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });

    getAllOutlets(token)
      .then((response) => {
        setListStores(response.data);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });
  };

  const filterByOutlet = (stateSelectedOutlet) => {
    let filteredByOutletItems = listStocksLevel.filter((item) => item.outletName.toLowerCase().includes(stateSelectedOutlet.toLowerCase()));
    return filteredByOutletItems;
  };

  const handleOutletFieldFilterChange = (e) => {
    setSelectedOutlet(e.target.value);
  };

  useEffect(() => {
    if (selectedOutlet !== "reset") {
      let data = filterByOutlet(selectedOutlet);
      setFilteredStockLevel(data);
    } else if (selectedOutlet === "reset") {
      setFilteredStockLevel(null);
      getAllStocksLevel();
    }
  }, [selectedOutlet]);

  const handleStockLevelDetails = (outletName, productName, minQuantity, maxQuantity) => {
    const stockLevelsDetailData = {
      outletName: outletName,
      productName: productName,
      minimumQuantity: minQuantity,
      maximumQuantity: maxQuantity,
    };
    setSelectedStockLevel(stockLevelsDetailData);
    setDetailsStockLevelModal(true);
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData}></DashHeading>

        <div className="d-flex justify-content-between my-4">
          <div style={{ minWidth: "100px" }}>
            <select name="outletNameField" id="outletNameField" className="form-control" value={selectedOutlet} onChange={handleOutletFieldFilterChange}>
              <option value="reset">-- choose outlet --</option>
              {listStores !== null &&
                listStores.map((value, index) => (
                  <>
                    <option value={value.outletName}>{value.outletName}</option>
                  </>
                ))}
            </select>
          </div>
        </div>

        {filteredSrockLevel !== null && (
          <>
            <div className="row min-scroll">
              <DataTable value={filteredSrockLevel} dataKey="categoryId" tableStyle={{ minWidth: "50rem", maxHeight: "100px", overflowY: "hidden" }}>
                <Column field="productName" header="Product Name"></Column>
                <Column field="currentQuantity" header="Quantity On Hand"></Column>
                <Column field="minStockLevelQuantity" header="Minimum Stock Level"></Column>
                <Column field="maxStockLevelQuantity" header="Maximum Stock Level"></Column>
                <Column field="outletName" header="Outlet Name"></Column>
                <Column
                  header="actions"
                  body={(rowData) => (
                    <>
                      <div className="text-center">
                        <button className="btn btn-primary" onClick={() => handleStockLevelDetails(rowData.outletName, rowData.productName, rowData.minStockLevelQuantity, rowData.maxStockLevelQuantity)}>
                          <FontAwesomeIcon icon={faPencil} /> Set Stocks Level
                        </button>
                      </div>
                    </>
                  )}
                ></Column>
              </DataTable>
            </div>
          </>
        )}

        {filteredSrockLevel === null && (
          <div className="row min-scroll">
            <DataTable value={listStocksLevel} dataKey="categoryId" tableStyle={{ minWidth: "50rem", maxHeight: "100px", overflowY: "hidden" }}>
              <Column field="productName" header="Product Name"></Column>
              <Column field="currentQuantity" header="Quantity On Hand"></Column>
              <Column field="minStockLevelQuantity" header="Minimum Stock Level"></Column>
              <Column field="maxStockLevelQuantity" header="Maximum Stock Level"></Column>
              <Column field="outletName" header="Outlet Name"></Column>
              <Column
                header="actions"
                body={(rowData) => (
                  <>
                    <div className="text-center">
                      <button className="btn btn-primary" onClick={() => handleStockLevelDetails(rowData.outletName, rowData.productName, rowData.minStockLevelQuantity, rowData.maxStockLevelQuantity)}>
                        <FontAwesomeIcon icon={faPencil} /> Set Stocks Level
                      </button>
                    </div>
                  </>
                )}
              ></Column>
            </DataTable>
          </div>
        )}
      </Layout>

      <Modal show={detailsStockLevelModal} onHide={() => setDetailsStockLevelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Stock Level Product</Modal.Title>
        </Modal.Header>
        <form>
          <Modal.Body>
            <div class="mb-3">
              <label for="outletName" class="form-label">
                Outlet Name
              </label>
              <input type="text" class="form-control" id="outletName" required value={detailsStockLevel.outletName} name="categoryName" />
            </div>
            <div class="mb-3">
              <label for="productName" class="form-label">
                Product Name
              </label>
              <input type="text" class="form-control" id="productName" required value={detailsStockLevel.productName} name="categoryName" />
            </div>
            <div class="mb-3">
              <label for="minQuantity" class="form-label">
                Minimum Quantity
              </label>
              <input type="text" class="form-control" id="minQuantity" required value={detailsStockLevel.minimumQuantity} name="categoryName" />
            </div>
            <div class="mb-3">
              <label for="maxQuantity" class="form-label">
                Maximum Quantity
              </label>
              <input type="text" class="form-control" id="maxQuantity" required value={detailsStockLevel.maximumQuantity} name="categoryName" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDetailsStockLevelModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={() => setDetailsStockLevelModal(false)}>
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* {categoryDetails !== null && (
        <Modal show={updateCategoryModal} onHide={() => setUpdateShow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Category</Modal.Title>
          </Modal.Header>
          <form show={updateCategoryModal} onSubmit={(e) => handleUpdateCategory(e, categoryDetails.categoryId)}>
            <Modal.Body>
              <div class="mb-3">
                <label for="phoneNumber" class="form-label">
                  Category Name
                </label>
                <input type="text" class="form-control" id="phoneNumber" required value={categoryDetailsName} onChange={(e) => setCategoryDetailsName(e.target.value)} name="categoryName" />
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
      )} */}
    </>
  );
};

export default AllStok;
