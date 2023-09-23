import { faPencil, faPlus, faPlusSquare, faRefresh, faSearch, faShop, faTrash } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";

import { addNewCategory, deleteCategoryAPI, detailCategoryAPI, getAllCategory, updateCategoryAPI } from "../../../api/category";
import Layout from "../../../component/Layout";
import DashHeading from "../../../component/part/DashHeading";
import { AuthContext } from "../../../context/auth-context";
import { Button, Modal } from "react-bootstrap";
import { errorAlert, errorReturnConfAlert, successConfAlert, successReturnConfAlert } from "../../../alert/sweetAlert";

const AllCategory = () => {
  const { token } = useContext(AuthContext);
  const [addCategoryModal, setAddShow] = useState(false);
  const [updateCategoryModal, setUpdateShow] = useState(false);
  const [categoryName, setCategoryName] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [categoryDetailsName, setCategoryDetailsName] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const metaPageData = {
    title: "All Product Categoris",
    href: "all-categories",
    header: ["all-categories", ""],
    icon: faShop,
  };

  const [listCategory, setListCategory] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const handleAddCategory = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("categoryName", categoryName);

    addNewCategory(token, formData)
      .then(() => {
        successReturnConfAlert("Success", "Category added successfully !").then(() => {
          findAllCategory();
        });
      })
      .catch(() => {
        errorReturnConfAlert("Failed", "Failed to add new category !");
      });
  };

  const handleUpdateCategory = (e, categoryId) => {
    e.preventDefault();

    console.log(categoryId);
    console.log(categoryDetails);

    const formData = new FormData();
    formData.append("categoryName", categoryDetailsName);

    updateCategoryAPI(token, formData, categoryId)
      .then(() => {
        successReturnConfAlert("Success", "Category updated successfully !").then(() => {
          findAllCategory();
        });
      })
      .catch(() => {
        errorReturnConfAlert("Failed", "Failed to update category !");
      });
  };

  const getDetailsCategory = (categoryId) => {
    detailCategoryAPI(token, categoryId)
      .then((response) => {
        setCategoryDetails(response.data);
        setCategoryDetailsName(response.data.name);
        setUpdateShow(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    deleteCategoryAPI(token, categoryId)
      .then(() => {
        findAllCategory(token);
        successReturnConfAlert("Success", "Deleted successfully !");
      })
      .catch((err) => {
        alert(err);
        console.log(err);
      });
  };

  const findAllCategory = () => {
    getAllCategory(token)
      .then((response) => {
        setListCategory(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    findAllCategory();
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData}></DashHeading>

        <div className="d-flex justify-content-between my-4">
          <form action="" className="d-flex">
            <input type="text" className="form-control" placeholder="Search a category" />
            <button className="btn btn-secondary">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <button className="btn btn-primary" onClick={() => setAddShow(true)}>
            New Category <FontAwesomeIcon icon={faPlusSquare} />
          </button>
        </div>

        <DataTable value={listCategory} dataKey="categoryId" tableStyle={{ minWidth: "50rem" }}>
          <Column field="name" header="Category Name"></Column>
          <Column
            header="actions"
            body={(rowData) => (
              <>
                <div className="text-center">
                  <button className="btn btn-primary" onClick={() => getDetailsCategory(rowData.categoryId)}>
                    <FontAwesomeIcon icon={faPencil} /> Details
                  </button>
                  <span className="px-2">|</span>
                  <button className="btn btn-danger" onClick={() => handleDeleteCategory(rowData.categoryId)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </button>
                </div>
              </>
            )}
          ></Column>
        </DataTable>
      </Layout>

      <Modal show={addCategoryModal} onHide={() => setAddShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add new category</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleAddCategory}>
          <Modal.Body>
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">
                Category Name
              </label>
              <input type="text" class="form-control" id="phoneNumber" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} name="categoryName" />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setAddShow(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit" onClick={() => setAddShow(false)}>
              Save
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {categoryDetails !== null && (
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
      )}
    </>
  );
};

export default AllCategory;
