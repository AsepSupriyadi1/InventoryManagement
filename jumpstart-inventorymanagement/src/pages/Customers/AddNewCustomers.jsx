import { faCartPlus, faTruck, faUser } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { addNewSupplierAPI } from "../../api/supplier";
import { AuthContext } from "../../context/auth-context";
import { errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";
import { addNewCustomerAPI } from "../../api/customer";
import { getAllOutlets } from "../../api/outlet";

const AddNewCustomers = () => {
  const { token, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const metaPageData = {
    title: "Add Customers",
    href: "all-customers",
    header: ["Customers / ", "add-customer"],
    icon: faUser,
  };

  const [listOutlets, setListOutlets] = useState(null);

  const [formValue, setformValue] = useState({
    customerFullName: null,
    phoneNumber: null,
    address: null,
    email: null,
    outletId: null,
  });

  const handleChange = (e) => {
    setformValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(formValue);

    addNewCustomerAPI(formValue, token)
      .then((response) => {
        successReturnConfAlert("Success", "Successfully add new customer !").then(() => {
          navigate("../all-customers");
        });
      })
      .catch((err) => {
        errorReturnConfAlert("Failed", "add new customer failed !");
        console.log(err);
      });
  };

  useEffect(() => {
    getAllOutlets(token)
      .then((response) => {
        setListOutlets(response.data);
        setformValue({ outletId: response.data[0].outletId });
        if (currentUser.userRole == "STORE_ADMIN") {
          setformValue({ outletId: currentUser.outletId });
        }
      })
      .catch((err) => {
        alert("Error Occured !");
        console.log(err);
      });
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        <div className="row my-4 p-3 p-0 m-0 border rounded">
          <form onSubmit={handleSubmit} method="POST">
            <div className="my-3">
              <div className="col-lg-12">
                <div className="my-3">
                  <h3 className="mb-3">Customer Details</h3>

                  <div class="mb-3">
                    <label for="customerFullName" class="form-label">
                      Customer Name / Person Name
                    </label>
                    <input type="text" class="form-control" id="customerFullName" required name="customerFullName" value={formValue.customerFullName} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="address" class="form-label">
                      Address
                    </label>
                    <textarea name="address" id="address" className="form-control" rows="6" required onChange={handleChange} value={formValue.address}></textarea>
                  </div>
                </div>

                <div className="my-3">
                  <h3 className="mb-3">Contact </h3>
                  <div class="mb-3">
                    <label for="phoneNumber" class="form-label">
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

                {currentUser.userRole != "STORE_ADMIN" && (
                  <>
                    <div className="my-3">
                      <h3 className="mb-3">Relation </h3>
                      <div class="mb-3">
                        <label for="address" class="form-label">
                          Outlet Id
                        </label>
                        {listOutlets !== null && listOutlets.length > 0 && (
                          <>
                            <select name="outletId" id="outletId" className="form-control" value={formValue.outletId} onChange={handleChange}>
                              {listOutlets.map((value, index) => (
                                <>
                                  <option key={value.outletId} value={value.outletId}>
                                    {value.outletName}
                                  </option>
                                </>
                              ))}
                            </select>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
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

export default AddNewCustomers;
