import { Card, CardMedia, Grid, Pagination, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import Select from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import {
  getAllClinicPayment,
  updatePayment,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import "./ClinicPayments.css";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import GridViewIcon from "@mui/icons-material/GridView";
import SortIcon from "@mui/icons-material/Sort";
import { useReactToPrint } from "react-to-print";
import hospitallogo from "../../../assets/images/png/hospitallogo.png";
import payImg from "../../../assets/images/png/pay.png";
import viewImg from "../../../assets/images/png/view.png";
import CustomCard from "../../../components/CustomCard/CustomCard";
import CustomModal from "../../../components/CustomModal/CustomModal";
import { AppColors } from "../../../util/AppColors";
import { PaymentTypeList, paymentFilters } from "../../../util/dropList";
import VetAndUpcomingAppointments from "../../CommonScreens/VetAndUpcomingAppointments/VetAndUpcomingAppointments";

const tableHeaders = [
  "petName",
  "vetName",
  "balanceDue",
  "paymentStatus",
  "trDate",
  "pay",
];

const initialValues = {
  amount: "",
  paymentMode: "cash",
};

const ClinicPayments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payments = useSelector((state) => state.clinic.payments);

  const [isTableView, setTableView] = useState(true);
  const [tablePayments, setTablePayments] = useState([]);
  const [payValues, setPayValues] = useState(initialValues);
  const [searchText, setSearchText] = useState("");

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("all");
  const [selectMode, setSelectMode] = useState("all");
  const [modalData, setModalData] = useState();

  const [page, setPage] = useState(1);
  const itemsPerLoad = 10;
  const [cardPage, setCardPage] = useState(1);
  const cardItemsPerLoad = 12;
  const [selectedBill, setSelectedBill] = useState(null);
  const contentToPrint = useRef(null);
  const [invModVisible, setInvModVisible] = useState(false);
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  useEffect(() => {
    dispatch(
      getAllClinicPayment(
        `?filter=${selectedType}&type=${selectMode}&page=1&itemSize=${
          isTableView ? itemsPerLoad : cardItemsPerLoad
        }`
      )
    );
    setPage(1);
    setCardPage(1);
  }, [selectMode, selectedType, isTableView]);

  useEffect(() => {
    const filteredPayments = filterPayments(payments?.data, searchText);
    getTablePayments(filteredPayments);
  }, [payments?.data, searchText]);

  const createModalOpen = (li) => {
    setModalData(li);
    setPayValues(initialValues);
    setPayModalVisible(!payModalVisible);
  };

  const filterPayments = (payments, searchText) => {
    if (!searchText) return payments;

    return payments?.filter((payment) => {
      const petNameMatch = payment?.petName
        ?.toLowerCase()
        .includes(searchText?.toLowerCase());
      const vetNameMatch = payment?.doctorName
        ?.toLowerCase()
        .includes(searchText?.toLowerCase());
      const paymentStatusMatch = payment?.status
        ?.toLowerCase()
        .includes(searchText?.toLowerCase());
      return petNameMatch || vetNameMatch || paymentStatusMatch;
    });
  };

  const handleChangeValues = (name, value) => {
    setPayValues({ ...payValues, [name]: value });
  };

  // const handleClick = (item) => {
  //   localStorage?.setItem("selectedItem", JSON.stringify(item));
  //   navigate("/invoice-bill");
  // };

  const getTablePayments = (payments) => {
    dispatch(showLoader());
    const requiredPayments = payments?.map((pay, i) => {
      return {
        ...pay,
        petName: pay?.petName,
        petImage: pay?.petImage,
        balanceDue: pay?.balanceDue === 0 ? "Nil" : "Rs " + pay?.balanceDue,
        trDate: moment(pay?.createdDate).format("MMM DD, YYYY"),
        vetName: pay?.doctorName,
        paymentStatus:
          // pay?.status === "partiallypaid"
          //   ? "Partially Paid"
          //   : 
            pay?.status === "paid"
            ? "Paid"
            : "Unpaid",
        gender: pay?.gender,
        breed: pay?.breed,
        pay: (
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {pay?.appointmentStatus !== "completed" &&
            (
              // pay?.status === "partiallypaid" || 
              pay?.status === "unpaid") ? (
              <img
                src={payImg}
                alt=""
                className="img-hw40"
                onClick={() => {
                  setPayValues({ ...payValues, amount: pay?.balanceDue ?? 0 });
                  createModalOpen(pay);
                }}
              />
            ) : (
              <div className="img-hw40" />
            )}
            <img
              src={viewImg}
              alt=""
              className="img-hw40"
              onClick={() => {
                if (
                  pay?.appointmentStatus === "completed" ||
                  pay?.status === "paid"
                ) {
                  setSelectedBill(pay);
                  return setInvModVisible(true);
                }
                if (
                  pay?.appointmentStatus !== "completed" &&
                  pay?.status !== "paid"
                ) {
                  return navigate("/clinic-pet-details", {
                    state: {
                      bill: pay,
                      selectedTab: "billing",
                      appointment: {
                        appoinment: { appoimentId: pay?.appointmentId },
                      },
                    },
                  });
                }
              }}
            />
          </div>
        ),
        userName: pay?.userName,
      };
    });
    setTablePayments(requiredPayments);

    dispatch(hideLoader());
  };

  const handleSelectMode = async (mode) => {
    setSelectMode(mode.target.value);
  };

  const handleSelectType = async (type) => {
    setSelectedType(type);
  };

  const handlePrint = useReactToPrint({
    content: () => contentToPrint.current,
    documentTitle: "Print This Document",
    onBeforePrint: () => console.log("before printing..."),
    onAfterPrint: () => console.log("after printing..."),
    removeAfterPrint: true,
  });

  const getBorderColor = (status) => {
    switch (status) {
      case "paid":
        return "#80AAD3";
      case "unpaid":
        return "#ff754a";
      // case "partiallypaid":
      //   return "#46BF5C";
      default:
        return "transparent";
    }
  };

  const finalPayment = () => {
    const data = {
      paymentId: modalData.paymentId,
      paymentMode: payValues?.paymentMode,
      paymentAmount: payValues?.amount,
    };

    dispatch(updatePayment(data)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        dispatch(
          getAllClinicPayment(
            `?filter=${selectedType}&type=${selectMode}&page=${
              isTableView ? page : cardPage
            }&itemSize=${isTableView ? itemsPerLoad : cardItemsPerLoad}`
          )
        );
        setPayModalVisible(false);
        setPayValues(initialValues);
      }
    });
  };

  const handleInvModClose = () => {
    setSelectedBill(null);
    setInvModVisible(false);
  };

  const handleChangePage = (e, selectedPage) => {
    dispatch(
      getAllClinicPayment(
        `?filter=${selectedType}&type=${selectMode}&page=${selectedPage}&itemSize=${
          isTableView ? itemsPerLoad : cardItemsPerLoad
        }`
      )
    );
    if (isTableView) {
      return setPage(selectedPage);
    }
    setCardPage(selectedPage);
  };

  return (
    <>
      <VetAndUpcomingAppointments left={false}>
        <Grid container className="ph2">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="back-white"
          >
            <TopBar>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="flex-row">
                  <div className="w20Per mt10">
                    <div className="flex-center">
                      <Typography
                        className={`font-bold fs14 cursor day-type-box ${
                          selectedType === "today" ? "black" : "gray2"
                        }`}
                        onClick={() => handleSelectType("today")}
                      >
                        Today
                      </Typography>
                      <Typography
                        className={`font-bold fs14 cursor day-type-box ${
                          selectedType === "all" ? "black" : "gray2"
                        }`}
                        onClick={() => handleSelectType("all")}
                      >
                        All
                      </Typography>
                    </div>
                  </div>
                  <div className="top-row-cen-con w100Per textfield">
                    <Grid
                      item
                      xs={6}
                      sm={4}
                      md={4}
                      lg={4}
                      xl={4}
                      className="ml20 "
                    >
                      <CustomTextField
                        placeholder="Search"
                        name="name"
                        fullWidth
                        handleChange={(e) => setSearchText(e.target.value)}
                        value={searchText}
                        searchBill
                        backgroundColor={"#FAF0F0"}
                      />
                    </Grid>

                    <Grid
                      item
                      xs={2}
                      sm={2}
                      md={2}
                      lg={1}
                      xl={1}
                      className="ml20"
                    >
                      <div className="flex-center togglebutton">
                        <div
                          onClick={() => {
                            setTableView(!isTableView);
                          }}
                          className={`p10 cursor ${
                            !isTableView ? "selected-tab" : "un-selected-tab"
                          }`}
                        >
                          <GridViewIcon sx={{ color: AppColors.appPrimary }} />
                        </div>
                        <div
                          onClick={() => {
                            setTableView(!isTableView);
                          }}
                          className={`p10 ml10 cursor ${
                            isTableView ? "selected-tab" : "un-selected-tab"
                          }`}
                        >
                          <SortIcon sx={{ color: AppColors.appPrimary }} />
                        </div>
                      </div>
                    </Grid>

                    <div className="top-row-left-con w15Per allselect">
                      <Select
                        list={paymentFilters}
                        value={selectMode ?? "all"}
                        handleChange={(e) => handleSelectMode(e)}
                        name="vet"
                      />
                    </div>
                  </div>
                </div>
              </Grid>
            </TopBar>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="mv3 back-white scroll-80vh"
          >
            <div className="pb100">
              {isTableView ? (
                <Table
                  columns={tableHeaders}
                  datas={tablePayments}
                  // onClickIcon={(li) => openModalWithInvoiceData(li)}
                  onClickPay={() => {}}
                  // onClickPay={(bil) => {
                  //   const bill = bil;
                  //   delete bill?.pay;
                  //   navigate("/clinic-pet-details", {
                  //     state: {
                  //       bill,
                  //       selectedTab: "billing",
                  //       appointment: {
                  //         appoinment: { appoimentId: bill?.appointmentId },
                  //       },
                  //     },
                  //   });
                  // }}
                  page={page}
                  rowsPerPage={itemsPerLoad}
                  grey
                  totalRecords={payments?.totalRecords}
                  handleChangePage={handleChangePage}
                />
              ) : (
                <>
                  {tablePayments?.length > 0 ? (
                    <>
                      <CustomCard
                        list={tablePayments}
                        bill
                        // onClick={(li) => createModalOpen(li)}
                        handleEditBill={(bil) => {
                          const bill = bil;
                          delete bill.pay;
                          navigate("/history", { state: { bill } });
                        }}
                        handleViewPayBill={(bil) => {
                          setPayValues({
                            ...payValues,
                            amount: bil?.balanceDue ?? 0,
                          });
                          createModalOpen(bil);
                        }}
                        handleViewBill={(bil) => {
                          setSelectedBill(bil);
                          setInvModVisible(true);
                        }}
                        handlePayBill={(bil) => {
                          setPayValues({
                            ...payValues,
                            amount: bil?.balanceDue ?? 0,
                          });
                          createModalOpen(bil);
                        }}
                      />
                      {Math.ceil(payments?.totalRecords / cardItemsPerLoad) >
                      1 ? (
                        <div className="flex-end">
                          <Pagination
                            count={Math.ceil(
                              payments?.totalRecords / cardItemsPerLoad
                            )}
                            variant="outlined"
                            color="primary"
                            page={cardPage}
                            onChange={handleChangePage}
                          />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <div className="no-rec">No records available</div>
                  )}
                </>
              )}
            </div>
          </Grid>
        </Grid>
        <CustomModal
          open={payModalVisible}
          onClose={createModalOpen}
          header="Pay"
          rightModal
          modalWidth={30}
        >
          <Card
            sx={{
              borderRadius: 1,
              padding: 2,
              borderTopColor: `${getBorderColor(modalData?.status)}`,
            }}
            className="CustomCard-back-bill-payment"
          >
            <div className="maint">
              <div className="flex-row topt">
                <Grid item xs={3} sm={3} md={4} lg={4} xl={4}>
                  <div className="flex-center">
                    {modalData?.petImage ? (
                      <CardMedia
                        image={modalData?.petImage}
                        className="CustomCard-img3-bill"
                      />
                    ) : (
                      <div className="CustomCard-empty-img" />
                    )}
                  </div>
                </Grid>
                <div className="flex-row">
                  <div className="flex-start">
                    <div className="flex-column">
                      <div className="flex-row">
                        <Typography
                          variant="body1"
                          className="mb10 font-bold fs14 capitalize"
                        >
                          {modalData?.petName}
                        </Typography>
                        <Typography
                          variant="body1"
                          className={`ml5 capitalize font-medium fs14 ${
                            modalData?.gender === "male"
                              ? "card-blue-color"
                              : "card-rose-color"
                          }`}
                        >
                          {`(${modalData?.gender})`}
                        </Typography>
                      </div>
                      <Typography
                        variant="body2"
                        className="mb10 txt-regular card-gray-color fs12"
                      >
                        {modalData?.breed}
                      </Typography>
                    </div>
                  </div>
                </div>
                <div />
              </div>
              <div>
                <div className="flex-row parentcontainer">
                  <div className="flex-row  iconcontainer">
                    <AccountCircleOutlinedIcon sx={{ width: 25, height: 25 }} />
                    <Typography
                      variant="body1"
                      className="  font-bold fs14 capitalize flex-center h35"
                    >
                      {modalData?.userName ?? modalData?.vetName}
                    </Typography>
                  </div>
                  <div className="meeting-doctor">Meeting Dr. Rahul</div>
                </div>
                <div className="trdatenew">{modalData?.trDate}</div>
                <div
                  className={
                    modalData?.balanceDue === 0 ||
                    modalData?.balanceDue === "Nil"
                      ? "balancedueblue"
                      : "balanceduered"
                  }
                >
                  Balance due: {modalData?.balanceDue}
                </div>
                <div className="datecontainer"></div>
              </div>
            </div>
            <div
              className={`conttype ${
                modalData?.appointmentType === "Physical"
                  ? "card-con-blue-back"
                  : "virtual-bg-color"
              }`}
            >
              {modalData?.appointmentType}
            </div>
          </Card>
          <Grid container spacing={2} className="ph20">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label="Amount"
                name="amount"
                fullWidth
                handleChange={(e) =>
                  handleChangeValues("amount", e?.target?.value)
                }
                value={payValues?.amount}
                // error={!!errors.petName}
                // helperText={errors.petName}
                labelTop
              />
            </Grid>

            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Select
                list={PaymentTypeList}
                value={payValues?.paymentMode}
                handleChange={(e) =>
                  handleChangeValues("paymentMode", e?.target?.value)
                }
                name="paymentMode"
                label="Payment Mode"
                select
                // error={!!errors.breed}
                // helperText={errors.breed}
                labelTop
              />
            </Grid>

            <div className="flex1-end mt20">
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <CustomButton text="Pay" onClick={finalPayment} />
              </Grid>
            </div>
          </Grid>
        </CustomModal>

        <CustomModal
          open={invModVisible}
          onClose={handleInvModClose}
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
                      <div className="colum-data">{selectedBill?.petName}</div>
                    </div>
                    <div>
                      <div className="colum-header">Parent Name</div>
                      <div className="colum-data capitalize">
                        {selectedBill?.userName}
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
                      {selectedBill?.paymentDetails
                        ?.filter((pd) => pd?.type === "consultation")
                        ?.map((con) => {
                          console.log("con", con);
                          return (
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
                          );
                        })}

                      {/* <tr>
                        <td>  
                          <b>Prescription </b>
                        </td>
                      </tr> */}
                      {selectedBill?.paymentDetails
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
                          Rs {selectedBill?.totalAmt - selectedBill?.tax ?? 0}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan="3"></td>
                        <td>Tax</td>
                        <td colSpan="1"></td>
                        <td>
                          {selectedBill?.tax > 0
                            ? `Rs ${selectedBill?.tax}`
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
                          <b>Rs {selectedBill?.totalAmt}</b>
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
      </VetAndUpcomingAppointments>
    </>
  );
};

export default ClinicPayments;
