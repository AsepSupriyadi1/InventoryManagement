import { faCartPlus, faPencil, faSearch, faTrash, faTruck, faWarehouse } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { deleteSupplierAPI, getAllSupplierAPI } from "../../api/supplier";
import { AuthContext } from "../../context/auth-context";
import { returnConfirm } from "../../alert/sweetAlert";
import Swal from "sweetalert2";

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

  const getAllSupplier = () => {
    getAllSupplierAPI(token)
      .then((response) => {
        setListSupplier(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  };

  const deleteSupplier = (supplierId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSupplierAPI(token, supplierId)
          .then(() => {
            getAllSupplier();
            Swal.fire("Deleted!", "Supplier has been deleted.", "success");
          })
          .catch(() => {
            Swal.fire("Deleted!", "Failed to delete supplier", "error");
          });
      }
    });
  };

  useEffect(() => {
    getAllSupplier();
  }, []);

  const actionsSupplierBody = (supplierId) => {
    return (
      <>
        <div className="text-center">
          <Link to={"../detail-supplier/" + supplierId} className="btn btn-primary">
            <FontAwesomeIcon icon={faPencil} /> Details
          </Link>

          <span className="px-2 text-dark">|</span>
          <button className="btn btn-danger" onClick={() => deleteSupplier(supplierId)}>
            <FontAwesomeIcon icon={faTrash} /> Delete
          </button>
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
        <Column field="phoneNumber" header="Phone Number"></Column>
        <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.supplierId)}></Column>
      </DataTable>
    </Layout>
  );
};

export default AllSupplier;
