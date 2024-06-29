import React, { useEffect, useRef, useState } from "react";
import Table from "../../../components/CustomTable";
import editImage from "../../../assets/images/png/edit.png";
import deleteImage from "../../../assets/images/png/delete.png";
import CustomButton from "../../../components/CustomButton";
import { Grid, Typography } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Checkbox from "../../../components/CustomCheckbox";
import print from "../../../assets/images/png/print.png";
import "./History.css";
import CommonClinicPetDetails from "../../CommonScreens/CommonClinicPetDetails/CommonClinicPetDetails";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPetsCompliantSummary } from "../../../redux/reducers/petSlice";
import {
  addBillingItemsByPaymentId,
  deletePaymentItemById,
  getBillDetailsByPaymentId,
  getProductsByClinic,
  getServices,
  updateBillingByPaymentId,
  updateBillingItemsByPaymentId,
} from "../../../redux/reducers/clinicSlice";
import Select from "../../../components/Select/Select";
import { useReactToPrint } from "react-to-print";

const tableHeaders = [
  "serviceitemname",
  "qty",
  "unitPrice",
  "tax",
  "total",
  "pay",
];

const initialValues = { type: "services", name: "", quantity: "" };
const initialDiscount = { type: "price", amt: "" };
const initialPayments = {
  subTotal: 0,
  tax: "-",
  discount: 0,
  amtPaid: 0,
  balDue: 0,
};

export default function History() {
  const location = useLocation();
  const dispatch = useDispatch();
  const contentToPrint = useRef(null);
  const billDetails = useSelector((state) => state?.clinic?.billDetails);
  const [tableData, setTableData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemValues, setItemValues] = useState(initialValues);
  const [discountValues, setDiscountValues] = useState(initialDiscount);
  const [modVisible, setModVisible] = useState(false);
  const [discountModVisible, setDiscountModVisible] = useState(false);
  const [delModVisible, setDelModVisible] = useState(false);
  const { products, services } = useSelector((state) => state?.clinic);
  const [productList, setProductList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [itemTtlAmt, setItemTtlAmt] = useState(0);
  const [paymentDetails, setPaymentDetails] = useState(initialPayments);

  useEffect(() => {
    if (location?.state?.bill?.appointmentId) {
      dispatch(getPetsCompliantSummary(location?.state?.bill?.appointmentId));
    }
    if (location?.state?.bill?.paymentId) {
      dispatch(getBillDetailsByPaymentId(location?.state?.bill?.paymentId));
    }
    dispatch(getProductsByClinic());
    dispatch(getServices());
  }, []);

  useEffect(() => {
    getTableData();
    getPaymentDetails();
  }, [billDetails]);

  useEffect(() => {
    if (products?.data && services) {
      getProductAndServiceListForDropdown();
    }
  }, [products, services]);

  const getPaymentDetails = () => {
    let subTotal = 0,
      tax = 0,
      discount = 0,
      balDue = 0;

    billDetails?.paymentDetails?.map((pd) => {
      tax = tax + Number(pd?.tax) ?? 0;
      subTotal = subTotal + pd?.total;
    });
    subTotal = subTotal + tax;
    if (discountValues?.type && Number(discountValues?.amt) > 0) {
      if (discountValues?.type === "price") {
        discount = Number(discountValues?.amt);
      }
      if (discountValues?.type === "percentage") {
        discount = (subTotal / 100) * Number(discountValues?.amt);
      }
    }
    balDue = subTotal - (discount + billDetails?.amtPaid);
    setPaymentDetails({ ...paymentDetails, subTotal, tax, discount, balDue });
  };

  const getProductAndServiceListForDropdown = () => {
    const reqProducts = products?.data?.map((pd) => {
      return { ...pd, value: pd?.productId };
    });
    setProductList(reqProducts);
    const reqServices = services?.map((ser) => {
      return { ...ser, name: ser?.serviceName, value: ser?.serviceId };
    });
    setServiceList(reqServices);
  };

  const handleDelete = (bill) => {
    setSelectedItem(bill);
    setDelModVisible(true);
  };

  const handleDelConfirm = async () => {
    const apiRes = await dispatch(
      deletePaymentItemById(selectedItem?.paymentDetailId)
    );
    if (apiRes?.payload) {
      dispatch(getBillDetailsByPaymentId(location?.state?.bill?.paymentId));
      setSelectedItem(null);
      setDelModVisible(false);
    }
  };

  const handleEdit = (bill) => {
    setSelectedItem(bill);
    setItemTtlAmt(Number(bill?.total));
    setItemValues({
      type: bill?.type + "s",
      name: bill?.serviceOrProductId,
      quantity: bill?.quantity,
    });
    setModVisible(true);
  };

  const getTableData = () => {
    const reqTableData = billDetails?.paymentDetails
      ?.filter((pd) => pd?.type !== "consultation")
      ?.map((bil) => {
        return {
          serviceitemname: bil?.name,
          qty: bil?.quantity,
          unitPrice: `Rs ${bil?.price}`,
          tax: bil?.tax > 0 ? `Rs ${bil?.tax}` : "-",
          total: `Rs ${bil?.total}`,
          pay: (
            <div className="flex-row">
              <div className="cursor" onClick={() => handleDelete(bil)}>
                <img src={deleteImage} alt="" className="imghw30" />
              </div>
              <div className="cursor ml15" onClick={() => handleEdit(bil)}>
                <img src={editImage} alt="" className="imghw30" />
              </div>
            </div>
          ),
        };
      });
    const conDet = billDetails?.paymentDetails?.find(
      (pd) => pd?.type === "consultation"
    );
    reqTableData?.splice(0, 0, {
      serviceitemname: `Consultation(${billDetails?.appointmentType})`,
      qty: 1,
      unitPrice: `Rs ${conDet?.price}`,
      tax: Number(conDet?.tax) > 0 ? conDet?.tax : "-",
      total: `Rs ${conDet?.total}`,
    });
    setTableData(reqTableData);
  };

  const onModClose = () => {
    setItemTtlAmt(0);
    setItemValues(initialValues);
    setModVisible(!modVisible);
    setSelectedItem(null);
  };

  const onDiscountModClose = () => {
    setDiscountModVisible(!discountModVisible);
  };

  const onChangeValue = (name, value) => {
    if (name === "type") {
      setItemTtlAmt(0);
      return setItemValues({ ...initialValues, [name]: value });
    }
    if (name === "name") {
      setItemTtlAmt(0);
      return setItemValues({ ...itemValues, [name]: value, quantity: "" });
    }
    setItemValues({
      ...itemValues,
      [name]: name === "quantity" ? (Number(value) > 0 ? value : 1) : value,
    });
    if (name === "quantity") {
      const reqObj = (
        itemValues?.type === "services" ? serviceList : productList
      )?.find(
        (it) =>
          (itemValues?.type === "services" ? it?.serviceId : it?.productId) ===
          itemValues?.name
      );
      setItemTtlAmt(
        Number(reqObj?.sellPrice ?? reqObj?.servicePrice) *
        (Number(value) > 0 ? Number(value) : 1)
      );
    }
  };

  const onChangeDiscount = (name, value) => {
    setDiscountValues({ ...discountValues, [name]: value });
  };

  const handleAddEdit = async () => {
    const selectedName = (
      itemValues?.type === "services" ? serviceList : productList
    )?.find((rl) => (rl?.serviceId ?? rl?.productId) === itemValues?.name);
    const reqObj = {
      name: selectedName?.serviceName ?? selectedName?.name,
      serviceOrProductId: selectedName?.serviceId ?? selectedName?.productId,
      price: selectedName?.sellPrice ?? selectedName?.servicePrice,
      quantity: itemValues?.quantity,
      tax: selectedName?.tax ?? "0",
      total: itemTtlAmt,
      type: itemValues?.type?.slice(0, -1),
    };
    if (selectedItem?.paymentDetailId) {
      reqObj.paymentDetaisId = selectedItem?.paymentDetailId;
    }
    const reqData = {
      paymentId: location?.state?.bill?.paymentId,
      data: reqObj,
    };
    let apiRes = null;
    if (selectedItem) {
      apiRes = await dispatch(updateBillingItemsByPaymentId(reqData));
    } else {
      apiRes = await dispatch(addBillingItemsByPaymentId(reqData));
    }
    if (apiRes?.payload) {
      dispatch(getBillDetailsByPaymentId(location?.state?.bill?.paymentId));
      setSelectedItem(null);
      setModVisible(!modVisible);
      setItemValues(initialValues);
    }
  };

  const handleDelModClose = () => {
    setDelModVisible(false);
    setSelectedItem(null);
  };

  const handleAddDiscount = () => {
    getPaymentDetails();
    onDiscountModClose();
  };

  const handleSavePayment = async () => {
    const reqData = {
      paymentId: location?.state?.bill?.paymentId,
      data: {
        totalAmt: Number(paymentDetails?.subTotal ?? 0),
        amtPaid: Number(billDetails?.amtPaid ?? 0),
        discount: Number(paymentDetails?.discount ?? 0),
        tax: Number(paymentDetails?.tax ?? 0),
      },
    };
    const apiRes = await dispatch(updateBillingByPaymentId(reqData));
    if (apiRes?.payload) {
      setDiscountValues(initialDiscount);
      setPaymentDetails(initialPayments);
      dispatch(getBillDetailsByPaymentId(location?.state?.bill?.paymentId));
    }
  };

  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    // onBeforePrint: () => console.log("before printing..."),
    // onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  return (
    <CommonClinicPetDetails pet={location?.state?.pet}>
      <div className="back-white" ref={contentToPrint}>
        <Table
          columns={tableHeaders}
          datas={tableData}
          grey
          onClickPay={(e) => console.log("e", e)}
        />
        <div className="flex-row ph20">
          <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
            <CustomButton text="Add" onClick={() => setModVisible(true)} />
          </Grid>
          <Grid item xs={5} sm={5} md={3} lg={3} xl={3} className="ml15">
            <CustomButton
              text="Apply Discount"
              onClick={() => setDiscountModVisible(true)}
            />
          </Grid>
        </div>
        <div className="billingcontainer mt20">
          <div className="billingBox">
            <div className="flex-row-between-align-center w60Per">
              <div className="txtstyle">Subtotal</div>
              <div className="txtstyle">Rs {paymentDetails?.subTotal}</div>
            </div>
            <div className="flex-row-between-align-center w60Per">
              <div className="txtstyle">Tax(10%)</div>
              <div className="txtstyle">
                {paymentDetails?.tax > 0 ? `Rs ${paymentDetails?.tax}` : "-"}
              </div>
            </div>
            <div className="flex-row-between-align-center w60Per">
              <div className="txtstyle">Discount</div>
              <div className="txtstyle">
                {paymentDetails?.discount > 0
                  ? `Rs ${paymentDetails?.discount}`
                  : "-"}
              </div>
            </div>
            <div className="flex-row-between-align-center w60Per mt15 amounttxtcontainer">
              <div
                style={{
                  fontSize: "14px",
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  color: "#5D9911",
                }}
              >
                Amount Paid
              </div>
              <div
                style={{
                  fontSize: "14px",
                  fontFamily: "Montserrat",
                  fontWeight: "600",
                  color: "#5D9911",
                }}
              >
                {billDetails?.amtPaid > 0 ? billDetails?.amtPaid : "-"}
              </div>
            </div>
            <div className="flex-row-between-align-center w60Per mt15 balancecontainer">
              <div className="balancetext">Balance due</div>
              <div className="balancetext">Rs {paymentDetails?.balDue}</div>
            </div>
          </div>
        </div>
        <div className="savebutton gap25">
          <div
            className="flex-center"
            onClick={() => {
              handlePrint(null, () => contentToPrint.current);
            }}
          >
            <img src={print} alt="" className="imghw30" />
          </div>
          <Grid item xs={5} sm={5} md={1} lg={1} xl={1}>
            <CustomButton text="Save" onClick={handleSavePayment} />
          </Grid>
        </div>
        <CustomModal
          open={modVisible}
          onClose={onModClose}
          header={selectedItem ? "Edit" : "Add"}
          rightModal
          modalWidth={30}
        >
          <Grid container spacing={1} className="ph20">
            <div className="flex-center-row gap20">
              <div className="txt-semi-bold fs14 selecttypetext">
                Select Type
              </div>

              <div>
                <Checkbox
                  radio
                  name="type"
                  onChange={(e) => onChangeValue("type", e?.target?.value)}
                  radios={[
                    { label: "Services", value: "services" },
                    { label: "Products", value: "products" },
                  ]}
                  defaultValue={itemValues?.type}
                  disabled={selectedItem}
                />
              </div>
            </div>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Select
                list={
                  itemValues?.type === "services" ? serviceList : productList
                }
                value={itemValues?.name}
                handleChange={(e) => onChangeValue("name", e?.target?.value)}
                label={`${itemValues?.type === "services" ? "Service" : "Product"
                  } Name`}
                select
                labelTop
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label="Qty"
                name="quantity"
                fullWidth
                handleChange={(e) =>
                  onChangeValue("quantity", e?.target?.value)
                }
                value={itemValues?.quantity}
                labelTop
                disabled={itemValues?.name === "" || !itemValues?.name}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="pricecontainer">
                <div className="pricetext">Price</div>
                <div className="pricetext">
                  {itemTtlAmt > 0 ? itemTtlAmt : "Nill"}
                </div>
              </div>
            </Grid>

            <div className="flex1-end mt20">
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <CustomButton
                  text={selectedItem ? "Save" : "Add"}
                  onClick={handleAddEdit}
                />
              </Grid>
            </div>
          </Grid>
        </CustomModal>

        <CustomModal
          open={discountModVisible}
          onClose={onDiscountModClose}
          header="Apply Discount"
          rightModal
          modalWidth={30}
        >
          <Grid container spacing={2} className="ph20">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-semi-bold fs14 selectypetext ">
                Discount Type
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Checkbox
                radio
                onChange={(e) => onChangeDiscount("type", e?.target?.value)}
                radios={[
                  { label: "Price", value: "price" },
                  { label: "Percentage", value: "percentage" },
                ]}
                defaultValue="price"
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomTextField
                label="Discount Price"
                name="amt"
                fullWidth
                handleChange={(e) => onChangeDiscount("amt", e?.target?.value)}
                value={discountValues?.amt}
                labelTop
              />
            </Grid>

            <div className="flex1-end mt20">
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <CustomButton text="Add" onClick={handleAddDiscount} />
              </Grid>
            </div>
          </Grid>
        </CustomModal>

        <CustomModal
          open={delModVisible}
          onClose={handleDelModClose}
          header="Delete"
          modal
          modalWidth={30}
        >
          <Typography className="flex-center txt-regular fs14">
            Are you sure want to delete the list?
          </Typography>

          <div className="flex-center mb10 mt15">
            <div>
              <CustomButton text="Cancel" onClick={handleDelModClose} />
            </div>
            <div className="ml10">
              <CustomButton redBtn text="Confirm" onClick={handleDelConfirm} />
            </div>
          </div>
        </CustomModal>
      </div>
    </CommonClinicPetDetails>
  );
}
