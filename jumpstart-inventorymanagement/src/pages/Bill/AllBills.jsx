import { faCartPlus, faDollar, faPencil, faSearch, faTrash, faTruck, faWarehouse } from "@fortawesome/free-solid-svg-icons";
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
import { getAllPurchasesAPI } from "../../api/purchases";

const AllBills = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState(null);
  const [listPurchases, setListPurchases] = useState(null);

  const metaPageData = {
    title: "All Purchases",
    href: "all-purchases",
    header: ["purchases", ""],
    icon: faTruck,
  };

  useEffect(() => {
    getAllPurchasesAPI(token)
      .then((response) => {
        setListPurchases(response.data);
      })
      .catch((err) => {
        alert("error occured");
        console.log(err);
      });
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData} />
        <div className="d-flex justify-content-between my-4">
          <Link to={"/add-bills"}>
            <button className="btn btn-primary">
              Add New Bills <FontAwesomeIcon icon={faDollar} />
            </button>
          </Link>
        </div>

        <DataTable value={listPurchases} tableStyle={{ minWidth: "50rem" }}>
          <Column field="purchaseCode" header="Bills Code"></Column>
          <Column field="staffCode" header="Staff"></Column>
          <Column field="supplierCode" header="Supplier"></Column>
          <Column field="dateTime" header="Date Created"></Column>
          <Column field="purchasesStatus" header="Status"></Column>
          {/* <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.supplierId)}></Column> */}
        </DataTable>
      </Layout>
    </>
  );
};

export default AllBills;
