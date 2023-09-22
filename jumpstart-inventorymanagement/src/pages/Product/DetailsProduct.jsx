import { faCartArrowDown } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { ContohProduct, HeaderPic } from "../../assets/images/_images";

const DetailsProduct = () => {
  const metaPageData = {
    title: "Product Details",
    href: "all-products",
    header: ["all-products /", " details"],
    icon: faCartArrowDown,
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        <div className="row my-4">
          <form action="">
            <h3 className="my-3">General Information</h3>

            <div className="row  d-md-flex flex-column-reverse  flex-lg-row">
              <div className="col-md-8">
                <div className="mb-3">
                  <label htmlFor="">Product Name : </label>
                  <input type="text" className="form-control fs-3 input__type1" value="Battery" />
                </div>

                <div className="mb-3">
                  <label htmlFor="">Product Category : </label>
                  <select name="" id="" className="form-control input__type1">
                    <option value="">-- Electronics --</option>
                  </select>
                </div>
              </div>

              <div className="col-md">
                <div>
                  <img src={ContohProduct.cp1} alt="img-product" className="rounded" style={{ width: "250px", height: "200px", objectFit: "cover" }} />
                  <input type="file" className="form-control" placeholder="Choose a picture" />
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div>
                  <h3>Costs & Price</h3>
                  <table className="table my-3">
                    <tr>
                      <td>
                        <label htmlFor="">Prices : </label>
                      </td>
                      <td>
                        <input type="text" className="form-control  input__type1 " value="$ 10.00" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="">Costs : </label>
                      </td>
                      <td>
                        <input type="text" className="form-control  input__type1 " value="$ 8.00" />
                      </td>
                    </tr>
                  </table>
                </div>
              </div>

              <div className="col-md-6">
                <div>
                  <h3>Logistics</h3>
                  <table className="table my-3">
                    <tr>
                      <td>
                        <label htmlFor="">Weight (kg) : </label>
                      </td>
                      <td>
                        <input type="text" className="form-control  input__type1" value="0.5" />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="">
                          Volume (m<sup>3</sup>) :
                        </label>
                      </td>
                      <td>
                        <input type="text" className="form-control  input__type1" value="-" />
                      </td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <h3 className="my-3">Strategies</h3>
            <div className="mb-3">
              <span className="me-3">
                <input type="radio" name="remove-strategis" id="fifo" value="fifo" />
                <label htmlFor="fifo">First In First Out</label>
              </span>

              <span className="me-3">
                <input type="radio" name="remove-strategis" id="closest" value="closest" />
                <label htmlFor="closest">Closest Stock </label>
              </span>
            </div>

            <button type="submit" className="btn btn-outline-primary py-3 w-100 mt-4">
              Save Product
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default DetailsProduct;
