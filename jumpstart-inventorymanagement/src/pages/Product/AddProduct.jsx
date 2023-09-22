import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { Navigate } from "react-router-dom";

const AddProduct = () => {
  const metaPageData = {
    title: "Add Product",
    href: "all-products",
    header: ["all-products / ", "add-products"],
    icon: faCartPlus,
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        <div className="row my-4 p-3 p-0 m-0 border rounded">
          <form>
            <div className="my-3">
              <h3 className="mb-3">General Informations</h3>
              <div className="row">
                <div className="col-lg-9">
                  <div class="mb-3">
                    <label for="exampleInputEmail1" class="form-label">
                      Product Name
                    </label>
                    <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                  </div>

                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Product Category
                    </label>
                    <select name="" id="" className="form-control">
                      <option value="">-- choose category -- </option>
                    </select>
                  </div>

                  <h3 className="mb-3">Price & Costs</h3>

                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Sales Price
                    </label>
                    <input type="text" class="form-control" id="exampleInputPassword1" />
                  </div>

                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Costs
                    </label>
                    <input type="text" class="form-control" id="exampleInputPassword1" />
                  </div>
                </div>
                <div className="col-lg-3 d-flex flex-row flex-lg-column align-items-start">
                  <img src={HeaderPic.defaultProduct} className="full-product-img" alt="" />
                  <input type="file" className="form-control" placeholder="Choose a picture" />
                </div>
              </div>

              <div className="col-lg-12">
                <div className="my-3">
                  <h3 className="mb-3">Logistics</h3>

                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Weight (kg)
                    </label>
                    <input type="text" class="form-control" id="exampleInputPassword1" />
                  </div>

                  <div class="mb-3">
                    <label for="exampleInputPassword1" class="form-label">
                      Volume (m<sup>3</sup>)
                    </label>
                    <input type="text" class="form-control" id="exampleInputPassword1" />
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
