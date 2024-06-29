import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@mui/material";

const CustomAvatar = ({ text, icon, image, src, alter, iconName, size }) => {
  const avatarStyles = {};

  const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  };

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  };
  if (image) {
    return <Avatar alt={alter} src={src} sx={{ width: size, height: size }} />;
  }

  if (icon) {
    return <Avatar>{iconName}</Avatar>;
  }

  return <Avatar sx={avatarStyles} {...stringAvatar(text)} />;
};

CustomAvatar.propTypes = {
  text: PropTypes.string,
  image: PropTypes.bool,
  icon: PropTypes.bool,
  src: PropTypes.string,
  alter: PropTypes.string,
  size: PropTypes.number,
};

CustomAvatar.defaultProps = {
  text: "",
  image: false,
  icon: false,
  src: "",
  alter: "",
  size: 24,
};

export default CustomAvatar;
