import { faShop } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { Link, useNavigate, useParams } from "react-router-dom";
import { successReturnConfAlert } from "../../alert/sweetAlert";
import { getDetailOutletAPI, updateOutletAPI } from "../../api/outlet";
import { getAllAvailableStaffsAPI } from "../../api/user";

const DetailOutlet = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  const [listAvailableStaff, setListAvailableStaff] = useState(null);

  // -=-=-=-=-=-=-=-=-= FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const [outletDetails, setOutletDetails] = useState(null);
  const [checked, setChecked] = useState(false);
  const [formValue, setformValue] = useState({
    outletName: null,
    phoneNumber: null,
    outletAddress: null,
    userId: null,
  });
  // -=-=-=-=-=-=-=-=-= END OF FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  const metaPageData = {
    title: "Detail Outlet",
    href: "all-outlets",
    header: ["outlets / ", "detail outlet"],
    icon: faShop,
  };

  const [isShowButton, setShowSubmitButton] = useState(false);

  const handleChange = (e) => {
    setShowSubmitButton(true);
    setformValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleCheckedChange = () => {
    setShowSubmitButton(true);
    setChecked(!checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("outletName", formValue.outletName);
    data.append("phoneNumber", formValue.phoneNumber);
    data.append("outletAddress", formValue.outletAddress);
    data.append("outletActive", checked);
    data.append("staffId", formValue.userId);

    console.log(data.get("outletName"));
    console.log(data.get("phoneNumber"));
    console.log(data.get("outletAddress"));
    console.log(data.get("outletActive"));
    console.log(data.get("staffId"));

    updateOutletAPI(token, data, params.outletId).then(() => {
      successReturnConfAlert("Update Success", "Outlet updated successfully !")
        .then(() => {
          navigate("../all-outlets");
        })
        .catch((err) => {
          alert("error occured");
          console.log(err);
        });
    });
  };

  const getDetailOutlet = (outletId) => {
    getDetailOutletAPI(token, outletId)
      .then((response) => {
        let data = response.data;
        setOutletDetails(response.data);
        console.log(data);

        const detailsData = {
          outletName: data.outletName,
          phoneNumber: data.phoneNumber,
          outletAddress: data.outletAddress,
        };

        if (data.userApp !== null) detailsData.userId = data.userApp.userId;

        setformValue(detailsData);

        setChecked(data.outletActive);
      })
      .catch((err) => {
        console.log(err);
        // navigate("/all-outlets");
      });
  };

  useEffect(() => {
    getDetailOutlet(params.outletId);

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
        {outletDetails !== null && (
          <>
            <div className="row my-4">
              <form onSubmit={handleSubmit} method="POST">
                <div className="row  d-md-flex flex-column-reverse  flex-lg-row">
                  <div className="col-md-8">
                    <h3 className="my-3">General Information</h3>
                    <div className="mb-3">
                      <label htmlFor="outletName">Outlet Name : </label>
                      <input type="text" className="form-control fs-3 input__type1" name="outletName" id="outletName" required value={formValue.outletName} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="outletAddress">Outlet Address : </label>
                      <textarea rows="3" className="form-control input__type1 bg-light" name="outletAddress" id="outletAddress" required value={formValue.outletAddress} onChange={handleChange}></textarea>
                    </div>
                  </div>

                  <div className="col-md">
                    <h3 className="my-3">Contact</h3>
                    <div className="mb-3">
                      <label htmlFor="phoneNumber">Phone Number : </label>
                      <input type="text" className="form-control  input__type1" name="phoneNumber" id="phoneNumber" required value={formValue.phoneNumber} onChange={handleChange} />
                    </div>

                    {outletDetails.userApp === null && (
                      <>
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
                                      {value.fullName}
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
                      </>
                    )}

                    <div class="mb-3">
                      <h3 className="my-3">Status</h3>
                      <div className="mb-3">
                        <label htmlFor="isOutletActive">Is Outlet Active ? : </label>
                        <input type="checkbox" name="isOutletActive" id="isOutletActive" checked={checked} onChange={handleCheckedChange} />
                      </div>
                    </div>
                  </div>
                </div>

                {isShowButton && (
                  <>
                    <div className="d-flex">
                      <button type="button" className="btn btn-outline-primary py-3 w-100 mt-4 m-2" onClick={() => getDetailOutlet(params.outletId)}>
                        Reset Form
                      </button>
                      <button type="submit" className="btn btn-primary py-3 w-100 mt-4 m-2">
                        Save Outlet
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          </>
        )}
      </Layout>
    </>
  );
};

export default DetailOutlet;
