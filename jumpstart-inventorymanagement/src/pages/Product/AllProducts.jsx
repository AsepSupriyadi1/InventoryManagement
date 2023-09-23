import { faCartArrowDown, faPlus, faSearch, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { ContohProduct } from "../../assets/images/_images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getAllProduct } from "../../api/product";
import { AuthContext } from "../../context/auth-context";

const AllProducts = () => {
  const { token } = useContext(AuthContext);
  const [listProduct, setListProduct] = useState(null);

  const metaPageData = {
    title: "Add Product",
    href: "all-products",
    header: ["all-products", ""],
    icon: faCartArrowDown,
  };

  useEffect(() => {
    getAllProduct(token)
      .then((response) => {
        console.log(response.data);
        setListProduct(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  });

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

        <div className="row g-3 my-3">
          {listProduct !== null && listProduct.length > 0 ? (
            <>
              {listProduct.map((value, index) => (
                <>
                  <div className="col-lg-4 col-md-6 col-12" key={value.productId}>
                    <div className="d-flex align-items-center border rounded">
                      <div className="p-3">
                        {/* <img src={ContohProduct.cp1} className="product-img" alt="" /> */}
                        <img src={`data:image/png;base64,${value.productPic}`} className="product-img" alt="product-img" />
                      </div>
                      <div>
                        <h4>{value.productName}</h4>
                        <small>Category: {value.category !== null ? value.category.categoryName : "uncategorized"}</small>
                        <small>Price : $ {value.prices}</small>
                        <small>Quantity on hand : - </small>
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
