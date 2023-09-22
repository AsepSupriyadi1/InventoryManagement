import { faCartArrowDown, faPlus, faSearch, faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { ContohProduct } from "../../assets/images/_images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

const AllProducts = () => {
  const metaPageData = {
    title: "Add Product",
    href: "all-products",
    header: ["all-products", ""],
    icon: faCartArrowDown,
  };

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
          <div className="col-lg-4 col-md-6 col-12">
            <div className="d-flex align-items-center border rounded">
              <div className="p-3">
                <img src={ContohProduct.cp1} className="product-img" alt="" />
              </div>
              <div>
                <h4>Battery</h4>
                <small>Category: Electronics</small>
                <small>Price : $ 10</small>
                <small>Quantity on hand : 10.00</small>
              </div>
            </div>
          </div>

          <div className="col-lg-4 col-md-6 col-12">
            <div className="d-flex align-items-center border rounded">
              <div className="p-3">
                <img src={ContohProduct.cp2} className="product-img" alt="" />
              </div>
              <div>
                <h4>Glue</h4>
                <small>Category: Tools</small>
                <small>Price : $ 10</small>
                <small>Quantity on hand : 10.00</small>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AllProducts;
