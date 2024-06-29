import {
  FormControl,
  FormControlLabel,
  FormGroup,
  Switch,
} from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { AppColors } from "../util/AppColors";

const switchStyle = {
  "& .MuiSwitch-switchBase": {
    color: "#C41E3A !important",
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#C41E3A !important",
  },
  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
    backgroundColor: "#C41E3A !important",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#C41E3A !important",
  },
  "& .css-1yrymlm-MuiTypography-root": {
    color: "#C41E3A !important",
    fontFamily: "Roboto-Bold",
    fontWeight: "bold",
  },
  "& .css-k36ljx": {
    color: "#C41E3A !important",
    fontFamily: "Roboto-Bold",
    fontWeight: "bold",
  },
};

const switchMultiColor = {
  "& .MuiSwitch-switchBase": {
    color: "#C41E3A !important",
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#50C878 !important",
  },
  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
    backgroundColor: "#C41E3A !important",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#50C878 !important",
  },
  ".css-1yrymlm-MuiTypography-root": {
    color: "#C41E3A !important",
    fontFamily: "Roboto-Bold",
    fontWeight: "bold",
  },
};

const switchGrayToRedColor = {
  "& .MuiSwitch-switchBase": {
    color: "#848884 !important",
  },
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: "#C41E3A !important",
  },
  "& .MuiSwitch-switchBase + .MuiSwitch-track": {
    backgroundColor: "#848884 !important",
  },
  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
    backgroundColor: "#C41E3A !important",
  },
  ".css-1yrymlm-MuiTypography-root": {
    color: "#848884 !important",
    fontFamily: "Roboto-Bold",
    fontWeight: "bold",
  },
};

const CustomSwitch = ({
  label,
  name,
  value,
  onChange,
  labelPlacement,
  multiColor,
  grayToRed,
  greenToRed,
  greenToGray,
  disabled,
}) => {
  const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: AppColors.switchGreen,
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : AppColors.switchGray,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
      color: value ? AppColors.switchGreen : AppColors.redBtn,
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : "rgba(0,0,0,.25)",
      boxSizing: "border-box",
    },
  }));

  const GreenToGraySwitch = styled(Switch)(({ theme }) => ({
    width: 28,
    height: 16,
    padding: 0,
    display: "flex",
    "&:active": {
      "& .MuiSwitch-thumb": {
        width: 15,
      },
      "& .MuiSwitch-switchBase.Mui-checked": {
        transform: "translateX(9px)",
      },
    },
    "& .MuiSwitch-switchBase": {
      padding: 2,
      "&.Mui-checked": {
        transform: "translateX(12px)",
        color: AppColors.white,
        "& + .MuiSwitch-track": {
          opacity: 1,
          backgroundColor:
            theme.palette.mode === "dark" ? "#177ddc" : AppColors.switchGreen2,
        },
      },
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
      width: 12,
      height: 12,
      borderRadius: 6,
      transition: theme.transitions.create(["width"], {
        duration: 200,
      }),
      color: AppColors.white,
    },
    "& .MuiSwitch-track": {
      borderRadius: 16 / 2,
      opacity: 1,
      backgroundColor:
        theme.palette.mode === "dark"
          ? "rgba(255,255,255,.35)"
          : AppColors.switchGray2,
      boxSizing: "border-box",
    },
  }));

  if (greenToGray) {
    return (
      <FormControl
        component="fieldset"
        onChange={(e) => {
          onChange({
            target: { name: e.target.name, value: e.target.checked },
          });
        }}
      >
        <FormGroup aria-label="position" row>
          <GreenToGraySwitch
            inputProps={{ "aria-label": "ant design" }}
            checked={value}
            label={label}
            labelPlacement={labelPlacement}
            name={name}
            control={<Switch color="primary" />}
            disabled={disabled}
          />
        </FormGroup>
      </FormControl>
    );
  }

  if (greenToRed) {
    return (
      <FormControl
        component="fieldset"
        onChange={(e) => {
          onChange({
            target: { name: e.target.name, value: e.target.checked },
          });
        }}
      >
        <FormGroup aria-label="position" row>
          <AntSwitch
            inputProps={{ "aria-label": "ant design" }}
            checked={value}
            label={label}
            labelPlacement={labelPlacement}
            name={name}
            control={<Switch color="primary" />}
          />
          {/* <FormControlLabel
            sx={switchStyle}
            checked={value}
            control={<Switch color="primary" />}
            label={label}
            labelPlacement={labelPlacement}
            name={name}
          /> */}
        </FormGroup>
      </FormControl>
    );
  }
  if (grayToRed) {
    return (
      <FormControl
        component="fieldset"
        onChange={(e) => {
          onChange({
            target: { name: e.target.name, value: e.target.checked },
          });
        }}
      >
        <FormGroup aria-label="position" row>
          <FormControlLabel
            sx={switchGrayToRedColor}
            checked={value}
            control={<Switch color="primary" />}
            label={label}
            labelPlacement={labelPlacement}
            name={name}
          />
        </FormGroup>
      </FormControl>
    );
  }

  if (multiColor) {
    return (
      <FormControl
        component="fieldset"
        onChange={(e) => {
          onChange({
            target: { name: e.target.name, value: e.target.checked },
          });
        }}
      >
        <FormGroup aria-label="position" row>
          <FormControlLabel
            sx={switchMultiColor}
            checked={value}
            control={<Switch color="primary" />}
            label={label}
            labelPlacement={labelPlacement}
            name={name}
          />
        </FormGroup>
      </FormControl>
    );
  }

  return (
    <FormControl
      component="fieldset"
      onChange={(e) => {
        onChange({ target: { name: e.target.name, value: e.target.checked } });
      }}
    >
      <FormGroup aria-label="position" row>
        <FormControlLabel
          sx={switchStyle}
          checked={value}
          control={<Switch color="primary" />}
          label={label}
          labelPlacement={labelPlacement}
          name={name}
        />
      </FormGroup>
    </FormControl>
  );
};

CustomSwitch.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.bool,
  onChange: PropTypes.func,
  labelPlacement: PropTypes.string,
  multiColor: PropTypes.bool,
  grayToRed: PropTypes.bool,
  greenToRed: PropTypes.bool,
  greenToGray: PropTypes.bool,
  disabled: PropTypes.bool,
};

CustomSwitch.defaultProps = {
  label: "",
  name: "",
  value: true,
  onChange: () => {},
  labelPlacement: "start",
  multiColor: false,
  grayToRed: false,
  greenToRed: false,
  greenToGray: false,
  disabled: false,
};

export default CustomSwitch;
