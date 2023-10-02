import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { customerMakePaymentAPI, transactionInfoAPI } from "../../api/transaction";
import { AuthContext } from "../../context/auth-context";
import { ListGroup } from "react-bootstrap";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import CustomerPay from "./CustomerPay";
import { successReturnConfAlert } from "../../alert/sweetAlert";

const DetailTransaction = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let data = new FormData();
    data.append("paymentToken", searchParams.get("token"));

    transactionInfoAPI(data)
      .then((response) => {
        let data = response.data;
        setTransactionDetails(data);
      })
      .catch((err) => {
        setError(true);
      });
  }, []);

  const handlePayBills = (transactionId) => {
    customerMakePaymentAPI(transactionId, searchParams.get("token"))
      .then(() => {
        successReturnConfAlert("Success", "Bills payed successfully !");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {error && (
        <div className="container" style={{ width: "50%" }}>
          <div className="text-center my-5">
            <h1>Token Not Found</h1>
          </div>
        </div>
      )}
      {!error && transactionDetails && (
        <>
          <div className="container border my-5" style={{ width: "50%" }}>
            <div className="text-center my-5">
              <h1>Jumpstart - Transaction</h1>
            </div>

            <div className="row">
              <div>
                <table>
                  <tr>
                    <td>Customer Name</td>
                    <td>
                      <span className="px-2">:</span>
                    </td>
                    <td>{transactionDetails.transaction.customerName}</td>
                  </tr>
                  <tr>
                    <td>Outlet Name</td>
                    <td>
                      <span className="px-2">:</span>
                    </td>
                    <td>{transactionDetails.transaction.outlet.outletName}</td>
                  </tr>
                </table>
              </div>

              <div className="my-3">
                <div className="row min-scroll">
                  <DataTable value={transactionDetails.purchasesList} tableStyle={{ minWidth: "50rem" }}>
                    <Column field="productName" header="Product Name"></Column>
                    <Column field="quantity" header="Amount"></Column>
                  </DataTable>
                </div>
              </div>

              <div className="my-3">
                <h3 className="mb-3">Bills Info</h3>
                <ListGroup>
                  <ListGroup.Item>
                    Total Amount : <b>${transactionDetails.transaction.totalAmount}</b>
                  </ListGroup.Item>
                </ListGroup>
              </div>

              <div>
                <CustomerPay totalPrice={transactionDetails.transaction.totalAmount} purchaseId={transactionDetails.transaction.transactionId} handleReceive={() => handlePayBills(transactionDetails.transaction.transactionId)} />
                {/* <button onClick={() => handlePayBills(transactionDetails.transaction.transactionId)} className="w-100 btn btn-primary">
                  Pay Transaction
                </button> */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default DetailTransaction;
