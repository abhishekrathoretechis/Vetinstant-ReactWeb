import React, { useEffect, useState } from "react";
import Header from "../../../layouts/header";
import "./NewPaymentBillingCreate.css";
import { Grid } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import CustomCheckbox from "../../../components/CustomCheckbox";
import CustomButton from "../../../components/CustomButton";
import CustomTable from "../../../components/CustomTable";
import CustomSelect from "../../../components/Select/Select";
import { useDispatch, useSelector } from "react-redux";
import {
  createPayBill,
  deletePayBill,
  editPayBill,
  getProductsByClinic,
  getServices,
  payBill,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import CustomModal from "../../../components/CustomModal/CustomModal";
import { useNavigate, useParams } from "react-router-dom";
const tableHeader = [
  "serviceitemname",
  "qty",
  "amt",
  "discount",
  "tax",
  "total",
  "editButton",
  "deleteButton",
];
const nameExpan = {
  servicename: "Service Name",
  price: "Price",
  qty: "Qty",
  productname: "Product Name",
  discountrate: "Discount Rate",
  productprice: "Price",
  productqty: "Qty",
  productdiscountrate: "Discount Rate",
};
const initialValues = {
  servicename: "",
  price: "",
  qty: "",
  productname: "",
  discountrate: "",
  productprice: "",
  productqty: "",
  productdiscountrate: "",
};

const initialError = {
  servicename: false,
  price: false,
  qty: false,
  productname: false,
  discountrate: false,
  productprice: false,
  productqty: false,
  productdiscountrate: false,
};

const initialHelp = {
  servicename: "",
  price: "",
  qty: "",
  productname: "",
  discountrate: "",
  productprice: "",
  productqty: "",
  productdiscountrate: "",
};

const NewPaymentBillingCreate = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const getPayBillData = useSelector((state) => state?.clinic?.paybill);
  const mergedArray = getPayBillData?.services?.concat(
    getPayBillData?.products
  );
  const getServicesData = useSelector((state) => state?.clinic?.services);
  const getProductData = useSelector((state) => state?.clinic?.products);
  const serviceData = getServicesData?.map((item, index) => ({
    id: index + 1,
    value: item?._id,
    name: item?.name,
    isSelected: false,
  }));
  const productData = getProductData?.data?.map((item, index) => ({
    id: index + 1,
    value: item?._id,
    name: item?.name,
    isSelected: false,
  }));
  const [radioActive, setRadioActive] = useState("Price");
  const [tableBilling, setTableBilling] = useState([]);
  const [billingValue, setBillingValues] = useState(initialValues);
  const [billingErrors, setBillingErrors] = useState(initialError);
  const [billingHelps, setBillingHelps] = useState(initialHelp);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [id, setId] = useState();
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    getPayBill();
    dispatch(getServices());
    dispatch(getProductsByClinic());
  }, []);
  const getPayBill = () => {
    dispatch(payBill(params?.id));
  };

  const getBillingTable = (bill) => {
    dispatch(showLoader());
    const requiredBilling = bill?.map((bill, i) => {
      return {
        serviceitemname: bill?.type,
        qty: bill?.qty,
        amt: bill?.price,
        discount: bill?.discountRate,
        total: bill?.finalAmt,
        editButton: (
          <div onClick={() => handleEdit(bill?._id)} className="edit-button">
            Edit
          </div>
        ),
        deleteButton: (
          <div
            onClick={() => handleDeleteModal(bill?._id)}
            className="delete-button"
          >
            Delete
          </div>
        ),
      };
    });
    dispatch(hideLoader());
    setTableBilling(requiredBilling);
  };
  useEffect(() => {
    if (mergedArray?.length > 0) getBillingTable(mergedArray);
  }, [mergedArray]);

  const handleDeleteModal = (id) => {
    setId(id);
    setDeleteModalVisible(!deleteModalVisible);
  };
  const handleEdit = (id) => {
    setEdit(true);
    setId(id);
    const selectedBill = mergedArray.find((ary) => ary._id === id);
    if (selectedBill) {
      if (selectedBill?.type === "Service") {
        setBillingValues({
          ...initialValues,
          type: selectedBill?.type,
          qty: selectedBill?.qty,
          price: selectedBill?.price,
          discountrate: selectedBill?.discountRate,
        });
      } else {
        setBillingValues({
          ...initialValues,
          type: selectedBill?.type,
          productqty: selectedBill?.qty,
          productprice: selectedBill?.price,
          productdiscountrate: selectedBill?.discountRate,
        });
      }
    }
  };

  const handleChange = (e) => {
    setBillingValues({ ...billingValue, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setBillingErrors({ ...billingErrors, [e.target.name]: true });
      setBillingHelps({
        ...billingHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setBillingErrors({ ...billingErrors, [e.target.name]: false });
      setBillingHelps({ ...billingHelps, [e.target.name]: "" });
    }
  };

  const handleDelete = () => {
    dispatch(deletePayBill(id)).then((res) => {
      if (res.payload.status === "success") {
        setTimeout(() => {
          dispatch(payBill(params?.id));
        }, 500);
      }
    });

    setDeleteModalVisible(!deleteModalVisible);
  };
  const handleSelect = (e, key) => {
    setBillingValues({ ...billingValue, [key]: e.target.value });
  };
  const handleSubmit = (type) => {
    if (type === "Service") {
      const data = {
        type: type,
        typeId: billingValue?.servicename,
        qty: billingValue?.qty,
        price: billingValue?.price,
        discountType: radioActive,
        callPending: params?.id,
        discountRate: billingValue?.discountrate,
      };

      if (edit === true) {
        const metaData = { id, data };
        dispatch(editPayBill(metaData)).then((res) => {
          if (res.payload === true) {
            setTimeout(() => {
              setEdit(false);
              setBillingValues([]);
              dispatch(payBill(params?.id));
            }, 1000);
          }
        });
      } else {
        dispatch(createPayBill(data)).then((res) => {
          if (res.payload === true) {
            setTimeout(() => {
              setEdit(false);
              setBillingValues([]);
              dispatch(payBill(params?.id));
            }, 1000);
          }
        });
      }
    } else {
      const data = {
        type: type,
        typeId: billingValue?.productname,
        qty: billingValue?.productqty,
        price: billingValue?.productprice,
        discountType: radioActive,
        callPending: params?.id,
        discountRate: billingValue?.productdiscountrate,
      };
      if (edit === true) {
        const metaData = { id, data };
        dispatch(editPayBill(metaData)).then((res) => {
          if (res.payload === true) {
            setTimeout(() => {
              setEdit(false);
              setBillingValues([]);
              dispatch(payBill(params?.id));
            }, 1000);
          }
        });
      } else {
        dispatch(createPayBill(data)).then((res) => {
          if (res.payload === true) {
            setTimeout(() => {
              setEdit(false);
              setBillingValues([]);
              dispatch(payBill(params?.id));
            }, 1000);
          }
        });
      }
    }
  };
  const handleChangeRadio = (e) => {
    setRadioActive(e.target.value);
  };
  return (
    <>
      <Header name="Vetinstant" />

      <div className="box mt15 ml15 p10">
        <div className="blue-color fs16 p10 txt-semi-bold mb10">Serivce</div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomSelect
              list={serviceData}
              handleChange={(e) => handleSelect(e, "servicename")}
              name="servicename"
              label={nameExpan?.["servicename"]}
              select
              value={billingValue?.servicename}
              helperText={billingHelps?.servicename}
              error={billingErrors?.servicename}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomTextField
              label={nameExpan?.["qty"]}
              placeholder={nameExpan?.["qty"]}
              name="qty"
              fullWidth
              handleChange={handleChange}
              value={billingValue?.qty}
              helperText={billingHelps?.qty}
              error={billingErrors?.qty}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomTextField
              label={nameExpan?.["price"]}
              placeholder={nameExpan?.["price"]}
              name="price"
              fullWidth
              handleChange={handleChange}
              value={billingValue?.price}
              helperText={billingHelps?.price}
              error={billingErrors?.price}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <div className="flex-row ml5">
              <div className="text-bold flex-center">Discount Type</div>
              <div className="flex-center ml15">
                <CustomCheckbox
                  radio
                  radios={[
                    { label: "Price", value: "Price" },
                    { label: "Percentage", value: "Percentage" },
                  ]}
                  defaultValue={radioActive ?? "Price"}
                  onChange={handleChangeRadio}
                />
              </div>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <CustomTextField
                  label={nameExpan?.["discountrate"]}
                  placeholder={nameExpan?.["discountrate"]}
                  name="discountrate"
                  fullWidth
                  handleChange={handleChange}
                  value={billingValue?.discountrate}
                  helperText={billingHelps?.discountrate}
                  error={billingErrors?.discountrate}
                />
              </Grid>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <div className="clinic-mod-btn-pos">
              <div className="mr10">
                <CustomButton
                  text={edit == true ? "Update" : "Add"}
                  onClick={() => handleSubmit("Service")}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <div className="box mt15 ml15 p10">
        <div className="blue-color fs16  p10 txt-semi-bold mb10">Product</div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomSelect
              list={productData}
              handleChange={(e) => handleSelect(e, "productname")}
              name="productname"
              label={nameExpan?.["productname"]}
              select
              value={billingValue?._id}
              helperText={billingHelps?.productname}
              error={billingErrors?.productname}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomTextField
              label={nameExpan?.["productqty"]}
              placeholder={nameExpan?.["productqty"]}
              name="productqty"
              fullWidth
              handleChange={handleChange}
              value={billingValue?.productqty}
              helperText={billingHelps?.productqty}
              error={billingErrors?.productqty}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
            <CustomTextField
              label={nameExpan?.["productprice"]}
              placeholder={nameExpan?.["productprice"]}
              name="productprice"
              fullWidth
              handleChange={handleChange}
              value={billingValue?.productprice}
              helperText={billingHelps?.productprice}
              error={billingErrors?.productprice}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={8} lg={8} xl={8}>
            <div className="flex-row ml5">
              <div className="text-bold flex-center">Discount Type</div>
              <div className="flex-center ml15">
                <CustomCheckbox
                  radio
                  radios={[
                    { label: "Price", value: "Price" },
                    { label: "Percentage", value: "Percentage" },
                  ]}
                  defaultValue={radioActive}
                />
              </div>
              <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                <CustomTextField
                  label={nameExpan?.["productdiscountrate"]}
                  placeholder={nameExpan?.["productdiscountrate"]}
                  name="productdiscountrate"
                  fullWidth
                  handleChange={handleChange}
                  value={billingValue?.productdiscountrate}
                  helperText={billingHelps?.productdiscountrate}
                  error={billingErrors?.productdiscountrate}
                />
              </Grid>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <div className="clinic-mod-btn-pos">
              <div className="mr10">
                <CustomButton
                  text={edit == true ? "Update" : "Add"}
                  onClick={() => handleSubmit("Product")}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>

      <CustomTable columns={tableHeader} datas={tableBilling} />

      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <div>
          <div className="clinic-mod-btn-pos">
            <div className="mr10">
              <CustomButton
                text="Back"
                redBtn
                onClick={() => navigate("/payments")}
              />
            </div>
            <div className="mh20">
              <CustomButton
                text="Generate Invoice"
                onClick={() => navigate("/invoice-bill")}
              />
            </div>
          </div>
        </div>
      </Grid>

      <CustomModal
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        header={"Delete"}
        modal
        modalWidth={50}
      >
        <div className="ml10">Are you sure want to delete the list?</div>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="clinic-mod-btn-pos mb10 mt15">
            <div className="mr10">
              <CustomButton
                text="Cancel"
                onClick={() => setDeleteModalVisible(false)}
              />
            </div>
            <div className="ml10">
              <CustomButton redBtn text={"Confirm"} onClick={handleDelete} />
            </div>
          </div>
        </Grid>
      </CustomModal>
    </>
  );
};

export default NewPaymentBillingCreate;
