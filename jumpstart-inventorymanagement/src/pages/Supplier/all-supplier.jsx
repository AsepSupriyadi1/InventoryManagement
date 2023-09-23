import { faCartPlus, faPencil, faSearch, faTrash, faTruck, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { getAllSupplierAPI } from "../../api/supplier";
import { AuthContext } from "../../context/auth-context";

const AllSupplier = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState(null);
  const [listSupplier, setListSupplier] = useState(null);

  const metaPageData = {
    title: "Suppliers",
    href: "all-suppliers",
    header: ["suppliers", ""],
    icon: faTruck,
  };

  useEffect(() => {
    getAllSupplierAPI(token)
      .then((response) => {
        setListSupplier(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  }, []);

  const actionsSupplierBody = (supplierId) => {
    return (
      <>
        <div className="text-center">
          <Link to={"../detail-supplier/" + supplierId} className="btn btn-primary">
            <FontAwesomeIcon icon={faPencil} /> Details
          </Link>

          {/* <span className="px-2 text-dark">|</span>
          <a className="btn btn-danger">
            <FontAwesomeIcon icon={faTrash} /> Delete
          </a> */}
        </div>
      </>
    );
  };

  return (
    <Layout>
      <DashHeading data={metaPageData} />
      <div className="d-flex justify-content-between my-4">
        <form action="" className="d-flex">
          <input type="text" className="form-control" placeholder="Search a supplier" />
          <button className="btn btn-secondary">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>

        <Link to={"/add-supplier"}>
          <button className="btn btn-primary">
            New Supplier <FontAwesomeIcon icon={faWarehouse} />
          </button>
        </Link>
      </div>
      <div className="row"></div>

      <DataTable value={listSupplier} tableStyle={{ minWidth: "50rem" }}>
        <Column field="supplierName" header="Name"></Column>
        <Column field="companyName" header="Company Name"></Column>
        <Column
          header="Country"
          body={(rowData) => (
            <>
              <span className="text-capitalize">{rowData.country}</span>
            </>
          )}
        ></Column>
        <Column field="phoneNumber" header="Phone Number"></Column>
        <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.supplierId)}></Column>
      </DataTable>
    </Layout>
  );
};

export default AllSupplier;
