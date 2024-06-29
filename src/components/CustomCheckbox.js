import { Checkbox, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import PropTypes from "prop-types";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { AppColors } from "../util/AppColors";

const checkBoxStyle = {
  "&.MuiCheckbox-root": { width: 20, height: 20, margin: 1 },
  "&.Mui-checked": {
    // background: "linear-gradient(to right, red, orange)",
    borderRadius: "50%",
    width: 20,
    height: 20,
    margin: 1,
    color: AppColors.appPrimary,
  },
};

const CustomCheckbox = ({
  label,
  name,
  onChange,
  checked,
  disabled,
  circle,
  radio,
  radios,
  defaultValue,
}) => {
  if (radio) {
    return (
      <RadioGroup
        row
        aria-labelledby="demo-radio-buttons-group-label"
        defaultValue={defaultValue}
        name={name}
        onChange={onChange}
      >
        {radios?.map((radio, i) => (
          <FormControlLabel
            key={i}
            value={radio?.value}
            control={<Radio />}
            label={radio?.label}
            disabled={disabled}
            sx={{ fontFamily: "Montserrat" }}

          />
        ))}
      </RadioGroup>
    );
  }

  if (circle) {
    return (
      <FormControlLabel
        control={
          <Checkbox
            icon={<RadioButtonUncheckedIcon />}
            checkedIcon={<CheckCircleIcon />}
            checked={checked}
            onChange={() => onChange(checked)}
            name={name}
            disabled={disabled}
            sx={checkBoxStyle}
          />
        }
        label={label}
      />
    );
  }

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={() => onChange(checked)}
          name={name}
          disabled={disabled}
          sx={checkBoxStyle}
        />
      }
      label={label}
    />
  );
};

CustomCheckbox.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  circle: PropTypes.bool,
  radio: PropTypes.bool,
  radios: PropTypes.array,
  defaultValue: PropTypes.string,
};

CustomCheckbox.defaultProps = {
  label: "",
  name: "",
  onChange: () => { },
  checked: false,
  disabled: false,
  circle: false,
  radio: false,
  radios: [],
  defaultValue: "",
};

export default CustomCheckbox;
