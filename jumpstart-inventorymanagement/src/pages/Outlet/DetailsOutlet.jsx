import { faShop } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { successReturnConfAlert } from "../../alert/sweetAlert";
import { getDetailOutletAPI, updateOutletAPI } from "../../api/outlet";

const DetailOutlet = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  // -=-=-=-=-=-=-=-=-= FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const [outletDetails, setOutletDetails] = useState(null);
  const [checked, setChecked] = useState(false);
  const [formValue, setformValue] = useState({
    outletName: null,
    phoneNumber: null,
    country: null,
    outletAddress: null,
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

    const data = {
      outletName: formValue.outletName,
      phoneNumber: formValue.phoneNumber,
      country: formValue.country,
      outletAddress: formValue.outletAddress,
      outletActive: checked,
    };

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
        setformValue({
          outletName: data.outletName,
          phoneNumber: data.phoneNumber,
          country: data.country,
          outletAddress: data.outletAddress,
        });
        setChecked(data.outletActive);
      })
      .catch((err) => {
        console.log(err);
        // navigate("/all-outlets");
      });
  };

  useEffect(() => {
    getDetailOutlet(params.outletId);
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

                    <div className="mb-3">
                      <label for="country" class="form-label">
                        Country
                      </label>
                      <select name="country" id="country" className="form-control" value={formValue.country} onChange={handleChange}>
                        <option value="">-- choose country -- </option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Vietnam">Vietnam</option>
                        <option value="India">India</option>
                      </select>
                    </div>

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
