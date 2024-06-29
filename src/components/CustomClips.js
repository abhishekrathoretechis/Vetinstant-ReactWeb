import Chip from "@mui/material/Chip";
import PropTypes from "prop-types";
import * as React from "react";
import { AppColors } from "../util/AppColors";

const clipsStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#C80000",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.MuiChip-deletable": {
    color: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsNoIconStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#C80000",
    color: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.MuiChip-deletable": {
    color: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    backgroundColor: "#E5E4E2",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: AppColors.black,
    border: "1px solid #E5E4E2",
    fontWeight: "bold",
  },
};

const clipsNoIconFullWidthStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#fff",
    color: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    width: "100%",
    fontWeight: "bold",
  },
  "&.MuiChip-deletable": {
    color: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsOutlinedStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    borderWidth: 1,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsEasyStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#ffffff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: AppColors.black,
    border: "1px solid #50C878",
    fontWeight: "bold",
  },
  "&.MuiChip-root:hover": {
    backgroundColor: "#AFE1AF",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsEasyFilled = {
  "&.MuiChip-root": {
    backgroundColor: "#50C878",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: "#ffffff",
    border: "1px solid #50C878",
    fontWeight: "bold",
  },
  "&.MuiChip-root:hover": {
    backgroundColor: "#AFE1AF",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsMediumStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: AppColors.black,
    border: "1px solid #FDDA0D",
    fontWeight: "bold",
  },
  "&.MuiChip-root:hover": {
    backgroundColor: "#FFFF8F",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsMediumFilled = {
  "&.MuiChip-root": {
    backgroundColor: "#FFCC00",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: "#ffffff",
    border: "1px solid #FDDA0D",
    fontWeight: "bold",
  },
  "&.MuiChip-root:hover": {
    backgroundColor: "#FFCC00",
    opacity: "0.5",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsHardStyles = {
  "&.MuiChip-root": {
    backgroundColor: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: AppColors.black,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsHardFilled = {
  "&.MuiChip-root": {
    backgroundColor: "#D2042D",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: "#ffffff",
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const grayBackBlackTextStyle = {
  "&.MuiChip-root": {
    backgroundColor: "#E5E4E2",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: AppColors.black,
    border: "1px solid #E5E4E2",
    width: "100%",
    fontWeight: "bold",
  },
  "&.MuiChip-root:hover": {
    backgroundColor: "#C0C0C0",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const grayBtnStyle = {
  "&.MuiChip-root": {
    backgroundColor: "#E5E4E2",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    color: AppColors.black,
    border: "1px solid #E5E4E2",
    fontWeight: "bold",
  },
  "&.MuiChip-root:hover": {
    backgroundColor: "#C0C0C0",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const clipsGradientStyles = {
  "&.MuiChip-root": {
    backgroundImage: "linear-gradient(to right, #FF6600, #C80000)",
    color: "#fff",
    fontFamily: "Roboto-Bold",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
    overflow: "visible !important",
  },

  "&.css-u1f72-MuiButtonBase-root-MuiChip-root": {
    backgroundColor: "#ffffff",
  },
  "&.MuiChip-deletable": {
    color: "#fff",
    fontFamily: "Roboto-Bold",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
    backgroundImage: "none",
    backgroundColor: "#E5E4E2 !important",
    color: "#212529",
  },
};

const clipsGreenStyles = {
  "&.MuiChip-root": {
    color: "#fff",
    backgroundColor: "#32CD32",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.MuiChip-deletable": {
    color: "#fff",
    fontFamily: "Roboto-Regular",
    paddingLeft: 2,
    paddingRight: 2,
    fontWeight: "bold",
  },
  "&.Mui-disabled": {
    opacity: 1,
  },
};

const CustomClips = ({
  label,
  onDelete,
  onClick,
  clickable,
  outlined,
  noIcon,
  disabled,
  easyText,
  mediumText,
  hardText,
  filled,
  grayBackBlackText,
  fullWidth,
  gradiantButton,
  greenButton,
  grayBtn,
  fontSize,
  style,
}) => {
  if (greenButton) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        sx={clipsGreenStyles}
        disabled={disabled}
      />
    );
  }

  if (gradiantButton) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        sx={clipsGradientStyles}
        disabled={disabled}
      />
    );
  }

  if (grayBackBlackText) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        sx={grayBackBlackTextStyle}
        disabled={disabled}
      />
    );
  }
  if (grayBtn) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        sx={[grayBtnStyle, style ?? {}]}
        disabled={disabled}
      />
    );
  }

  if (easyText) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        sx={filled ? clipsEasyFilled : clipsEasyStyles}
        disabled={disabled}
      />
    );
  }

  if (mediumText) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        sx={filled ? clipsMediumFilled : clipsMediumStyles}
        disabled={disabled}
      />
    );
  }

  if (hardText) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        color="error"
        sx={filled ? clipsHardFilled : clipsHardStyles}
        disabled={disabled}
      />
    );
  }

  if (outlined) {
    return (
      <Chip
        label={label}
        variant="outlined"
        onClick={onClick}
        color="error"
        sx={clipsOutlinedStyles}
        disabled={disabled}
      />
    );
  }

  if (noIcon) {
    return (
      <Chip
        label={label}
        onClick={onClick}
        clickable={clickable}
        sx={
          fullWidth
            ? clipsNoIconFullWidthStyles
            : [clipsGradientStyles, style ?? {}]
        }
        disabled={disabled}
      />
    );
  }

  return (
    <Chip
      label={label}
      onDelete={onDelete}
      onClick={onClick}
      clickable={clickable}
      sx={clipsStyles}
      disabled={disabled}
    />
  );
};

CustomClips.propTypes = {
  label: PropTypes.string,
  outlined: PropTypes.bool,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  noIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  easyText: PropTypes.bool,
  mediumText: PropTypes.bool,
  hardText: PropTypes.bool,
  filled: PropTypes.bool,
  grayBackBlackText: PropTypes.bool,
  fullWidth: PropTypes.bool,
  gradiantButton: PropTypes.bool,
  greenButton: PropTypes.bool,
  grayBtn: PropTypes.bool,
};

CustomClips.defaultProps = {
  label: "",
  outlined: false,
  onClick: () => {},
  onDelete: () => {},
  noIcon: false,
  disabled: false,
  easyText: false,
  mediumText: false,
  hardText: false,
  filled: false,
  grayBackBlackText: false,
  fullWidth: false,
  gradiantButton: false,
  greenButton: false,
  grayBtn: false,
};

export default CustomClips;
