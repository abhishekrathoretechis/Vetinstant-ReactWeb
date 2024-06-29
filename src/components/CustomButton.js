import { Button } from "@mui/material";
import PropTypes from "prop-types";
import * as React from "react";
import { AppColors } from "../util/AppColors";
import "./Component.css";

const CustomButton = ({
  text,
  fullWidth,
  focusVisible,
  disabled,
  onClick,
  yellowBtn,
  redBtn,
  smallBtn,
  grayBtn,
  whiteBtn,
  leftIcon,
  startIcon,
  textBtn,
  tabSelectdBtn,
  color,
  tabOutlined,
  noBgbtn
}) => {
  if (tabOutlined) {
    return (
      <Button
        disabled={disabled}
        fullWidth={fullWidth}
        focusvisible={focusVisible}
        sx={{
          "&.MuiButton-root": {
            fontSize: 14,
            backgroundColor: yellowBtn ? AppColors.yellowBtn : AppColors.white,
            borderRadius: "5px !important",
            height: 30,
            textTransform: "capitalize",
            fontWeight: "600",
            paddingLeft: "10px !important",
            paddingRight: "10px !important",
            width: "100%",
            borderColor: yellowBtn ? AppColors.yellowBtn : AppColors.appPrimary,
            color: yellowBtn ? AppColors.white : AppColors.gray3,
            fontFamily: "Montserrat",
            boxShadow: "none !important",
          },
          "&.MuiButton-text": {
            color: whiteBtn ? AppColors.black : AppColors.white,
            fontFamily: "Montserrat",
          },
        }}
        variant={yellowBtn ? "contained" : "outlined"}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  }

  if (tabSelectdBtn) {
    return (
      <Button
        disabled={disabled}
        fullWidth={fullWidth}
        focusvisible={focusVisible}
        size="small"
        sx={{
          "&.MuiButton-root": {
            fontSize: 14,
            backgroundColor: AppColors.topSelectdBtn,
            borderRadius: "5px !important",
            height: 30,
            textTransform: "capitalize",
            fontWeight: "600",
            width: "100%",
            paddingLeft: "10px !important",
            paddingRight: "10px !important",
            borderColor: AppColors.topSelectdBtn,
            color: AppColors.appPrimary,
            fontFamily: "Montserrat",
            boxShadow: "none !important",
          },
          "&.MuiButton-text": {
            color: AppColors.appPrimary,
            fontFamily: "Montserrat",
          },
        }}
        variant={whiteBtn ? "outlined" : "contained"}
        onClick={onClick}
        className={noBgbtn ? 'no-bg-btn' : ''}
      >
        {text}
      </Button>
    );
  }

  if (textBtn) {
    return (
      <Button
        variant="text"
        sx={{
          "&.MuiButton-root": {
            fontSize: 14,
            textTransform: "capitalize",
            fontWeight: "600",
            height: "30px",
            paddingLeft: "10px !important",
            paddingRight: "10px !important",
            width: "100%",
            color: color ?? AppColors.appPrimary,
            fontFamily: "Montserrat",
            boxShadow: "none !important",
          },
          "&.MuiButton-text": {
            color: color ?? AppColors.appPrimary,
            fontFamily: "Montserrat",
          },
        }}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  }

  if (leftIcon) {
    return (
      <Button
        disabled={disabled}
        fullWidth={fullWidth}
        focusvisible={focusVisible}
        sx={{
          "&.MuiButton-root": {
            fontSize: 14,
            backgroundColor: redBtn
              ? AppColors.redBtn
              : yellowBtn
                ? AppColors.yellowBtn
                : whiteBtn
                  ? AppColors.white
                  : grayBtn
                    ? AppColors.grayBtn
                    : AppColors.appPrimary,
            borderRadius: "5px !important",
            height: 30,
            textTransform: "capitalize",
            fontWeight: "600",
            paddingLeft: "10px !important",
            paddingRight: "10px !important",
            width: "100%",
            color: AppColors.white,
            fontFamily: "Montserrat",
            boxShadow: "none !important",
          },
          "&.MuiButton-text": {
            color: AppColors.white,
            fontFamily: "Montserrat",
          },
        }}
        variant={"contained"}
        onClick={onClick}
        startIcon={startIcon}
      >
        {text}
      </Button>
    );
  }

  if (smallBtn) {
    return (
      <Button
        disabled={disabled}
        fullWidth={fullWidth}
        focusvisible={focusVisible}
        sx={{
          "&.MuiButton-root": {
            fontSize: 14,
            backgroundColor: redBtn
              ? AppColors.redBtn
              : yellowBtn
                ? AppColors.yellowBtn
                : whiteBtn
                  ? AppColors.white
                  : grayBtn
                    ? AppColors.grayBtn
                    : AppColors.appPrimary,
            borderRadius: "5px !important",
            height: 30,
            textTransform: "capitalize",
            fontWeight: "600",
            paddingLeft: "10px !important",
            paddingRight: "10px !important",
            width: "100%",
            borderColor: whiteBtn ? AppColors.btnGrayBorder : null,
            color: whiteBtn ? AppColors.btnWhite : AppColors.white,
            fontFamily: "Montserrat",
            boxShadow: "none !important",
          },
          "&.MuiButton-text": {
            color: whiteBtn ? AppColors.black : AppColors.white,
            fontFamily: "Montserrat",
          },
        }}
        variant={whiteBtn ? "outlined" : "contained"}
        onClick={onClick}
      >
        {text}
      </Button>
    );
  }

  return (
    <Button
      disabled={disabled}
      fullWidth={fullWidth}
      focusvisible={focusVisible}
      sx={{
        "&.MuiButton-root": {
          fontSize: 14,
          backgroundColor: redBtn
            ? AppColors.redBtn
            : yellowBtn
              ? AppColors.yellowBtn
              : grayBtn
                ? AppColors.grayBtn
                : whiteBtn
                  ? AppColors.white
                  : AppColors.appPrimary,
          borderRadius: "5px !important",
          height: 40,
          textTransform: "capitalize",
          fontWeight: "600",
          paddingLeft: "20px !important",
          paddingRight: "20px !important",
          width: "100%",
          boxShadow: "none !important",
        },
        "&.MuiButton-text": {
          color: whiteBtn ? AppColors.appPrimary : AppColors.white,
          fontFamily: "Montserrat",
        },
      }}
      variant={whiteBtn ? "outlined" : "contained"}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  fullWidth: PropTypes.bool,
  yellowBtn: PropTypes.bool,
  smallBtn: PropTypes.bool,
  redBtn: PropTypes.bool,
  grayBtn: PropTypes.bool,
  whiteBtn: PropTypes.bool,
  leftIcon: PropTypes.bool,
  textBtn: PropTypes.bool,
  color: PropTypes.string,
  tabOutlined: PropTypes.bool,
};

CustomButton.defaultProps = {
  text: "",
  disabled: false,
  onClick: () => { },
  fullWidth: false,
  yellowBtn: false,
  smallBtn: false,
  redBtn: false,
  grayBtn: false,
  whiteBtn: false,
  leftIcon: false,
  textBtn: false,
  color: AppColors.appPrimary,
  tabOutlined: false,
};

export default CustomButton;
