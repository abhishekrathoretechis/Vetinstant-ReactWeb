import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import PropTypes from "prop-types";

const CustomProgress = ({
  type,
  color,
  variant,
  value,
  width,
  disableShrink,
  size,
  thickness,
  sx,
  valueBuffer,
}) => {
  if (type === "circular") {
    if (variant === "determinate") {
      return (
        <CircularProgress
          variant="determinate"
          color={color}
          value={value}
          size={size}
          sx={sx}
          thickness={thickness}
        />
      );
    }
    return (
      <CircularProgress
        color={color}
        disableShrink={disableShrink}
        size={size}
        sx={sx}
        thickness={thickness}
      />
    );
  } else {
    return (
      <Box sx={{ width: width }}>
        <LinearProgress
          color={color}
          variant={variant}
          value={value}
          valueBuffer={valueBuffer}
        />
      </Box>
    );
  }
};

CustomProgress.propTypes = {
  type: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  width: PropTypes.string,
  disableShrink: PropTypes.bool,
  size: PropTypes.number,
  thickness: PropTypes.number,
  valueBuffer: PropTypes.number,
  value: PropTypes.number,
};
CustomProgress.defaultProps = {
  type: "circular",
  color: "primary",
  variant: "indeterminate",
  value: 100,
  disableShrink: false,
  width: "100%",
  size: 40,
  thickness: 3.6,
  valueBuffer: 0,
};

export default CustomProgress;
