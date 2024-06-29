import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Box,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import deleteImage from "../../../../assets/images/png/delete.png";
import editImage from "../../../../assets/images/png/edit.png";
import hospitallogo from "../../../../assets/images/png/hospitallogo.png";
import print from "../../../../assets/images/png/print.png";
import CustomButton from "../../../../components/CustomButton";
import Checkbox from "../../../../components/CustomCheckbox";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../../components/CustomTextField";
import {
  addBillingItemsByPaymentId,
  deletePaymentItemById,
  getBillDetailsByPaymentId,
  getProductsByClinic,
  getServices,
  updateBillingByPaymentId,
  updateBillingItemsByPaymentId,
} from "../../../../redux/reducers/clinicSlice";
import { AppColors } from "../../../../util/AppColors";
import "./Billing.css";

const tableHeaders = [
  "serviceitemname",
  "qty",
  "unitPrice",
  "tax",
  "total",
  "pay",
];

const tableNameExpan = {
  serviceitemname: "Service/Item Name",
  qty: "Qty",
  unitPrice: "Unit Price",
  tax: "Tax",
  total: "Total",
};

const initialValues = { quantity: 1, price: 0 };
const initialDiscount = { type: "price", amt: "" };
const initialPayments = {
  subTotal: 0,
  tax: "-",
  discount: 0,
  amtPaid: 0,
  balDue: 0,
};

const Billing = ({ bill }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const contentToPrint = useRef(null);
  const billDetails = useSelector((state) => state?.clinic?.billDetails);
  const [selectedItem, setSelectedItem] = useState(null);
  const [discountValues, setDiscountValues] = useState(initialDiscount);
  const [searchVisible, setSearchVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [discountModVisible, setDiscountModVisible] = useState(false);
  const [delModVisible, setDelModVisible] = useState(false);
  const { products, services } = useSelector((state) => state?.clinic);
  const [productList, setProductList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(initialPayments);
  const [selectedTab, setSelectedTab] = useState("service");
  const [searchValue, setSearchValue] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [itemValues, setItemValues] = useState(initialValues);
  const [prntPrevVsble, setPrntPrevVsble] = useState(false);
  const appDet = useSelector((state) => state?.pet?.petDetails?.data);
  const petDet = appDet?.pet;
  const apnt = appDet?.appointment;
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  useEffect(() => {
    if (bill?.paymentId ?? petDet?.paymentId) {
      dispatch(getBillDetailsByPaymentId(bill?.paymentId ?? petDet?.paymentId));
    }
    getProductAndServiceListForDropdown();
  }, []);

  useEffect(() => {
    getPaymentDetails();
  }, [billDetails]);

  useEffect(() => {
    if (searchValue?.length > 0) {
      let reqList = [];
      if (selectedTab === "service") {
        reqList = serviceList?.filter((ser) =>
          ser?.name?.toLowerCase().includes(searchValue?.toLowerCase())
        );
      } else {
        reqList = productList?.filter((prd) =>
          prd?.name?.toLowerCase().includes(searchValue?.toLowerCase())
        );
      }
      return setFilteredList(reqList);
    }
    setFilteredList(selectedTab === "service" ? serviceList : productList);
  }, [searchValue, selectedTab]);

  const getPaymentDetails = () => {
    let subTotal = 0,
      tax = 0,
      discount = 0,
      balDue = 0;

    billDetails?.paymentDetails?.map((pd) => {
      tax = tax + Number(pd?.tax * pd?.quantity) ?? 0;
      subTotal = subTotal + pd?.total;
    });
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
    let reqServices = [];
    let reqProducts = [];
    dispatch(getProductsByClinic()).then((res) => {
      if (res?.payload?.data?.length > 0) {
        reqProducts = products?.data?.map((pd) => {
          return { ...pd, value: pd?.productId };
        });
      }
      setProductList(reqProducts);
    });
    dispatch(getServices()).then((res) => {
      if (res?.payload?.data?.length > 0) {
        reqServices = res?.payload?.data?.map((ser) => {
          return { ...ser, name: ser?.serviceName, value: ser?.serviceId };
        });
      }
      setServiceList(reqServices);
    });

    setFilteredList(selectedTab === "service" ? reqServices : reqProducts);
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
      dispatch(
        getBillDetailsByPaymentId(
          location?.state?.bill?.paymentId ??
            bill?.paymentId ??
            petDet?.paymentId
        )
      );
      setSelectedItem(null);
      setDelModVisible(false);
    }
  };

  const handleEdit = (bill) => {
    setItemValues({
      ...itemValues,
      quantity: bill?.quantity,
      price: bill?.price,
      tax: bill?.tax,
    });
    setSelectedItem(bill);
    setEditVisible(true);
  };

  const onDiscountModClose = () => {
    setDiscountModVisible(!discountModVisible);
  };

  const onChangeDiscount = (name, value) => {
    setDiscountValues({ ...discountValues, [name]: value });
  };

  const onChangeItemValue = (name, value) => {
    setItemValues({ ...itemValues, [name]: value });
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
      paymentId:
        location?.state?.bill?.paymentId ??
        bill?.paymentId ??
        petDet?.paymentId,
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
      dispatch(
        getBillDetailsByPaymentId(
          location?.state?.bill?.paymentId ??
            bill?.paymentId ??
            petDet?.paymentId
        )
      );
      setPrntPrevVsble(true);
    }
  };

  const handlePrint = useReactToPrint({
    documentTitle: "Print This Document",
    // onBeforePrint: () => console.log("before printing..."),
    // onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const handleAddItem = async (item) => {
    const reqObj = {
      name: item?.name ?? searchValue,
      price: item?.servicePrice ?? item?.sellPrice ?? 0,
      quantity: 1,
      tax: item?.tax ?? "0",
      total:
        Number(item?.servicePrice ?? item?.sellPrice ?? 0) +
        Number(item?.tax ?? 0),
      type: item ? (item?.serviceId ? "service" : "product") : selectedTab,
    };
    const reqData = {
      paymentId:
        location?.state?.bill?.paymentId ??
        bill?.paymentId ??
        petDet?.paymentId,
      data: reqObj,
    };
    const apiRes = await dispatch(addBillingItemsByPaymentId(reqData));

    if (apiRes?.payload) {
      dispatch(
        getBillDetailsByPaymentId(
          location?.state?.bill?.paymentId ??
            bill?.paymentId ??
            petDet?.paymentId
        )
      );
      setSearchValue("");
      setSearchVisible(false);
    }
  };

  const handleUpdateItem = async (item) => {
    const reqObj = {
      name: item?.name,
      price: itemValues?.price,
      quantity: itemValues?.quantity,
      tax: item?.tax ?? "0",
      total:
        Number(itemValues?.price * itemValues?.quantity) +
        Number(itemValues?.quantity * Number(item?.tax ?? 0)),
      type: item?.type,
      paymentDetaisId: selectedItem?.paymentDetailId ?? item?.paymentDetailId,
    };
    const reqData = {
      paymentId:
        location?.state?.bill?.paymentId ??
        bill?.paymentId ??
        petDet?.paymentId,
      data: reqObj,
    };
    const apiRes = await dispatch(updateBillingItemsByPaymentId(reqData));
    if (apiRes?.payload) {
      dispatch(
        getBillDetailsByPaymentId(
          location?.state?.bill?.paymentId ??
            bill?.paymentId ??
            petDet?.paymentId
        )
      );
      setSelectedItem(null);
      setEditVisible(false);
    }
  };

  const handleClosePrintModal = () => {
    setPrntPrevVsble(false);
  };

  return (
    <div className="back-white w100Per">
      <Container maxWidth="xl">
        <Box className="pv20">
          <TableContainer>
            <Table sx={{ minWidth: 200 }} aria-labelledby="tableTitle">
              <TableHead>
                <TableRow>
                  {tableHeaders?.map((hl, i) => (
                    <TableCell
                      key={i}
                      style={{
                        backgroundColor: AppColors.tableGrayHead,
                        color: AppColors.white,
                        textAlign: "left",
                      }}
                      sortDirection={false}
                      className={`table-header-text ${
                        hl === "name" ? "w30Per" : "w15Per"
                      }`}
                    >
                      {tableNameExpan?.[hl]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {billDetails?.paymentDetails
                  ?.filter((pd) => pd?.type === "consultation")
                  ?.map((con) => ({
                    serviceitemname: `Consultation(${billDetails?.appointmentType})`,
                    qty: 1,
                    unitPrice: `Rs ${con?.price}`,
                    tax: Number(con?.tax) > 0 ? con?.tax : "-",
                    total: `Rs ${con?.total}`,
                  }))
                  ?.map((bil, ind) => (
                    <TableRow tabIndex={-1} key={ind}>
                      {tableHeaders?.map((th, index) => (
                        <TableCell
                          key={index + th + "tr"}
                          component="th"
                          className="table-text-black capitalize"
                        >
                          <div className="upload-row">
                            <div>{bil[th]}</div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                {billDetails?.paymentDetails
                  ?.filter((pd) => pd?.type !== "consultation")
                  ?.map((bil) => {
                    const reqObj = {
                      serviceitemname: bil?.name,
                      qty:
                        selectedItem?.paymentDetailId ===
                          bil?.paymentDetailId && editVisible ? (
                          <CustomTextField
                            value={itemValues?.quantity}
                            handleChange={(e) =>
                              onChangeItemValue("quantity", e?.target?.value)
                            }
                            fullWidth
                            type="number"
                          />
                        ) : (
                          bil?.quantity
                        ),
                      unitPrice:
                        selectedItem?.paymentDetailId ===
                          bil?.paymentDetailId && editVisible ? (
                          <CustomTextField
                            value={itemValues?.price}
                            handleChange={(e) =>
                              onChangeItemValue("price", e?.target?.value)
                            }
                            fullWidth
                            type="number"
                          />
                        ) : (
                          `Rs ${bil?.price}`
                        ),
                      tax: bil?.tax > 0 ? `Rs ${bil?.tax}` : "-",
                      total:
                        selectedItem?.paymentDetailId ===
                          bil?.paymentDetailId && editVisible
                          ? `Rs ${
                              Number(itemValues?.quantity) *
                                Number(itemValues?.price) +
                              Number(itemValues?.quantity * bil?.tax ?? 0)
                            }`
                          : `Rs ${bil?.total}`,
                      // pay:
                      //   selectedItem?.paymentDetailId ===
                      //     bil?.paymentDetailId && editVisible ? (
                      //     <div
                      //       className="cursor"
                      //       onClick={() => handleUpdateItem(bil)}
                      //     >
                      //       <SaveOutlinedIcon
                      //         sx={{ color: AppColors.appPrimary }}
                      //         className="w30h30"
                      //       />
                      //     </div>
                      //   ) : (
                      //     <div className="flex-row">
                      //       <div
                      //         className="cursor"
                      //         onClick={() => handleDelete(bil)}
                      //       >
                      //         <img
                      //           src={deleteImage}
                      //           alt=""
                      //           className="imghw30"
                      //         />
                      //       </div>
                      //       <div
                      //         className="cursor ml15"
                      //         onClick={() => handleEdit(bil)}
                      //       >
                      //         <img src={editImage} alt="" className="imghw30" />
                      //       </div>
                      //     </div>
                      //   ),
                    };

                    if (apnt?.appoinmentStatus !== "completed") {
                      reqObj.pay =
                        selectedItem?.paymentDetailId ===
                          bil?.paymentDetailId && editVisible ? (
                          <div
                            className="cursor"
                            onClick={() => handleUpdateItem(bil)}
                          >
                            <SaveOutlinedIcon
                              sx={{ color: AppColors.appPrimary }}
                              className="w30h30"
                            />
                          </div>
                        ) : (
                          <div className="flex-row">
                            <div
                              className="cursor"
                              onClick={() => handleDelete(bil)}
                            >
                              <img
                                src={deleteImage}
                                alt=""
                                className="imghw30"
                              />
                            </div>
                            <div
                              className="cursor ml15"
                              onClick={() => handleEdit(bil)}
                            >
                              <img src={editImage} alt="" className="imghw30" />
                            </div>
                          </div>
                        );
                    }

                    return reqObj;
                  })
                  ?.map((bil, ind) => (
                    <TableRow tabIndex={-1} key={ind}>
                      {tableHeaders?.map((th, index) => (
                        <TableCell
                          key={index + th + "tr"}
                          component="th"
                          className="table-text-black capitalize"
                        >
                          <div className="upload-row">
                            <div>{bil[th]}</div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

      {searchVisible ? (
        <div className="mv20 mh20">
          <div className="w20Per">
            <CustomTextField
              placeholder="Search"
              fullWidth
              handleChange={(e) => setSearchValue(e?.target?.value)}
              value={searchValue}
            />
          </div>
          {searchValue?.length > 0 ? (
            <div className="br8brblack pv10 ph10 mt10">
              <div className="flex-row">
                <div className="w33Per">
                  <div
                    className={`w25Per ${
                      selectedTab === "service"
                        ? "table-tab-selected"
                        : "table-tab-un-selected"
                    }`}
                  >
                    <Typography
                      className="font-medium fs14 cursor"
                      onClick={() => setSelectedTab("service")}
                    >
                      Service
                    </Typography>
                  </div>
                  <div
                    className={`w75Per table-tab-selected-rem ${
                      selectedTab !== "service" ? "mt2Min" : ""
                    }`}
                  />
                </div>
                <div className="w33Per">
                  <div
                    className={`w25Per ${
                      selectedTab === "product"
                        ? "table-tab-selected"
                        : "table-tab-un-selected"
                    }`}
                  >
                    <Typography
                      className="font-medium fs14 cursor"
                      onClick={() => setSelectedTab("product")}
                    >
                      Product
                    </Typography>
                  </div>
                  <div
                    className={`w75Per table-tab-selected-rem ${
                      selectedTab !== "product" ? "mt2Min" : ""
                    }`}
                  />
                </div>
                <div className="w33Per">
                  <div className="w25Per table-tab-un-selected">
                    <Typography className="font-medium fs14 white-color">
                      T
                    </Typography>
                  </div>
                  <div className="w75Per table-tab-selected-rem mt2Min" />
                </div>
              </div>
              <div className="flex-row mv5">
                <div className="w33Per">
                  <Typography className="txt-regular fs14 blue-color">
                    {selectedTab === "service" ? "Service" : "Product"} Name
                  </Typography>
                </div>
                <div className="w33Per">
                  <Typography className="txt-regular fs14 blue-color">
                    Category
                  </Typography>
                </div>
                <div className="w33Per">
                  <Typography className="txt-regular fs14 blue-color">
                    Price
                  </Typography>
                </div>
              </div>
              {filteredList?.length > 0 ? (
                filteredList?.map((fil, i) => {
                  return (
                    <div
                      className="bill-itm cursor"
                      key={i + "fil"}
                      onClick={() => handleAddItem(fil)}
                    >
                      <div className="w33Per">
                        <Typography className="txt-regular fs14">
                          {fil?.name}
                        </Typography>
                      </div>
                      <div className="w33Per">
                        <Typography className="txt-regular fs14">
                          {fil?.category}
                        </Typography>
                      </div>
                      <div className="w33Per">
                        <Typography className="txt-regular fs14">
                          {fil?.servicePrice ?? fil?.sellPrice
                            ? `Rs ${fil?.servicePrice ?? fil?.sellPrice}`
                            : "-"}
                        </Typography>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex-center mt20">
                  <Typography className="txt-regular">
                    No Records found
                  </Typography>
                </div>
              )}

              {filteredList?.length > 0 ? null : (
                <div className="flex-row flex-center">
                  <div className="flex-start">
                    <Typography className="fs14">{searchValue}</Typography>
                  </div>
                  <div className="flex1-end mt20">
                    <div className="w15Per">
                      <CustomButton
                        text="Add New"
                        smallBtn
                        onClick={() => handleAddItem()}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      ) : null}

      {apnt?.appoinmentStatus !== "completed" ? (
        <div className="flex-row ph20">
          <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
            <CustomButton
              text="Add"
              smallBtn
              onClick={() => setSearchVisible(true)}
            />
          </Grid>
          <Grid item xs={5} sm={5} md={3} lg={3} xl={3} className="ml15">
            <CustomButton
              text="Apply Discount"
              smallBtn
              onClick={() => setDiscountModVisible(true)}
            />
          </Grid>
        </div>
      ) : null}

      <div className="billingcontainer mt20">
        <div className="billingBox">
          <div className="flex-row-between-align-center w60Per">
            <div className="txtstyle">Subtotal</div>
            <div className="txtstyle">
              Rs {paymentDetails?.subTotal - paymentDetails?.tax ?? 0}
            </div>
          </div>
          <div className="flex-row-between-align-center w60Per">
            <div className="txtstyle">Tax</div>
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
                color: "#5D9911",
              }}
            >
              Amount Paid
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#5D9911",
              }}
            >
              {billDetails?.amtPaid > 0 ? `Rs ${billDetails?.amtPaid}` : "-"}
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
          className="flex-center cursor"
          // onClick={() => {
          //   handlePrint(null, () => contentToPrint.current);
          // }}
          onClick={() => {
            setPrntPrevVsble(true);
          }}
        >
          <img src={print} alt="" className="imghw30" />
        </div>
        <Grid item xs={5} sm={5} md={3} lg={2} xl={2}>
          <CustomButton
            text="Generate Invoice"
            smallBtn
            onClick={handleSavePayment}
          />
        </Grid>
      </div>
      {/* <Grid container spacing={2} className="mb65">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="ph20">
          <div className="box-hor-split mv20" />
          <div className="font-bold fs14 mv20 blue-color">Billing History</div>
          <div className="flex-center">
            <div className="w75Per">
              <CustomTextField
                search
                placeholder="Search"
                fullWidth
                backgroundColor="#E3CECE52"
                value={searchValue}
                handleChange={(e) => setSearchValue(e?.target?.value)}
              />
            </div>
          </div>
          <div className="flex-row mv10">
            <div className="w20Per">
              <div className="flex-center h110">
                <div className="flex-column flex-center">
                  <Typography className="black5 fs10 txt-regular">
                    {moment(new Date()).format("DD MMM")}
                  </Typography>
                  <Typography className="black5 fs10 txt-regular mt10">
                    {moment(new Date()).format("YYYY")}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="w80Per">
              <Card
                sx={{
                  borderRadius: 1,
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 1,
                  paddingBottom: 1,
                  marginTop: 2,
                }}
                className="cursor inner-cards h110"
              >
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className="mt10"
                  >
                    <div className="card-top-color card-top-blue-color" />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="ph10">
                      <div className="flex-row">
                        <div className="flex-start">
                          <div className="flex-column">
                            <div className="h50">
                              <CardMedia
                                image="https://picsum.photos/200"
                                className="img-h40"
                              />
                            </div>
                            <div className="flex-center mt10">
                              <Typography className="txt-semi-bold blue-color fs12">
                                 //orange4 
                                Balance Due: Nil
                              // Balance Due: Rs 300 
                              </Typography>
                            </div>
                          </div>

                          <div className="flex-column ml15 jus-con-spa-bet">
                            <div className="h50">
                              <Typography className="font-bold fs14 black">
                                Dr. Vivek
                              </Typography>
                              <Typography className="gray7 fs14 font-medium mt5">
                                Ear Infection, Kennel Cough
                              </Typography>
                            </div>
                          </div>
                        </div>

                        <div className="flex1-end">
                          <div className="flex-column">
                            <div className="flex-row">
                              <img
                                src={require("../../../../assets/images/png/pay.png")}
                                alt=""
                              />
                              <img
                                src={require("../../../../assets/images/png/view.png")}
                                alt=""
                                className="ml10"
                              />
                            </div>
                            <div className="flex-row mt10">
                              <div className="card-con-blue-back white-color br5 fs12 header ph10pv3">
                                // virtual-bg-color 
                                Physical
                              </div>
                              <div className="green-back2 green2 br5 fs12 header ph10pv3 ml10">
                                // orange4 org-back2
                                Paid
                                // Partially Paid 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </div>
          </div>
        </Grid>
      </Grid> */}

      <CustomModal
        open={prntPrevVsble}
        onClose={handleClosePrintModal}
        header="Invoice"
        modal
        modalWidth={70}
      >
        <div style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <div ref={contentToPrint} className="bg">
            <div>
              <div className="upper-row">
                <img
                  src={profile?.image ?? hospitallogo}
                  className="h75ml30img"
                  alt=""
                />
                <div className="font-bold fs18 blue-color">INVOICE</div>
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
                    <div className="colum-data">{petDet?.petName}</div>
                  </div>
                  <div>
                    <div className="colum-header">Parent Name</div>
                    <div className="colum-data capitalize">
                      {petDet?.userName}
                    </div>
                  </div>
                  <div>
                    <div className="colum-header">Invoice Number</div>
                    <div className="colum-data">#AB2324-01</div>
                  </div>
                  <div>
                    <div className="colum-header">Invoice Date</div>
                    <div className="colum-data">
                      {moment().format("DD MMM, YYYY")}
                    </div>
                  </div>
                </div>

                <div className="thin-line"></div>

                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>SERVICE / ITEM NAME</th>
                      <th>QTY</th>
                      <th>PRICE</th>
                      <th>DISCOUNT (Rs)</th>
                      <th>TAX</th>
                      <th>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {billDetails?.paymentDetails
                      ?.filter((pd) => pd?.type === "consultation")
                      ?.map((con) => (
                        <tr>
                          <td>
                            <b>Consultation ({con?.name})</b>
                          </td>
                          <td>1</td>
                          <td>Rs {con?.price}</td>
                          <td>-</td>
                          <td>{con?.tax > 0 ? con?.tax : "-"}</td>
                          <td>Rs {con?.total}</td>
                        </tr>
                      ))}

                    {/* <tr>
                      <td>
                        <b>Prescription </b>
                      </td>
                    </tr> */}
                    {billDetails?.paymentDetails
                      ?.filter((pd) => pd?.type !== "consultation")
                      ?.map((itm, i) => (
                        <tr key={i}>
                          <td>{itm?.name}</td>
                          <td>{itm?.quantity}</td>
                          <td>Rs {itm?.price}</td>
                          <td>-</td>
                          <td>{itm?.tax > 0 ? itm?.tax : "-"}</td>
                          <td>Rs {itm?.total}</td>
                        </tr>
                      ))}

                    <tr>
                      <td colSpan="6">
                        <hr className="thin-line2" />
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3"></td>
                      <td>Subtotal</td>
                      <td colSpan="1"></td>
                      <td>
                        Rs {paymentDetails?.subTotal - paymentDetails?.tax ?? 0}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3"></td>
                      <td>Tax</td>
                      <td colSpan="1"></td>
                      <td>
                        {paymentDetails?.tax > 0
                          ? `Rs ${paymentDetails?.tax}`
                          : "-"}
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
                        <b>Rs {paymentDetails?.subTotal}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="back-white"
          >
            <div className="flex-end">
              <div className="mr20 mv20">
                <CustomButton
                  text="Download"
                  onClick={() =>
                    handlePrint(null, () => contentToPrint.current)
                  }
                  smallBtn
                />
              </div>
            </div>
          </Grid>
        </div>
      </CustomModal>

      <CustomModal
        open={discountModVisible}
        onClose={onDiscountModClose}
        header="Apply Discount"
        rightModal
        modalWidth={30}
      >
        <Grid container spacing={0.5} className="ph20">
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
  );
};

export default Billing;
