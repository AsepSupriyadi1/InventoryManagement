import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { DataTable } from "primereact/datatable";
import { Alert, Table } from "react-bootstrap";
import { useContext, useState } from "react";
import { registerAPI } from "../../api/auth";
import { successConfAlert } from "../../alert/sweetAlert";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

const AddUser = () => {
  const [show, setShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [formValue, setformValue] = useState({
    email: "",
    password: "",
    fullName: "",
    country: "",
  });

  const handleChange = (event) => {
    setformValue({
      ...formValue,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    registerAPI(formValue, token)
      .then(() => {
        successConfAlert("Success !", "User added successfully");
        navigate("/all-users");
      })
      .catch((err) => {
        console.log(err.response);
        setErrorMessage("errror co");
      });
  };

  const metaPageData = {
    title: "Add New Users",
    href: "all-users",
    header: ["Users / ", "add-user"],
    icon: faUserPlus,
  };

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        <div className="row my-4 p-3 p-0 m-0 border rounded">
          <form onSubmit={handleSubmit} method="POST">
            <h3 className="mb-3">General Informations</h3>

            {errorMessage !== "" && (
              <Alert key="danger" variant="danger">
                Error Occured
              </Alert>
            )}

            <div className="mb-3">
              <label htmlFor="fullName" className="form-label">
                Full Name : <span className="text-danger">*</span>
              </label>
              <input type="text" name="fullName" className="form-control" id="fullName" aria-describedby="emailHelp" required onChange={handleChange} value={formValue.fullName} />
            </div>

            <div className="mb-3">
              <label htmlFor="country" className="form-label">
                Country : <span className="text-danger">*</span>
              </label>
              <select name="country" id="country" className="form-control" onChange={handleChange} value={formValue.country}>
                <option value="">-- choose country -- </option>
                <option value="indonesia">Indonesia</option>
                <option value="singapore">Singapore</option>
                <option value="malaysia">Malaysia</option>
                <option value="philippines">Philippines</option>
                <option value="thailand">Thailand</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email : <span className="text-danger">*</span>
              </label>
              <input type="email" name="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={handleChange} value={formValue.email} required />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password : <span className="text-danger">*</span>
              </label>
              <input type="password" name="password" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={handleChange} value={formValue.password} required />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add new account
            </button>
          </form>
        </div>
      </Layout>
    </>
  );
};

export default AddUser;
