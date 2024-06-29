import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import { AppColors } from "../../util/AppColors";

const CustomSelect = ({
  value,
  handleChange,
  label,
  list,
  selectedBlueColor,
  multiSelectTag,
  select,
  selectFixed,
  error,
  helperText,
  multiSelectTagCheck,
  labelTop,
  newSelect,
  defaultValue,
  scheduleButton,
  disabled,
  multiline,
  color,
}) => {
  const theme = useTheme();
  const [selectedValue, setSelectedValue] = useState(
    list?.find((item) => item?.value === value) || null
  );

  const handleSelectionChange = (event, newValue) => {
    setSelectedValue(newValue);
    handleChange(newValue ? newValue.value : "");
  };

  function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  if (labelTop) {
    return (
      <>
        {labelTop ? (
          <Typography className="font-medium fs14">{label}</Typography>
        ) : null}

        {multiSelectTagCheck ? (
          <FormControl fullWidth error={error} disabled={disabled}>
            {/* <InputLabel id="demo-multiple-chip-label">{label}</InputLabel> */}
            <Select
              size="small"
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={value}
              onChange={handleChange}
              // input={<OutlinedInput id="select-multiple-chip" label={label} />}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    height: 20,
                  }}
                >
                  {selected?.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {list?.map((li, i) => (
                <MenuItem key={i} value={li?.value}>
                  <Checkbox checked={value?.indexOf(li?.value) > -1} />
                  <ListItemText primary={li?.name} />
                </MenuItem>
              ))}
            </Select>
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
          </FormControl>
        ) : select ? (
          <FormControl fullWidth error={error}>
            {/* <InputLabel id="demo-simple-select-label">{label}</InputLabel> */}
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              // label={label}
              onChange={handleChange}
            >
              {list?.map((li, i) => (
                <MenuItem value={li?.value} key={i}>
                  {li?.name}
                </MenuItem>
              ))}
            </Select>
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
          </FormControl>
        ) : (
          <FormControl sx={{ m: 1, minWidth: 50 }} size="small" fullWidth>
            {/* <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel> */}
            <Select
              size="small"
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={value}
              // label={label}
              onChange={handleChange}
              sx={{ background: AppColors.white }}
            >
              {list?.map((li, i) => (
                <MenuItem value={li?.value} key={i}>
                  {li?.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </>
    );
  }

  if (color) {
    return (
      <>
        {labelTop ? (
          <Typography className="font-medium fs14">{label}</Typography>
        ) : null}

        {multiSelectTagCheck ? (
          <FormControl fullWidth error={error} disabled={disabled}>
            {/* <InputLabel id="demo-multiple-chip-label">{label}</InputLabel> */}
            <Select
              size="small"
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={value}
              onChange={handleChange}
              // input={<OutlinedInput id="select-multiple-chip" label={label} />}
              renderValue={(selected) => (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    height: 20,
                  }}
                >
                  {selected?.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {list?.map((li, i) => (
                <MenuItem key={i} value={li?.value}>
                  <Checkbox checked={value?.indexOf(li?.value) > -1} />
                  <ListItemText primary={li?.name} />
                </MenuItem>
              ))}
            </Select>
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
          </FormControl>
        ) : select ? (
          <FormControl fullWidth error={error}>
            {/* <InputLabel id="demo-simple-select-label">{label}</InputLabel> */}
            <Select
              size="small"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              // label={label}
              onChange={handleChange}
              sx={{ background: value }}
            >
              {list?.map((li, i) => (
                <MenuItem
                  value={li?.value}
                  key={i}
                  style={{ color: li?.value }}
                >
                  {li?.name}
                </MenuItem>
              ))}
            </Select>
            {error ? <FormHelperText>{helperText}</FormHelperText> : null}
          </FormControl>
        ) : (
          <FormControl  size="small" fullWidth>
            {/* <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel> */}
            <Select
              size="small"
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={value}
              // label={label}
              onChange={handleChange}
            >
              {list?.map((li, i) => (
                <MenuItem value={li?.value} key={i}>
                  {/* {li?.name} */}
                  <div
                    style={{
                      background: li?.name,
                      width: "25px",
                      height: "25px",
                      borderRadius:"4px"
                    }}
                  ></div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </>
    );
  }

  if (multiSelectTagCheck) {
    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          size="small"
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => (
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, height: 20 }}
            >
              {selected?.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {list?.map((li, i) => (
            <MenuItem key={i} value={li?.value}>
              <Checkbox checked={value?.indexOf(li?.value) > -1} />
              <ListItemText primary={li?.name} />
            </MenuItem>
          ))}
        </Select>
        {error ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  }

  if (multiSelectTag) {
    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        <InputLabel id="demo-multiple-chip-label">{label}</InputLabel>
        <Select
          size="small"
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={value}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label={label} />}
          renderValue={(selected) => (
            <Box
              sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, height: 20 }}
            >
              {selected?.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {list?.map((li, i) => (
            <MenuItem
              key={i}
              value={li?.value}
              style={getStyles(li?.value, value, theme)}
            >
              {li?.name}
            </MenuItem>
          ))}
        </Select>
        {error ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  }

  if (selectedBlueColor) {
    return (
      <FormControl
        sx={{ minWidth: 50 }}
        size="small"
        fullWidth
        disabled={disabled}
      >
        <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
        <Select
          size="small"
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
          value={value}
          label={label}
          onChange={handleChange}
          sx={{
            background: AppColors.white,
            color: AppColors.appPrimary,
            fontWeight: "bold",
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": {
              border: "none !important",
            },
            ".MuiSvgIcon-root ": {
              fill: `${AppColors.appPrimary} !important`,
            },
          }}
        >
          {list?.map((li, i) => (
            <MenuItem value={li?.value} key={i}>
              {li?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (select) {
    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        <div id="demo-simple-select-label" className="txt-mont fs14 ">
          {label}
        </div>
        <Select
          size="small"
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
          defaultValue={defaultValue}
          className="custom-select vets-select"
        >
          {list?.map((li, i) => (
            <MenuItem value={li?.value} key={i}>
              {li?.name}
            </MenuItem>
          ))}
        </Select>
        {error ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  }

  if (scheduleButton) {
    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        {/* <div id="demo-simple-select-label" className="txt-mont fs14 " >{label}</div> */}
        <Select
          size="small"
          // labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
          defaultValue={defaultValue}
          className="scheduleButton"
          sx={{
            "& .MuiSelect-icon": {
              color: "white", // Change the color to white
              position: "relative", // Position the icon relative for pseudo-element positioning
            },
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
            },
            "& .MuiSelect-select::after": {
              content: '""',
              display: "block",
              width: "1px",
              height: "100%",
              backgroundColor: "white", // Vertical line color
              marginLeft: "auto", // Push line to the right
              marginRight: "8px", // Space between line and arrow
            },
          }}
        >
          {list?.map((li, i) => (
            <MenuItem value={li?.value} key={i}>
              {li?.name}
            </MenuItem>
          ))}
        </Select>
        {error ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  }

  if (selectFixed) {
    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        <div id="demo-simple-select-label-fixed" className="txt-mont fs14 ">
          {label}
        </div>
        <div
          className="demo-simple-select-label-fixed"
          style={{ height: multiline ? "100px" : undefined }}
        >
          {value}
        </div>
        {/* <Select
          size="small"
          labelId="demo-simple-select-label-fixed"
          id="demo-simple-select-fixed"
          value={value}
          label={label}
          // onChange={handleChange}
          defaultValue={defaultValue}
          className="custom-select vets-select"


        > */}
        {/* {list?.map((li, i) => (
            <MenuItem value={li?.value} key={i}>
              {li?.name}
            </MenuItem>
          ))} */}
        {/* </Select> */}
        {error ? <FormHelperText>{helperText}</FormHelperText> : null}
      </FormControl>
    );
  }

  if (newSelect) {
    return (
      <FormControl fullWidth error={error} disabled={disabled}>
        <Autocomplete
          options={list}
          getOptionLabel={(option) => option.name}
          value={selectedValue}
          id="demo-simple-select"
          onChange={handleSelectionChange}
          size="small"
          disabled={disabled}
          renderInput={(params) => (
            <div style={{ marginTop: "5px" }}>
              <TextField
                {...params}
                label={label}
                error={error}
                // helperText={error ? helperText : null}
                id="demo-simple-select"
              />
            </div>
          )}
          fullWidth
          renderOption={(props, option) => (
            <MenuItem {...props}>{option.name}</MenuItem>
          )}
          style={{ overflowY: "auto" }}
        />
        {error && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    );
  }

  return (
    <FormControl
      sx={{ m: 1, minWidth: 50 }}
      size="small"
      fullWidth
      disabled={disabled}
    >
      <InputLabel id="demo-simple-select-helper-label">{label}</InputLabel>
      <Select
        size="small"
        labelId="demo-simple-select-helper-label"
        id="demo-simple-select-helper"
        value={value}
        label={label}
        onChange={handleChange}
        sx={{ background: AppColors.white }}
      >
        {list?.map((li, i) => (
          <MenuItem value={li?.value} key={i}>
            {li?.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

CustomSelect.propTypes = {
  selectedBlueColor: PropTypes.bool,
  multiSelectTag: PropTypes.bool,
  select: PropTypes.bool,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  multiSelectTagCheck: PropTypes.bool,
  labelTop: PropTypes.bool,
  disabled: PropTypes.bool,
};

CustomSelect.defaultProps = {
  selectedBlueColor: false,
  multiSelectTag: false,
  select: false,
  error: false,
  helperText: "",
  multiSelectTagCheck: false,
  labelTop: false,
  disabled: false,
};

export default CustomSelect;
