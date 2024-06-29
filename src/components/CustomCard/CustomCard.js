import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Grid,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import CustomButton from "../CustomButton";
import CustomSwitch from "../CustomSwitch";
import "./CustomCard.css";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";

import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { AppColors } from "../../util/AppColors";
import { useEffect, useState } from "react";

const padCur = { padding: 10, cursor: "pointer" };

const CustomCard = ({
  onBookClick,
  image,
  cardHeader,
  cardText,
  imageHeight,
  onClick,
  id,
  small,
  list,
  onManageSlotClick,
  onModifyClick,
  onChangeSwitch,
  onCardClick,
  dashboard,
  topBarClassName,
  users,
  onClickCalendar,
  onClickDollar,
  pets,
  bill,
  handleEditBill,
  sectionType,
  onClickResch,
  handleAction,
  handleCancel,
  handleCompleted,
  onReassign,
  checkIn,
  threedots,
  onFollowUp,
  handleConsult,
  handleViewBill,
  handlePayBill,
  handleCheckout,
}) => {
  const [anchorEls, setAnchorEls] = useState({});

  const handleClick = (event, id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleClose = (id) => {
    setAnchorEls((prev) => ({ ...prev, [id]: null }));
  };

  const getMenuItems = (sectionType, li, i) => {
    switch (sectionType) {
      case "Upcoming":
        return (
          <>
            {checkIn ? (
              <MenuItem
                onClick={() => handleAction(li, "Check-in")}
                className="txt-regular fs14"
              >
                Check-in
              </MenuItem>
            ) : null}
            <MenuItem
              onClick={() => handleCancel(li, "Cancel")}
              className="txt-regular fs14"
            >
              Cancel
            </MenuItem>
            <MenuItem
              onClick={() => onClickResch(li)}
              className="txt-regular fs14"
            >
              Reschedule
            </MenuItem>
          </>
        );
      case "Checked-in":
        return (
          <>
            <MenuItem
              onClick={() => onReassign(li)}
              className="txt-regular fs14"
            >
              Reassign
            </MenuItem>
            <MenuItem
              onClick={() => handleConsult(li)}
              className="txt-regular fs14"
            >
              Send to Consult
            </MenuItem>
          </>
        );
      case "Consultation":
        return (
          <>
            <MenuItem
              onClick={() => handleCompleted(li, "Checkout")}
              className="txt-regular fs14"
            >
              Finalize
            </MenuItem>
            <MenuItem
              onClick={() => onFollowUp(li)}
              className="txt-regular fs14"
            >
              Follow-up
            </MenuItem>
          </>
        );
      case "Billing":
        return (
          <>
            <MenuItem
              onClick={() => handleCheckout(li)}
              className="txt-regular fs14"
            >
              Check-out
            </MenuItem>
            <MenuItem
              onClick={() => onFollowUp(li)}
              className="txt-regular fs14"
            >
              Follow-up
            </MenuItem>
          </>
        );
      case "Completed":
        return (
          <>
            <MenuItem
              onClick={() => onFollowUp(li)}
              className="txt-regular fs14"
            >
              Follow-up
            </MenuItem>
          </>
        );
      default:
        return null;
    }
  };

  // const [anchorEl1, setAnchorEl1] = useState(null);

  // const open1 = Boolean(anchorEl);
  // const handleClick1 = (event) => {
  //   setAnchorEl1(event.currentTarget);
  // };

  // const handleClose1 = () => {
  //   setAnchorEl1(null);
  // };
  const getBorderColor = (status) => {
    switch (status) {
      case "Paid":
        return "#80AAD3";
      case "Unpaid":
        return "#ff754a";
      // case "Partially Paid":
      //   return "#46BF5C";
      default:
        return "transparent";
    }
  };

  const capitalizeWords = (paymentStatus) => {
    return paymentStatus.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });
  };

  if (users) {
    return (
      <div className="CustomCard-main">
        <Grid container spacing={2}>
          {list?.map((li, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
              <Grid container spacing={0}>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={4}
                  lg={4}
                  xl={4}
                  onClick={() => onCardClick(li)}
                  className="cursor"
                >
                  <div className="flex-center">
                    {li?.image ? (
                      <CardMedia
                        image={li?.image}
                        className="CustomCard-img3 brd-r6"
                      />
                    ) : (
                      <div className="flex-center h125img brd-r6">
                        <Typography className="font-bold fs30 white-color">
                          {li?.name?.[0]}
                        </Typography>
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid item xs={9} sm={9} md={8} lg={8} xl={8}>
                  <Card
                    sx={{ borderRadius: 1, padding: 2 }}
                    className="CustomCard-back vet-card-bg brd-r6"
                  >
                    <div className="flex-row">
                      <div className="flex-start">
                        <div className="flex-column">
                          <Typography
                            variant="body1"
                            className="mb10 font-bold fs14 capitalize cursor"
                            style={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                            onClick={() => onCardClick(li)}
                          >
                            {li?.type !== "Other" ? "Dr. " : ""} {li?.name}
                          </Typography>
                          <Typography
                            variant="body2"
                            className="mb10 txt-regular text-ellipsis card-gray-color fw-500 fs12 capitalize"
                            title={li?.speciality}
                          >
                            {li?.speciality}
                          </Typography>
                          <Typography
                            variant="body2"
                            className={`mb10 font-bold fw-600 fs12 ${
                              li?.active !== "N" ? "blue-color" : "red-color3"
                            }`}
                          >
                            {li?.active !== "N" ? "Available" : "On Leave"}
                          </Typography>
                          {li?.type !== "Other" ? (
                            <div className="flex-row">
                              {li?.consulationType?.map((ct, i) => (
                                <div
                                  key={ct}
                                  className={`txt-regular white-color fs8 card-consultation ${
                                    ct === "Physical"
                                      ? "card-con-blue-back"
                                      : ct === "Virtual"
                                      ? "virtual-bg-color"
                                      : "card-con-gray-back"
                                  } ${i !== 0 ? "ml5" : ""}`}
                                >
                                  {ct === "Home" ? "Home Visit" : ct}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex1-end">
                        <div className="flex-column">
                          {li?.type !== "Other" ? (
                            <>
                              <div
                                className="cursor"
                                onClick={() => onClickCalendar(li)}
                              >
                                <CalendarMonthOutlinedIcon
                                  className="card-head-orange-color"
                                  sx={{ height: 30, width: 30 }}
                                />
                              </div>
                              <div
                                className="cursor"
                                onClick={() => onClickDollar(li)}
                              >
                                <MonetizationOnOutlinedIcon
                                  className="card-head-yellow-color"
                                  sx={{ height: 30, width: 30 }}
                                />
                              </div>
                            </>
                          ) : null}
                          <CustomSwitch
                            value={li?.active === "Y" ? true : false}
                            onChange={(e) => onChangeSwitch(e, li)}
                            greenToGray
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  if (dashboard) {
    return (
      <div className="flex-column">
        <div className="card-columns">
          {list?.length > 0 ? (
            list?.map((li, i) => {
              const app = li?.appoinment;
              return (
                <Card
                  key={i + app?.appoimentId}
                  sx={{
                    borderRadius: 1,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingTop: 1,
                    paddingBottom: 1,
                    marginTop: 2,
                  }}
                  className="cursor inner-cards"
                >
                  <Grid container>
                    {/* <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="mt10"
                    >
                      <div
                        className={`card-top-color ${
                          i === 0 ? topBarClassName : ""
                        }`}
                      />
                    </Grid> */}
                    <Grid
                      item
                      xs={3}
                      sm={3}
                      md={4}
                      lg={4}
                      xl={4}
                      className="mt5"
                    >
                      <div className="flex-center">
                        <CardMedia
                          image={app?.petImage ?? "https://picsum.photos/200"}
                          className="CustomCard-img2"
                          onClick={() => onClick(li)}
                        />
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={9}
                      sm={9}
                      md={8}
                      lg={8}
                      xl={8}
                      className="mt5"
                    >
                      <div className="flex-row">
                        <div className="flex-start">
                          <div className="flex-row">
                            <Typography className="font-bold fs14 capitalize">
                              {app?.petName}
                            </Typography>
                            <Typography
                              variant="body2"
                              className={`txt-regular ml3 capitalize ${
                                app?.gender === "male"
                                  ? "card-blue-color"
                                  : "card-rose-color"
                              }`}
                            >
                              ({app?.gender})
                            </Typography>
                          </div>
                        </div>
                        <div className="flex1-end">
                          {threedots ? (
                            <MoreVertIcon
                              className="card-3dot-color"
                              onClick={(event) => handleClick(event, i)}
                              size="small"
                              sx={{
                                ml: 2,
                                cursor: "pointer",
                                transition: "color 0.3s ease",
                                ":hover": {
                                  color: "#1976d2",
                                },
                              }}
                              aria-controls={
                                anchorEls[i] ? "account-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={anchorEls[i] ? "true" : undefined}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <Menu
                          anchorEl={anchorEls[i]}
                          id="account-menu"
                          open={Boolean(anchorEls[i])}
                          onClose={() => handleClose(i)}
                          onClick={() => handleClose(i)}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          {getMenuItems(sectionType, li, i)}
                        </Menu>
                      </div>

                      <Typography
                        variant="body2"
                        className="txt-regular card-black1 fs12 capitalize"
                      >
                        {app?.breed}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="mb5 mt10"
                    >
                      <div className="flex-row">
                        <div className="flex-start ml15">
                          <div className="flex-center">
                            <Avatar
                              src="/broken-image.jpg"
                              sx={{ width: 30, height: 30 }}
                            />
                          </div>
                        </div>
                        <div className="ml5 flex-center">
                          <Typography className="font-bold fs12">
                            {app?.userName ?? ""}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="mv5"
                    >
                      <div className="flex-row flex-center">
                        <div className="flex-start ml15">
                          <div className="card-black2 font-bold fs12 capitalize">
                            Meeting Dr. {app?.doctorName}
                          </div>
                        </div>
                        <div className="flex1-end">
                          <div className="mr10 card-light-blue-back card-time">
                            <Typography className="txt-regular card-blue2 fs12">
                              {app?.appoimentTime}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="mt10"
                    >
                      <div
                        className={`card-bottom-color flex-center ${
                          app?.appoinmentType === "Virtual" || "Physical"
                            ? "card-bot-blue-back"
                            : app?.appoinmentType === "Vaccination"
                            ? "card-bot-green-back"
                            : app?.appoinmentType === "Emergency"
                            ? "card-bot-red-back"
                            : "card-bot-rose-back"
                        }`}
                      >
                        <Typography className="font-bold fs12 white-color capitalize">
                          {`${
                            app?.appoinmentType === "Virtual" || "Physical"
                              ? "Consultation"
                              : app?.appoinmentType === "Vaccination"
                              ? "Vaccination"
                              : app?.appoinmentType === "Emergency"
                              ? "Emergency"
                              : "Other"
                          } | ${app?.reason}`}
                        </Typography>
                      </div>
                    </Grid>
                  </Grid>
                </Card>
              );
            })
          ) : (
            <div className="flex-center mt20">
              <Typography className="txt-regular">No Records found</Typography>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (pets) {
    return (
      <div className="CustomCard-main">
        <Grid container spacing={2}>
          {list?.map((li, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
              <Grid container spacing={0}>
                <Grid
                  item
                  xs={3}
                  sm={3}
                  md={4}
                  lg={4}
                  xl={4}
                  onClick={() => onCardClick(li)}
                  className="cursor"
                >
                  <div className="flex-center">
                    {li?.petImage ? (
                      <CardMedia
                        image={li?.petImage}
                        className="CustomCard-img3 brd-r6"
                      />
                    ) : (
                      <div className="flex-center h125img">
                        <Typography className="font-bold fs30 white-color">
                          {li?.petName?.[0]}
                        </Typography>
                      </div>
                    )}
                  </div>
                </Grid>
                <Grid
                  item
                  xs={9}
                  sm={9}
                  md={8}
                  lg={8}
                  xl={8}
                  // onClick={() => onCardClick(li)}
                >
                  <Card
                    sx={{ borderRadius: 1, padding: 2 }}
                    className="CustomCard-back vet-card-bg brd-r6"
                  >
                    <div className="flex-row">
                      <div className="flex-start">
                        <div className="flex-column">
                          <div className="flex-row mw-100">
                            <Typography
                              variant="body1"
                              className="mb10 font-bold fs14 capitalize"
                            >
                              {li?.petName}
                            </Typography>
                            <Typography
                              variant="body1"
                              className={`ml5 capitalize font-medium fs14 ${
                                li?.gender === "male"
                                  ? "card-blue-color"
                                  : "card-rose-color"
                              }`}
                            >
                              {`(${li?.gender})`}
                            </Typography>
                          </div>
                          <Typography
                            variant="body2"
                            className="mb10 text-ellipsis txt-regular card-gray-color fs12"
                            title={li?.breed}
                          >
                            {li?.breed}
                          </Typography>
                          <div className="flex-row align-center-wh">
                            <AccountCircleOutlinedIcon
                              sx={{ width: 20, height: 20 }}
                            />

                            <Typography
                              variant="body1"
                              className="font-bold fs12 capitalize flex-center "
                            >
                              {li?.userName ?? li?.parentname}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="flex1-end">
                        <div className="flex-column">
                          <div className="flex1-end mb10">
                            <MessageOutlinedIcon
                              sx={{
                                color: AppColors.appYellow,
                                width: 35,
                                height: 35,
                              }}
                            />
                          </div>
                          <div className="mt10">
                            <CustomButton
                              text="Book"
                              onClick={() => onBookClick(li)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }
  if (bill) {
    return (
      <div className="CustomCard-main-bill">
        <Grid container spacing={1}>
          {list?.map((li, i) => (
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4} key={i}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Card
                    sx={{
                      borderRadius: 1,
                      padding: 2,
                      borderTopColor: `${getBorderColor(li.paymentStatus)}`,
                    }}
                    className="CustomCard-back-bill"
                    onClick={() => onClick(li)}
                  >
                    <div className="maint">
                      <div className="flex-row topt">
                        <Grid item xs={3}>
                          <div className="flex-center">
                            {li?.petImage ? (
                              <CardMedia
                                image={li?.petImage}
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
                                  {li?.petName}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  className={`ml5 font-medium fs14 capitalize ${
                                    li?.gender === "male"
                                      ? "card-blue-color"
                                      : "card-rose-color"
                                  }`}
                                >
                                  {`(${li?.gender})`}
                                </Typography>
                              </div>
                              <Typography
                                variant="body2"
                                className="mb10 txt-regular card-gray-color fs12"
                              >
                                {li?.breed}
                              </Typography>
                            </div>
                          </div>
                        </div>
                        <div>
                          <MoreVertIcon
                            className="card-3dot-color"
                            onClick={(event) => handleClick(event, i)}
                            size="small"
                            sx={{
                              ml: 2,
                              cursor: "pointer",
                              transition: "color 0.3s ease",
                              ":hover": {
                                color: "#1976d2",
                              },
                            }}
                            aria-controls={
                              anchorEls[i] ? "account-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={anchorEls[i] ? "true" : undefined}
                          />
                        </div>
                      </div>
                      <div>
                        <Menu
                          anchorEl={anchorEls[i]}
                          id="account-menu"
                          open={Boolean(anchorEls[i])}
                          onClose={() => handleClose(i)}
                          onClick={() => handleClose(i)}
                          PaperProps={{
                            elevation: 0,
                            sx: {
                              overflow: "visible",
                              filter:
                                "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                              mt: 1.5,
                              "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                              },
                              "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                              },
                            },
                          }}
                          transformOrigin={{
                            horizontal: "right",
                            vertical: "top",
                          }}
                          anchorOrigin={{
                            horizontal: "right",
                            vertical: "bottom",
                          }}
                        >
                          {li?.appointmentStatus === "completed" ||
                          li?.paymentStatus === "Paid" ? (
                            <MenuItem
                              onClick={() => handleViewBill(li)}
                              className="txt-regular fs14"
                            >
                              View Invoice
                            </MenuItem>
                          ) : null}
                          {li?.appointmentStatus !== "completed" &&
                          li?.paymentStatus !== "Paid" ? (
                            <>
                              <MenuItem
                                onClick={() => handlePayBill(li)}
                                className="txt-regular fs14"
                              >
                                Pay Bill
                              </MenuItem>
                              <MenuItem
                                onClick={() => handleEditBill(li)}
                                className="txt-regular fs14"
                              >
                                Edit Bill
                              </MenuItem>
                            </>
                          ) : null}
                        </Menu>
                        <div className="flex-row parentcontainer">
                          <div className="flex-row iconcontainer">
                            <AccountCircleOutlinedIcon
                              sx={{ width: 25, height: 25 }}
                            />
                            <Typography className="font-bold fs14 capitalize flex-center h35">
                              {li?.userName}
                            </Typography>
                          </div>
                          <div className="meeting-doctor">
                            Meeting Dr. {li?.vetName}
                          </div>
                        </div>
                        <div
                          className={
                            li?.balanceDue === "Nil"
                              ? "balancedueblue"
                              : "balanceduered"
                          }
                        >
                          Balance due: {li?.balanceDue}
                        </div>
                        <div className="datecontainer">
                          <div className="trdate">{li?.trDate}</div>
                          <div
                            className={
                              li?.paymentStatus === "Paid"
                                ? "paymentstatuspaid"
                                : li?.paymentStatus === "Unpaid"
                                ? "paymentstatusunpaid"
                                : "paymentstatuspartial"
                            }
                          >
                            {capitalizeWords(li?.paymentStatus)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`conttype ${
                        li?.appointmentType === "Physical"
                          ? "card-con-blue-back"
                          : "virtual-bg-color"
                      }`}
                    >
                      {li?.appointmentType}
                    </div>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  if (small) {
    return (
      <div className="CustomCard-main">
        <Grid container spacing={2}>
          {list?.map((li, i) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={3} key={i}>
              <Card sx={{ borderRadius: 1, padding: 2 }}>
                <Grid container>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="flex-end">
                      <CustomSwitch
                        value={li?.active === "N" ? false : true}
                        onChange={(e) => onChangeSwitch(e, li)}
                        greenToRed
                      />
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    md={4}
                    lg={4}
                    xl={4}
                    onClick={() => onCardClick(li)}
                    className="cursor"
                  >
                    <div className="flex-center">
                      {li?.image || li?.image ? (
                        <CardMedia
                          image={li?.image || li?.image}
                          className="CustomCard-img"
                        />
                      ) : (
                        <div className="CustomCard-empty-img" />
                      )}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={9}
                    sm={9}
                    md={8}
                    lg={8}
                    xl={8}
                    onClick={() => onCardClick(li)}
                    className="cursor"
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Typography variant="body1" className="mb10 text">
                        {li?.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="mb10 CustomCard-secondary-text capitalize"
                      >
                        {li?.speciality}
                      </Typography>
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    onClick={() => onCardClick(li)}
                    className="cursor"
                  >
                    <div className="flex-end">
                      {li?.consulationType?.map((type) => (
                        <div className="consultation-type" key={type}>
                          {type}
                        </div>
                      ))}
                    </div>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    onClick={() => onCardClick(li)}
                    className="cursor"
                  >
                    <div style={{ marginTop: 10, marginBottom: 10 }}>
                      <Divider />
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <div className="flex-center">
                      <div>
                        <CustomButton
                          text="Manage Slot"
                          yellowBtn
                          smallBtn
                          onClick={() => onManageSlotClick(li)}
                        />
                      </div>
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <div className="flex-center">
                      <div>
                        <CustomButton
                          text="Modify"
                          smallBtn
                          whiteBtn
                          onClick={() => onModifyClick(li)}
                        />
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    );
  }

  return (
    <Card sx={{ borderRadius: "15px" }}>
      {image ? (
        <div style={padCur}>
          <CardMedia
            component="img"
            height={imageHeight}
            image={image}
            alt="green iguana"
            style={{ borderRadius: 15 }}
            onClick={() => onClick(id)}
          />
        </div>
      ) : null}

      <CardContent onClick={() => onClick(id)}>
        {cardHeader ? (
          <Typography
            gutterBottom
            variant="subtitle1"
            className="text"
            style={{ marginTop: -20, marginLeft: -10 }}
          >
            {cardHeader}
          </Typography>
        ) : null}

        <Typography
          variant="body2"
          color="text.secondary"
          className="text"
          style={{ marginTop: -10, marginLeft: -10, marginBottom: -15 }}
        >
          {cardText}
        </Typography>
      </CardContent>
    </Card>
  );
};

CustomCard.propTypes = {
  image: PropTypes.string,
  cardHeader: PropTypes.string,
  cardText: PropTypes.string,
  imageHeight: PropTypes.number,
  onClick: PropTypes.func,
  small: PropTypes.bool,
  list: PropTypes.array,
  onManageSlotClick: PropTypes.func,
  onModifyClick: PropTypes.func,
  onChangeSwitch: PropTypes.func,
  onCardClick: PropTypes.func,
  dashboard: PropTypes.bool,
  topBarClassName: PropTypes.string,
  users: PropTypes.bool,
  pets: PropTypes.bool,
  onClickCalendar: PropTypes.func,
  onClickDollar: PropTypes.func,
  handleViewBill: PropTypes.func,
  handlePayBill: PropTypes.func,
  handleEditBill: PropTypes.func,
};

CustomCard.defaultProps = {
  image: "",
  cardHeader: "",
  cardText: "",
  imageHeight: 50,
  onClick: () => {},
  small: false,
  list: [],
  onManageSlotClick: () => {},
  onModifyClick: () => {},
  onChangeSwitch: () => {},
  onCardClick: () => {},
  dashboard: false,
  topBarClassName: "",
  users: false,
  pets: false,
  onClickCalendar: () => {},
  onClickDollar: () => {},
  handleViewBill: () => {},
  handlePayBill: () => {},
  handleEditBill: () => {},
};

export default CustomCard;
