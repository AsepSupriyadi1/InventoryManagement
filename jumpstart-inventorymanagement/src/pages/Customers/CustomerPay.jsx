import React, { useEffect, useState, useRef, useContext } from "react";

const CustomerPay = ({ totalPrice, purchaseId, handleReceive }) => {
  const [paidFor, setPaidFor] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();

  const product = {
    price: totalPrice,
    description: "Units",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=ATgJg52soFPhR9Qj0fegdLo0K-D_DL4si8Pa04lfjEfhR62MDSHGI3BCKD3QLx4ec1IY6KBht0tuT148&currency=USD&disable-funding=card&intent=authorize`;
    script.addEventListener("load", () => {
      setLoaded(true);
    });
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (loaded) {
      window.paypal
        .Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  description: product.description,
                  amount: {
                    currency_code: "USD",
                    value: product.price,
                  },
                },
              ],
            });
          },
          onApprove: async (data, actions) => {
            // const order = await actions.order.capture();
            setPaidFor(true);
            handleReceive();
          },
        })
        .render(paypalRef);
    }
  }, [loaded]);

  return (
    <>
      <div ref={(v) => (paypalRef = v)}></div>
    </>
  );
};

export default CustomerPay;
