import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { ContohProduct, HeaderPic } from "../../assets/images/_images";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { detailProductAPI, updateProduct } from "../../api/product";
import { AuthContext } from "../../context/auth-context";
import { getAllSupplierAPI } from "../../api/supplier";
import { getAllCategory } from "../../api/category";
import { errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";

const DetailsProduct = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  // -=-=-=-=-=-=-=-=-= FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const [productDetails, setProductDetails] = useState(null);
  const [listCategory, setListCategory] = useState(null);
  const [listSupplier, setListSupplier] = useState(null);

  const [productName, setProductName] = useState(null);
  const [prices, setPrices] = useState(null);
  const [costs, setCosts] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [supplierId, setSupplierId] = useState(null);
  const [productDesc, setProductDesc] = useState(null);

  const emptyBlob = new Blob([], { type: "application/octet-stream" });
  const [file, setFile] = useState(emptyBlob);
  const [productPic, setProductPic] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  // -=-=-=-=-=-=-=-=-= END OF FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  const metaPageData = {
    title: "Product Details",
    href: "all-products",
    header: ["all-products /", " details"],
    icon: faCartArrowDown,
  };

  const getDetailProduct = (productId) => {
    detailProductAPI(token, productId)
      .then((response) => {
        let data = response.data;
        setProductDetails(response.data);
        setProductName(data.productName);
        setPrices(data.prices);
        setCosts(data.costs);
        setCategoryId(data.category.categoryId);
        setSupplierId(data.supplier.supplierId);
        setProductDesc(data.productDesc);
        setProductPic(data.productPic);
        setFile(data.productPic);
      })
      .catch((err) => {
        console.log(err);
        // navigate("/all-outlets");
      });
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setFile(file);
    }
  };

  useEffect(() => {
    getDetailProduct(params.productId);

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

  const handleUpdateProduct = (event) => {
    event.preventDefault();

    // console.log(productName);
    // console.log(prices);
    // console.log(costs);
    // console.log(categoryId);
    // console.log(supplierId);
    // console.log(file);
    // console.log(productDesc);

    const formData = new FormData();

    formData.append("productName", productName);
    formData.append("prices", prices);
    formData.append("costs", costs);
    formData.append("categoryId", categoryId);
    formData.append("supplierId", supplierId);
    formData.append("picture", file);
    formData.append("productDesc", productDesc);

    updateProduct(token, formData, params.productId)
      .then(() => {
        successReturnConfAlert("Success", "Product Updated Successfully").then(() => {
          navigate("../all-products");
        });
      })
      .catch((err) => {
        errorReturnConfAlert("Failed", "Failed to update product");
      });
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        {productDetails !== null && (
          <>
            <div className="row my-4">
              <form onSubmit={handleUpdateProduct}>
                <h3 className="my-3">General Information</h3>

                <div className="row  d-md-flex flex-column-reverse  flex-lg-row">
                  <div className="col-md-9">
                    <div className="mb-3">
                      <label htmlFor="productName">Product Name : </label>
                      <input type="text" className="form-control fs-3 input__type1" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="">Product Category : </label>
                      {listCategory !== null && listCategory.length > 0 ? (
                        <>
                          <select name="categoryId" id="categoryId" className="form-control input__type1" value={categoryId} onChange={handleCategoryChange}>
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

                    <div className="py-3">
                      <h3>Costs & Price</h3>
                      <table className="table my-3">
                        <tr>
                          <td>
                            <label htmlFor="prices">Prices : </label>
                          </td>
                          <td>
                            <input type="number" className="form-control  input__type1 " id="prices" value={prices} onChange={(e) => setPrices(e.target.value)} />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <label htmlFor="costs">Costs : </label>
                          </td>
                          <td>
                            <input type="text" className="form-control  input__type1 " id="costs" value={costs} onChange={(e) => setCosts(e.target.value)} />
                          </td>
                        </tr>
                      </table>
                    </div>
                  </div>

                  <div className="col-md">
                    <div>
                      {selectedImage !== null ? (
                        <>
                          <img src={selectedImage} className="full-product-img border border-1" alt="selectedImg" />
                        </>
                      ) : (
                        <>
                          {productDetails.productPic === null || productDetails.productPic === "" ? (
                            <img src={HeaderPic.defaultProduct} className="full-product-img border border-1" alt="defaultImg" />
                          ) : (
                            <img src={`data:image/png;base64,${productDetails.productPic}`} className="full-product-img border border-1" alt="product-img" />
                          )}
                        </>
                      )}

                      <input type="file" accept="image/*" className="form-control" placeholder="Choose a picture" onChange={handleImageChange} />
                    </div>
                  </div>
                </div>

                <div className="pb-3">
                  <h3>Relation</h3>

                  <div className="row py-3">
                    <div className="col-2">
                      <label htmlFor="supplierId">Supplier : </label>
                    </div>
                    <div className="col">
                      {listSupplier !== null && listSupplier.length > 0 ? (
                        <>
                          <select name="supplierId" id="supplierId" className="form-control input__type1" value={supplierId} onChange={handleSupplierChange}>
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
                            No Category available,
                            <Link to="../all-categories" className="ps-2">
                              All Categories
                            </Link>
                          </small>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3>Others</h3>

                  <div className="row py-3">
                    <div className="col-2">
                      <label htmlFor="productDesc"> Description : </label>
                    </div>
                    <div className="col">
                      <textarea name="productDesc" id="productDesc" rows={4} className="form-control input__type1" value={productDesc} onChange={(e) => setProductDesc(e.target.value)}></textarea>
                    </div>
                  </div>
                </div>

                <button type="submit" className="btn btn-outline-primary py-3 w-100 mt-4">
                  Save Product
                </button>
              </form>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default DetailsProduct;
