import { faCartPlus, faTruck } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { getAllAvailableStaffsAPI } from "../../api/user";
import { AuthContext } from "../../context/auth-context";
import { addNewOutletAPI } from "../../api/outlet";
import { errorReturnConfAlert, successReturnConfAlert } from "../../alert/sweetAlert";

const AddOutlet = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [listAvailableStaff, setListAvailableStaff] = useState(null);

  const metaPageData = {
    title: "Add Outlet",
    href: "all-suppliers",
    header: ["Suppliers / ", "add-supplier"],
    icon: faTruck,
  };

  const [formValue, setformValue] = useState({
    outletName: null,
    phoneNumber: null,
    outletAddress: null,
    userId: null,
    country: null,
  });

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addNewOutletAPI(formValue, token)
      .then((response) => successReturnConfAlert("Success", "Outlet added succcessfully").then(() => navigate("../all-outlets")))
      .catch((err) => {
        errorReturnConfAlert("Failed", "Outlet must have the same country !");
      });
  };

  useEffect(() => {
    getAllAvailableStaffsAPI(token)
      .then((response) => {
        console.log(response.data);
        setListAvailableStaff(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />

        <div className="row my-4 p-3 p-0 m-0 border rounded">
          <form onSubmit={handleSubmit}>
            <div className="my-3">
              <div className="col-lg-12">
                <div className="my-3">
                  <h3 className="mb-3">Outlet Details</h3>

                  <div class="mb-3">
                    <label for="outletName" class="form-label">
                      Outlet Name
                    </label>
                    <input type="text" class="form-control" id="outletName" required name="outletName" value={formValue.outletName} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="phoneNumber" class="form-label">
                      Phone Number
                    </label>
                    <input type="text" class="form-control" id="phoneNumber" required name="phoneNumber" value={formValue.phoneNumber} onChange={handleChange} />
                  </div>
                </div>

                <div className="my-3">
                  <h3 className="mb-3">Region</h3>
                  <div class="mb-3">
                    <label for="address" class="form-label">
                      Outlet Address
                    </label>
                    <input type="text" class="form-control" id="address" required name="outletAddress" value={formValue.outletAddress} onChange={handleChange} />
                  </div>

                  <div class="mb-3">
                    <label for="country" class="form-label">
                      Country
                    </label>
                    <select name="country" id="country" className="form-control" value={formValue.country} onChange={handleChange}>
                      <option value="">-- choose country -- </option>
                      <option value="indonesia">Indonesia</option>
                      <option value="singapore">Singapore</option>
                      <option value="malaysia">Malaysia</option>
                      <option value="philippines">Philippines</option>
                      <option value="thailand">Thailand</option>
                    </select>
                  </div>
                </div>

                <div className="my-3">
                  <h3 className="mb-3">Relations</h3>

                  <div class="mb-3">
                    <label for="staff" class="form-label">
                      Staff
                    </label>

                    {listAvailableStaff !== null && listAvailableStaff.length > 0 ? (
                      <>
                        <select name="userId" id="country" className="form-control" value={formValue.userId} onChange={handleChange}>
                          <option value={null}>-- choose available staff -- </option>

                          {listAvailableStaff.map((value, index) => (
                            <>
                              <option key={value.userId} value={value.userId}>
                                {value.fullName} ~ {value.country}
                              </option>
                            </>
                          ))}
                        </select>
                      </>
                    ) : (
                      <>
                        <small>
                          No Staff available,
                          <Link to="../all-users" className="ps-2">
                            All Staff
                          </Link>
                        </small>
                      </>
                    )}
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

export default AddOutlet;
