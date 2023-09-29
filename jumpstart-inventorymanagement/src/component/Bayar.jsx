import React, { useEffect, useState, useRef, useContext } from "react";

const Bayar = ({ totalPrice, purchaseId, handleReceive }) => {
  const [paidFor, setPaidFor] = useState(false);
  const [loaded, setLoaded] = useState(false);

  let paypalRef = useRef();

  const product = {
    price: totalPrice,
    description: "Units",
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=AQ3v3WPUoNwBFs1kJm-yugkgZ7pB55GkZPuDkistpFcmdusG-KdHylMEf-YE0Kq3S3wvk5jN6VpBu15o&currency=USD&disable-funding=card&intent=authorize`;
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

export default Bayar;
