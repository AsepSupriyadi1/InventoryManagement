import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getAllSupplierAPI } from "../../api/supplier";
import { AuthContext } from "../../context/auth-context";
import { getAllCategory } from "../../api/category";
import { addNewProduct } from "../../api/product";
import { errorAlert, errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";

const AddProduct = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [listSupplier, setListSupplier] = useState(null);
  const [listCategory, setListCategory] = useState(null);

  //  FORM STATE
  const [productName, setProductName] = useState(null);
  const [prices, setPrices] = useState(null);
  const [costs, setCosts] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const [productDesc, setProductDesc] = useState(null);

  const emptyBlob = new Blob([], { type: "application/octet-stream" });
  const [file, setFile] = useState(emptyBlob);
  const [selectedImage, setSelectedImage] = useState(null);
  // END OF FORM STATE

  const metaPageData = {
    title: "Add Product",
    href: "all-products",
    header: ["all-products / ", "add-products"],
    icon: faCartPlus,
  };

  useEffect(() => {
    getAllSupplierAPI(token)
      .then((response) => {
        setListSupplier(response.data);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });

    getAllCategory(token)
      .then((response) => {
        setListCategory(response.data);
      })
      .catch((err) => {
        alert("Error Occured");
        console.log(err);
      });
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
      console.log(file);
    }
    setStatusSubmit(true);
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryId = e.target.value;
    if (selectedCategoryId === "-- choose category --") {
      setCategoryId(null); // Atur state menjadi null
    } else {
      setCategoryId(selectedCategoryId);
    }
  };

  const handleSupplierChange = (e) => {
    const selectedSupplierId = e.target.value;
    if (selectedSupplierId === "-- choose supplier --") {
      setSupplierId(null); // Atur state menjadi null
    } else {
      setSupplierId(selectedSupplierId);
    }
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    const formData = new FormData();

    // console.log(productName);
    // console.log(prices);
    // console.log(costs);
    // console.log(typeof categoryId);
    // console.log(typeof supplierId);
    // console.log(file);
    // console.log(productDesc);

    formData.append("productName", productName);
    formData.append("prices", prices);
    formData.append("costs", costs);
    formData.append("categoryId", categoryId);
    formData.append("supplierId", supplierId);
    formData.append("picture", file);
    formData.append("productDesc", productDesc);

    console.log(formData.get("productName"));
    console.log(formData.get("prices"));
    console.log(formData.get("costs"));
    console.log(formData.get("categoryId"));
    console.log(formData.get("supplierId"));
    console.log(formData.get("picture"));
    console.log(formData.get("productDesc"));

    addNewProduct(token, formData)
      .then(() => {
        successReturnConfAlert("Success", "Product added Successfully").then(() => {
          navigate("/all-products");
        });
      })
      .catch((err) => {
        errorReturnConfAlert("Failed", "Failed to add a new product");
      });
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        <div className="row my-4 p-3 p-0 m-0 border rounded">
          <form onSubmit={handleAddProduct}>
            <div className="my-3">
              <h3 className="mb-3">General Informations</h3>
              <div className="row">
                <div className="col-lg-9">
                  <div class="mb-3">
                    <label for="productName" class="form-label">
                      Product Name
                    </label>
                    <input type="text" class="form-control" id="productName" aria-describedby="emailHelp" name="productName" value={productName} onChange={(e) => setProductName(e.target.value)} />
                  </div>

                  <div class="mb-3">
                    <label for="categoryId" class="form-label">
                      Product Category
                    </label>
                    {listCategory !== null && listCategory.length > 0 ? (
                      <>
                        <select name="categoryId" id="categoryId" className="form-control" value={categoryId} onChange={handleCategoryChange}>
                          <option>-- choose category -- </option>

                          {listCategory.map((value, index) => (
                            <>
                              <option key={value.categoryId} value={value.categoryId}>
                                {value.name}
                              </option>
                            </>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <small>
                          No Category available,
                          <Link to="../all-categories" className="ps-2">
                            All Categories
                          </Link>
                        </small>
                      </>
                    )}
                  </div>
                  <h3 className="mb-3">Price & Costs</h3>

                  <div class="mb-3">
                    <label for="prices" class="form-label">
                      Sales Price
                    </label>
                    <input type="number" class="form-control" id="prices" name="prices" value={prices} onChange={(e) => setPrices(e.target.value)} required />
                  </div>

                  <div class="mb-3">
                    <label for="costs" class="form-label">
                      Costs
                    </label>
                    <input type="number" class="form-control" id="costs" name="costs" value={costs} onChange={(e) => setCosts(e.target.value)} required />
                  </div>
                </div>
                <div className="col-lg-3 d-flex flex-row flex-lg-column align-items-start">
                  {selectedImage !== null ? (
                    <>
                      <img src={selectedImage} className="full-product-img border border-1" alt="selectedImg" />
                    </>
                  ) : (
                    <>
                      <img src={HeaderPic.defaultProduct} className="full-product-img border border-1" alt="defaultImg" />
                    </>
                  )}

                  <input type="file" accept="image/*" className="form-control" placeholder="Choose a picture" onChange={handleImageChange} />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="my-3">
                  <h3 className="mb-3">Relation</h3>

                  <div class="mb-3">
                    <label for="supplierId" class="form-label">
                      Supplier
                    </label>

                    {listSupplier !== null && listSupplier.length > 0 ? (
                      <>
                        <select name="supplierId" id="supplierId" className="form-control" value={supplierId} onChange={handleSupplierChange}>
                          <option>-- choose supplier -- </option>

                          {listSupplier.map((value, index) => (
                            <>
                              <option key={value.supplierId} value={value.supplierId}>
                                {value.supplierName}
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
                            All Supplier
                          </Link>
                        </small>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-lg-12">
                <div className="my-3">
                  <h3 className="mb-3">Others</h3>

                  <div class="mb-3">
                    <label for="productDesc" class="form-label">
                      Product Description
                    </label>

                    <textarea name="productDesc" id="productDesc" className="form-control" rows="10" value={productDesc} onChange={(e) => setProductDesc(e.target.value)} required></textarea>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-primary w-100">
              Save Product
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default AddProduct;
