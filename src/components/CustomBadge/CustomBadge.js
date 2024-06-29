import * as React from "react";
import Badge from "@mui/material/Badge";
import PropTypes from "prop-types";

const CustomBadge = ({
  content,
  color,
  invisible,
  variant,
  vertical,
  horizontal,
  showZero,
  icon,
}) => {
  return (
    <Badge
      badgeContent={content}
      color={color}
      showZero={showZero}
      variant={variant}
      invisible={invisible}
      anchorOrigin={{
        vertical: vertical,
        horizontal: horizontal,
      }}
    >
      {icon}
    </Badge>
  );
};
CustomBadge.propTypes = {
  content: PropTypes.string,
  color: PropTypes.string,
  variant: PropTypes.string,
  horizontal: PropTypes.string,
  vertical: PropTypes.string,
  overlap: PropTypes.string,
  invisible: PropTypes.bool,
  showZero: PropTypes.bool,
};
CustomBadge.defaultProps = {
  content: "0",
  color: "secondary",
  variant: "standard",
  horizontal: "right",
  vertical: "top",
  overlap: "rectangular",
  invisible: false,
  showZero: false,
};
export default CustomBadge;
