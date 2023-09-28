import { faPencil, faPlus, faPlusSquare, faRefresh, faSearch, faShop, faTrash } from "@fortawesome/free-solid-svg-icons";
import Layout from "../../component/Layout";
import DashHeading from "../../component/part/DashHeading";
import { ContohProduct } from "../../assets/images/_images";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useContext, useEffect, useState } from "react";
import { getAllOutlets } from "../../api/outlet";
import { AuthContext } from "../../context/auth-context";
import { Badge } from "react-bootstrap";
import { InputText } from "primereact/inputtext";

const AllOutlet = () => {
  const { token } = useContext(AuthContext);

  const metaPageData = {
    title: "All Outlets",
    href: "all-outlets",
    header: ["all-outlets", ""],
    icon: faShop,
  };

  const [listOutlets, setListOutlets] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);

  const actionsSupplierBody = (outletId) => {
    return (
      <>
        <div className="text-center">
          <Link to={"../detail-outlet/" + outletId} className="btn btn-primary">
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

  const [filter, setFilter] = useState("");

  const filterItems = () => {
    const filteredItems = listOutlets.filter((item) => item.outletName.toLowerCase().includes(filter.toLowerCase()));
    setListOutlets(filteredItems);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);

    if (filter.length > 2) {
      filterItems(filter);
    } else {
      findAllOutlet();
    }
  };

  const handleClear = () => {
    setFilter("");
    findAllOutlet();
  };

  const findAllOutlet = () => {
    getAllOutlets(token)
      .then((response) => {
        setListOutlets(response.data);
        console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    findAllOutlet();
  }, []);

  return (
    <>
      <Layout>
        <DashHeading data={metaPageData}></DashHeading>

        <div className="d-flex justify-content-between my-4">
          <div className="d-flex">
            <input type="text" className="form-control" placeholder="Search an Outlet" value={filter} onChange={handleFilterChange} />

            {filter.length >= 1 && (
              <>
                <button className="btn btn-primary" onClick={handleClear}>
                  <FontAwesomeIcon icon={faRefresh} />
                </button>
              </>
            )}
          </div>

          <Link to={"/add-outlet"}>
            <button className="btn btn-primary">
              New Outlet <FontAwesomeIcon icon={faPlusSquare} />
            </button>
          </Link>
        </div>

        <div className="row min-scroll">
          <DataTable value={listOutlets} dataKey="outletId" globalFilter={globalFilter} tableStyle={{ minWidth: "50rem" }}>
            <Column field="outletName" header="Outlet Name"></Column>
            <Column field="outletCode" header="Outlet Code"></Column>
            <Column header="Staff Name" body={(rowData) => (rowData.userApp === null ? <span>No Staff</span> : <span>{rowData.userApp.fullName}</span>)}></Column>
            <Column field="outletActive" header="Is Active ?" body={(rowData) => (rowData.outletActive ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Inactive</Badge>)}></Column>
            <Column header="actions" body={(rowData) => actionsSupplierBody(rowData.outletId)}></Column>
          </DataTable>
        </div>
      </Layout>
    </>
  );
};

export default AllOutlet;
