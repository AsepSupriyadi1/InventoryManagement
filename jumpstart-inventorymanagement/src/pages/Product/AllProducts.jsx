import { faCartArrowDown, faPlus, faSearch, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { ContohProduct, HeaderPic } from "../../assets/images/_images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { deleteProductAPI, getAllProductAPI } from "../../api/product";
import { AuthContext } from "../../context/auth-context";
import Swal from "sweetalert2";

const AllProducts = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [listProduct, setListProduct] = useState(null);

  const metaPageData = {
    title: "Add Product",
    href: "all-products",
    header: ["all-products", ""],
    icon: faCartArrowDown,
  };

  const getAllProduct = () => {
    getAllProductAPI(token)
      .then((response) => {
        setListProduct(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  };

  const handleDeleteProduct = (productId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteProductAPI(token, productId)
          .then(() => {
            getAllProduct();
            Swal.fire("Sucess !", "Product has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Deleted!", "Failed to delete product", "error");
          });
      }
    });
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData}></DashHeading>

        <div className="d-flex justify-content-between my-4">
          <form action="" className="d-flex">
            <input type="text" className="form-control" placeholder="Search a product" />
            <button className="btn btn-secondary">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          <Link to={"/add-products"}>
            <button className="btn btn-primary">
              New Product <FontAwesomeIcon icon={faCartPlus} />
            </button>
          </Link>
        </div>

        <div className="row g-3 my-3 min-scroll">
          {listProduct !== null && listProduct.length > 0 ? (
            <>
              {listProduct.map((value, index) => (
                <>
                  <div className="col-lg-4 col-md-6 col-12" key={value.productId} style={{ cursor: "pointer" }}>
                    <div className="d-flex align-items-center border rounded">
                      <div className="p-3">
                        {value.productPic === "" ? (
                          <>
                            <img src={HeaderPic.defaultProduct} className="product-img" alt="" />
                          </>
                        ) : (
                          <>
                            <img src={`data:image/png;base64,${value.productPic}`} className="product-img" alt="product-img" />
                          </>
                        )}
                      </div>
                      <div>
                        <h4>{value.productName}</h4>
                        <small>Category: {value.category !== null ? value.category.name : "uncategorized"}</small>
                        <small>Price : $ {value.prices}</small>

                        <div>
                          <Link to={`/detail-product/${value.productId}`} className="text-dark">
                            Details
                          </Link>
                          <span className="px-1 text-secondary">|</span>
                          <Link className="text-danger" onClick={() => handleDeleteProduct(value.productId)}>
                            Delete
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </>
          ) : (
            <div className="col-12">
              <h3>There is no product</h3>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default AllProducts;
