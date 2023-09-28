import { faCartPlus, faTruck } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { addNewSupplierAPI } from "../../api/supplier";
import { AuthContext } from "../../context/auth-context";
import { errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";

const AddSupplier = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const metaPageData = {
    title: "Add Supplier",
    href: "all-suppliers",
    header: ["Suppliers / ", "add-supplier"],
    icon: faTruck,
  };

  const [formValue, setformValue] = useState({
    supplierName: null,
    address: null,
    companyName: null,
    phoneNumber: null,
    email: null,
  });

  const handleChange = (e) => {
    setformValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addNewSupplierAPI(token, formValue)
      .then((response) => {
        successReturnConfAlert("Success", "Successfully add new supplier !").then(() => {
          navigate("../all-suppliers");
        });
      })
      .catch((err) => {
        errorReturnConfAlert("Failed", "add new supplier failed !");
        console.log(err);
      });
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        <div className="row my-4 p-3 p-0 m-0 border rounded">
          <form onSubmit={handleSubmit} method="POST">
            <div className="my-3">
              <div className="col-lg-12">
                <div className="my-3">
                  <h3 className="mb-3">Supplier Details</h3>

                  <div class="mb-3">
                    <label for="supplierName" class="form-label">
                      Supplier Name / Person Name
                    </label>
                    <input type="text" class="form-control" id="supplierName" required name="supplierName" value={formValue.supplierName} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="address" class="form-label">
                      Address
                    </label>
                    <textarea name="address" id="address" className="form-control" rows="6" required onChange={handleChange} value={formValue.address}></textarea>
                  </div>

                  <div class="mb-3">
                    <label for="address" class="form-label">
                      Company Name
                    </label>
                    <input type="text" class="form-control" id="companyName" required name="companyName" value={formValue.companyName} onChange={handleChange} />
                  </div>
                </div>

                <div className="my-3">
                  <h3 className="mb-3">Contact </h3>
                  <div class="mb-3">
                    <label for="address" class="form-label">
                      Phone Number
                    </label>
                    <input type="text" class="form-control" id="phoneNumber" required name="phoneNumber" value={formValue.phoneNumber} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="email" class="form-label">
                      Email
                    </label>
                    <input type="email" class="form-control" id="email" required name="email" value={formValue.email} onChange={handleChange} />
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

export default AddSupplier;
