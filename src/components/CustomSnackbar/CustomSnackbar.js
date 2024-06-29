// import CloseIcon from "@mui/icons-material/Close";
import { Alert, AlertTitle, Avatar } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
import Snackbar from "@mui/material/Snackbar";
import PropTypes from "prop-types";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { snackClear } from "../../redux/reducers/snackSlice";
import { AppColors } from "../../util/AppColors";

// const snackbarStyle = {
//   ".css-1eqdgzv-MuiPaper-root-MuiSnackbarContent-root": {
//     backgroundImage: "linear-gradient(180deg, red, orange)",
//   },
// };

const snackPosition = { vertical: "bottom", horizontal: "right" };
const snackNotPosition = { vertical: "top", horizontal: "right" };

const CustomSnackbar = () => {
  const {
    message,
    title,
    successSnackbarOpen,
    errorSnackbarOpen,
    infoSnackbarOpen,
    warningSnackbarOpen,
    notificationSnackbarOpen,
    severity,
  } = useSelector((state) => state.snack);
  const dispatch = useDispatch();
  const snackHideInMs = 10000;

  const handelClick = () => {
    dispatch(snackClear());
  };

  // const action = (
  //   <React.Fragment>
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={handelClick}
  //     >
  //       <CloseIcon fontSize="small" />
  //     </IconButton>
  //   </React.Fragment>
  // );

  return (
    <Snackbar
      open={
        successSnackbarOpen ||
        errorSnackbarOpen ||
        warningSnackbarOpen ||
        infoSnackbarOpen ||
        notificationSnackbarOpen
      }
      autoHideDuration={snackHideInMs}
      key={notificationSnackbarOpen ? snackNotPosition : snackPosition}
      anchorOrigin={notificationSnackbarOpen ? snackNotPosition : snackPosition}
      onClose={handelClick}
    >
      {notificationSnackbarOpen ? (
        <Alert
          severity={severity}
          sx={{
            width: "100%",
            background: AppColors.snackInfo,
            color: AppColors.white,
          }}
          onClose={handelClick}
          className="text-bold"
          icon={false}
        >
          <div className="flex-row">
            <div className="wAaCjCdF">
              <Avatar src={"https://picsum.photos/200"} alt="photoURL" />
            </div>
            <div className="wAfCdFml10">
              {title?.length > 0 ? <AlertTitle>{title}</AlertTitle> : null}
              {message}
            </div>
          </div>
        </Alert>
      ) : (
        <Alert
          severity={severity}
          sx={{
            width: "100%",
            background: successSnackbarOpen
              ? AppColors.snackGreen
              : errorSnackbarOpen
              ? AppColors.snackError
              : warningSnackbarOpen
              ? AppColors.snackWarn
              : AppColors.snackInfo,
            color: AppColors.white,
          }}
          onClose={handelClick}
          className="text-bold"
        >
          {message}
        </Alert>
      )}
    </Snackbar>

    // <Snackbar
    //   anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    //   open={successSnackbarOpen}
    //   message={message}
    //   // autoHideDuration={6000}
    //   action={action}
    //   onClose={handelClick}
    //   sx={snackbarStyle}
    // >
    //   {/* <Alert onClose={handelClick} severity={severity} sx={{ width: '100%' }}>
    //       {message}
    //     </Alert> */}
    // </Snackbar>
  );
};
CustomSnackbar.propTypes = {
  vertical: PropTypes.string,
  horizontal: PropTypes.string,
  open: PropTypes.bool,
  message: PropTypes.string,
  handleClose: PropTypes.func,
  autoHideDuration: PropTypes.number,
};

CustomSnackbar.defaultProps = {
  snackbarOpen: false,
  message: "",
  vertical: "bottom",
  horizontal: "left",
  handleClose: () => {},
  autoHideDuration: 2,
};

export default CustomSnackbar;
