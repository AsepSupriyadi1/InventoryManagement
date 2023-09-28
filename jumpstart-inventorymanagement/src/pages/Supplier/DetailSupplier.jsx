import { faTruck } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { HeaderPic } from "../../assets/images/_images";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { AuthContext } from "../../context/auth-context";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailSupplierAPI, updateSupplier } from "../../api/supplier";
import { successReturnConfAlert } from "../../alert/sweetAlert";

const DetailSupplier = () => {
  const { token } = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();
  const [listPayables, setListPayables] = useState(null);

  // -=-=-=-=-=-=-=-=-= FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
  const [supplierDetails, setSupplierDetails] = useState(null);
  const [formValue, setformValue] = useState({
    supplierName: null,
    address: null,
    companyName: null,
    phoneNumber: null,
    email: null,
  });
  // -=-=-=-=-=-=-=-=-= END OF FORM STATE -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=

  const metaPageData = {
    title: "Detail Supplier",
    href: "all-suppliers",
    header: ["suppliers / ", "detail supplier"],
    icon: faTruck,
  };

  const [isShowButton, setShowSubmitButton] = useState(false);

  const handleChange = (e) => {
    setShowSubmitButton(true);
    setformValue({ ...formValue, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    updateSupplier(token, formValue, params.supplierId).then((response) => {
      successReturnConfAlert("Update Success", "Supplier updated successfully !")
        .then(() => {
          navigate("../all-suppliers");
        })
        .catch((err) => {
          alert("error occured");
          console.log(err);
        });
    });
  };

  const getDetailsSupplier = (supplierId) => {
    getDetailSupplierAPI(token, supplierId)
      .then((response) => {
        let data = response.data;
        setSupplierDetails(response.data);
        setformValue({
          supplierName: data.supplierName,
          country: data.country,
          address: data.address,
          companyName: data.companyName,
          phoneNumber: data.phoneNumber,
          email: data.email,
        });
      })
      .catch((err) => {
        navigate("/all-suppliers");
      });
  };

  useEffect(() => {
    getDetailsSupplier(params.supplierId);
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        {supplierDetails !== null && (
          <>
            <div className="row my-4">
              <form onSubmit={handleSubmit} method="POST">
                <div className="row  d-md-flex flex-column-reverse  flex-lg-row">
                  <div className="col-md-8">
                    <h3 className="my-3">General Information</h3>
                    <div className="mb-3">
                      <label htmlFor="supplierName">Supplier Name : </label>
                      <input type="text" className="form-control fs-3 input__type1" name="supplierName" id="supplierName" required value={formValue.supplierName} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="address">Supplier Address : </label>
                      <textarea rows="3" className="form-control input__type1 bg-light" name="address" id="address" required value={formValue.address} onChange={handleChange}></textarea>
                    </div>
                  </div>

                  <div className="col-md">
                    <h3 className="my-3">Contact</h3>
                    <div className="mb-3">
                      <label htmlFor="phoneNumber">Phone Number : </label>
                      <input type="text" className="form-control  input__type1" name="phoneNumber" id="phoneNumber" required value={formValue.phoneNumber} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email">Email Address : </label>
                      <input type="email" className="form-control input__type1" name="email" id="email" required value={formValue.email} onChange={handleChange} />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="companyName">Company Name : </label>
                      <input type="text" className="form-control  input__type1" name="companyName" id="companyName" required value={formValue.companyName} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                {isShowButton && (
                  <>
                    <div className="d-flex">
                      <button type="button" className="btn btn-outline-primary py-3 w-100 mt-4 m-2" onClick={() => getDetailsSupplier(params.supplierId)}>
                        Reset Form
                      </button>
                      <button type="submit" className="btn btn-primary py-3 w-100 mt-4 m-2">
                        Save Supplier
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

export default DetailSupplier;
