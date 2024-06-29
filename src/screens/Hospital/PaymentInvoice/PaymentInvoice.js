import React, { useEffect, useRef, useState } from "react";
import "./PaymentInvoice.css";
import hospitallogo from "../../../assets/images/png/hospitallogo.png";
import CustomButton from "../../../components/CustomButton";
import { Grid } from "@mui/material";
import { useReactToPrint } from "react-to-print";

const PaymentInvoice = () => {
  const [item, setItem] = useState(null);
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  useEffect(() => {
    const storedItem = localStorage?.getItem("selectedItem");
    if (storedItem) {
      setItem(JSON.parse(storedItem));
    }
  }, []);

  const contentToPrint = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  return (
    <>
      <div ref={contentToPrint} className="bg">
        <div>
          <div className="upper-row">
            <img
              src={profile?.image ?? hospitallogo}
              className="h75ml30img"
              alt=""
            />
            <div className="header-main-text">INVOICE</div>
            <div className="header-right-text2">
              Business address <br />
              City, State, IN - 000 000 <br />
              TAX ID 00XXXXX1234X0XX
            </div>
          </div>
        </div>
        <div className="line"></div>
        <div className="lower-container">
          <div className="box-container">
            <div className="row-container">
              <div>
                <div className="colum-header">Pet Name</div>
                <div className="colum-data">{item?.petName}</div>
              </div>
              <div>
                <div className="colum-header">Parent Name</div>
                <div className="colum-data">Aditya</div>
              </div>
              <div>
                <div className="colum-header">Invoice Number</div>
                <div className="colum-data">#AB2324-01</div>
              </div>
              <div>
                <div className="colum-header">Invoice Date</div>
                <div className="colum-data">{item?.trDate}</div>
              </div>
            </div>

            <div className="thin-line"></div>

            <table className="custom-table">
              <thead>
                <tr>
                  <th>Service / Item Name</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Discount (rs)</th>
                  <th>tax(%)</th>
                  <th>total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <b>Consultation (Physical)</b>
                  </td>
                  <td>1</td>
                  <td>Rs 500</td>
                  <td>1</td>
                  <td>-</td>
                  <td>Rs 500</td>
                </tr>
                <tr>
                  <td>
                    <b>Prescription </b>
                    <br />
                    Crocin
                  </td>
                  <td>10</td>
                  <td>Rs 100</td>
                  <td>10</td>
                  <td>-</td>
                  <td>Rs 90</td>
                </tr>
                <tr>
                  <td colSpan="6">
                    <hr className="thin-line2" />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td>
                    <b>
                      SubTotal <br /> (Tax 10%)
                    </b>
                  </td>
                  <td colSpan="1"></td>
                  <td>
                    <b>Rs 590</b>
                  </td>
                </tr>
                <tr>
                  <td colSpan="2">
                    <hr className="thin-line1" />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3"></td>
                  <td>
                    <b>Total</b>
                  </td>
                  <td colSpan="1"></td>
                  <td>
                    <b>Rs 590</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="back-white">
        <div className="clinic-mod-btn-pos">
          <div className="mr20 mv20">
            <CustomButton
              text={"Download"}
              onClick={() => {
                handlePrint(null, () => contentToPrint.current);
              }}
            />
          </div>
        </div>
      </Grid>
    </>
  );
};

export default PaymentInvoice;
