import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import * as React from "react";
import PropTypes from "prop-types";

const redRadio = {
  "&.Mui-checked": {
    color: "#D2042D",
  },
};

const RadioButtonsGroup = ({
  label,
  legend,
  name,
  disabled,
  handleChange,
  value,
  ischecked,
  redColorRadio,
}) => {
  if (redColorRadio) {
    return (
      <FormControl component="fieldset" className="SelectionControl">
        {legend && <div className="label">{legend}</div>}
        <RadioGroup
          aria-label={name}
          name={name}
          className="RadioGroup"
          value={value}
          disabled={disabled}
          onChange={handleChange}
        >
          <FormControlLabel
            control={
              <Radio
                checked={ischecked}
                className={ischecked ? "checked" : ""}
                sx={redRadio}
              />
            }
            label={label}
          />
        </RadioGroup>
      </FormControl>
    );
  }

  return (
    <FormControl component="fieldset" className="SelectionControl">
      {legend && <div className="label">{legend}</div>}
      <RadioGroup
        aria-label={name}
        name={name}
        className="RadioGroup"
        value={value}
        disabled={disabled}
        onChange={handleChange}
      >
        <FormControlLabel
          control={
            <Radio checked={ischecked} className={ischecked ? "checked" : ""} />
          }
          label={label}
        />
      </RadioGroup>
    </FormControl>
  );
};

RadioButtonsGroup.propTypes = {
  label: PropTypes.string,
  legend: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  handleChange: PropTypes.func,
  value: PropTypes.string,
  ischecked: PropTypes.bool,
  redColorRadio: PropTypes.bool,
};

RadioButtonsGroup.defaultProps = {
  label: "",
  legend: "",
  name: "",
  disabled: false,
  handleChange: () => {},
  value: "",
  ischecked: false,
  redColorRadio: false,
};

export default RadioButtonsGroup;
