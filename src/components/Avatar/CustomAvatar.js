import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import "./Avatar.css";

const CustomAvatar = ({
  alt,
  src,
  width,
  height,
  variant,
  srcSet,
  bgcolor,
}) => {
  return (
    <Avatar
      alt={alt}
      src={src}
      srcSet={srcSet}
      sx={{ width: width, height: height, bgcolor: bgcolor }}
      variant={variant}
      className={"test"}
    />
  );
};
CustomAvatar.defaultProps = {
  alt: "",
  src: "",
  srcSet: "",
  width: "50",
  height: "50",
  variant: "",
  bgcolor: "green[500]",
};
export default CustomAvatar;
