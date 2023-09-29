import React from "react";
import ReactDOM from "react-dom";
const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });
class BayarComponent extends React.Component {
  createOrder(data) {
    // Order is created on the server and the order id is returned
    return fetch("/my-server/create-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // use the "body" param to optionally pass additional order information
      // like product skus and quantities
      body: JSON.stringify({
        cart: [
          {
            sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
            quantity: "YOUR_PRODUCT_QUANTITY",
          },
        ],
      }),
    })
      .then((response) => response.json())
      .then((order) => order.id);
  }
  onApprove(data) {
    // Order is captured on the server
    return fetch("/my-server/capture-paypal-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderID: data.orderID,
      }),
    }).then((response) => response.json());
  }
  render() {
    return <PayPalButton createOrder={(data, actions) => this.createOrder(data)} onApprove={(data, actions) => this.onApprove(data)} />;
  }
}
