import { AccountCircle, Visibility, VisibilityOff, Search } from "@mui/icons-material";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import "./Component.css";

import {
  Autocomplete,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import PropTypes from "prop-types";
import React from "react";
import { AppColors } from "../util/AppColors";
import { AdapterDayjs as AdapterDayjsPro } from "@mui/x-date-pickers-pro/AdapterDayjs";
import {
  LocalizationProvider as LocalizationProviderPro,
  MobileDateRangePicker,
} from "@mui/x-date-pickers-pro";
import dayjs from "dayjs";
import { useTheme } from "@emotion/react";

const tagStyle = {
  ".MuiAutocomplete-tag": {
    color: `${AppColors.white} !important`,
    background: "#D22B2B !important",
    fontWeight: "bold",
  },
  ".css-1qfjrom-MuiButtonBase-root-MuiChip-root .MuiChip-deleteIcon": {
    color: `${AppColors.white} !important`,
  },
  ".css-1qfjrom-MuiButtonBase-root-MuiChip-root .MuiChip-deleteIcon:hover": {
    color: "#E5E4E2 !important",
  },
  ".css-1orv2hh .MuiChip-deleteIcon": {
    color: `${AppColors.white} !important`,
    fontSize: 22,
  },
};

const CustomTextField = ({
  label,
  defaultValue,
  helperText,
  placeholder,
  handleChange,
  value,
  multiline,
  maxRowsValue,
  select,
  chilran,
  fullWidth,
  password,
  showPassword,
  handleClickShowPassword,
  handleMouseDownPassword,
  iconTextField,
  disabled,
  search,
  name,
  startIcon,
  endIcon,
  inputIcon,
  type,
  variant,
  date,
  dateFormat,
  error,
  multiSelect,
  multiSelectItems,
  multipleSelect,
  tags,
  options,
  tagsDefaultValue,
  minDate,
  maxDate,
  mobileDate,
  mobileTime,
  required,
  multiSelectValue,
  rows,
  is12HourFomat,
  labelTop,
  backgroundColor,
  mobileDateRange,
  searchBill,
  suffix,
  mobileDateNew,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (tags) {
    return (
      <Autocomplete
        multiple
        limitTags={2}
        id="multiple-limit-tags"
        options={options}
        getOptionLabel={(option) => option?.title}
        defaultValue={tagsDefaultValue}
        value={value}
        name={name}
        fullWidth={fullWidth}
        error={error}
        sx={tagStyle}
        onChange={(event, value) => handleChange({ target: { value, name } })}
        renderInput={(params, i) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            key={i}
          />
        )}
      />
    );
  }

  if (mobileDateRange) {
    return (
      <LocalizationProviderPro dateAdapter={AdapterDayjsPro}>
        <MobileDateRangePicker
          defaultValue={[dayjs(new Date()), dayjs(new Date())]}
          onChange={handleChange}
          value={value}
          disablePast
        />
      </LocalizationProviderPro>
    );
  }

  if (mobileDate) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          label={label}
          inputFormat={dateFormat}
          value={value}
          id="filled-required"
          name={name}
          minDate={minDate}
          maxDate={maxDate}
          error={error}
          disabled={disabled}
          onChange={(newDate) =>
            handleChange({
              target: {
                name,
                value: newDate,
              },
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth={fullWidth}
              id="filled-required"
              placeholder={placeholder}
              error={error}
              helperText={helperText}
              size="small"
              sx={{
                "& .MuiInputLabel-root": {
                  fontFamily: "Montserrat",
                },
                display: "flex",
                alignItems: "center",
                background: backgroundColor ?? AppColors.white,
                width: fullWidth ? "100%" : "50%",
                borderRadius: 1,
                // padding: '8.5px 0px',
              }}
            />
          )}
        />
      </LocalizationProvider>
    );
  }
  if (mobileDateNew) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDatePicker
          label={label}
          inputFormat={dateFormat}
          value={value}
          name={name}
          minDate={minDate}
          maxDate={maxDate}
          error={error}
          disabled={disabled}
          size="small"
          onChange={(newDate) =>
            handleChange({
              target: {
                name,
                value: newDate,
              },
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth={fullWidth}
              placeholder={placeholder}
              error={error}
              helperText={helperText}
              size="small"
              sx={{
                "& .MuiInputLabel-root": {
                  fontFamily: "Montserrat",
                },


              }}
            />
          )}
        />
      </LocalizationProvider>
    );
  }
  if (mobileTime) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileTimePicker
          label={label}
          value={value}
          name={name}
          disabled={disabled}
          onChange={(newDate) =>
            handleChange({
              target: {
                name,
                value: newDate,
              },
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth={fullWidth}
              placeholder={placeholder}
              error={error}
              helperText={helperText}
              size="small"
              sx={{
                "& .MuiInputLabel-root": {
                  fontFamily: "Montserrat",
                },


              }}
            />
          )}
          ampm={is12HourFomat}
        />
      </LocalizationProvider>
    );
  }
  if (date) {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesktopDatePicker
          label={label}
          inputFormat={dateFormat}
          value={value}
          name={name}
          minDate={minDate}
          maxDate={maxDate}
          size="small"
          onChange={(newDate) =>
            handleChange({
              target: {
                name,
                value: newDate,
              },
            })
          }
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth={fullWidth}
              placeholder={placeholder}
            />
          )}
        />
      </LocalizationProvider>
    );
  }
  if (search) {
    return (
      <TextField
        required={required}
        id="filled-required"
        label={label}
        defaultValue={defaultValue}
        variant="outlined"
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        fullWidth={fullWidth}
        disabled={disabled}
        name={name}
        type={type}
        error={error}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        size="small"
        sx={{
          display: "flex",
          alignItems: "center",
          background: backgroundColor ?? AppColors.white,
          width: fullWidth ? "100%" : "50%",
          borderRadius: 1,
        }}
      />
    );
  }

  if (searchBill) {
    return (
      <TextField
        required={required}
        id="filled-required"
        label={label}
        defaultValue={defaultValue}
        variant="outlined"
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        fullWidth={fullWidth}
        disabled={disabled}
        name={name}
        type={type}
        error={error}
        size="small"
        sx={{
          display: "flex",
          alignItems: "center",
          background: backgroundColor ?? AppColors.white,
          width: fullWidth ? "100%" : "50%",
          borderRadius: 1,
          marginLeft: 5,

          "@media (max-width: 800px)": {
            // width: "100%",
            marginLeft: 0,
          },
        }}
      />
    );
  }

  if (password) {
    return (
      <FormControl
        sx={{ width: fullWidth ? "100%" : "25ch" }}
        variant={variant}
        error={error}
      >
        {labelTop ? (
          <>
            <Typography className="font-medium fs14">{label}</Typography>

            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={handleChange}
              name={name}
              placeholder={placeholder}
              size="small"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(showPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </>
        ) : (
          <>
            <InputLabel htmlFor="outlined-adornment-password">
              {label}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              value={value}
              onChange={handleChange}
              name={name}
              placeholder={placeholder}
              size="small"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => handleClickShowPassword(showPassword)}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label={label}
            />
          </>
        )}
        {error ? (
          <FormHelperText error id="accountId-error">
            {helperText}
          </FormHelperText>
        ) : null}
      </FormControl>
    );
  }

  if (iconTextField) {
    return (
      <TextField
        id="input-with-icon-textfield"
        label={label}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle />
            </InputAdornment>
          ),
        }}
        variant={variant}
        fullWidth={fullWidth}
        disabled={disabled}
        name={name}
        size="small"
        onChange={handleChange}
      />
    );
  }

  if (select) {
    return (
      <TextField
        required={required}
        id="filled-required"
        label={label}
        defaultValue={defaultValue}
        select
        placeholder={placeholder}
        value={value}
        size="small"
        onChange={handleChange}
        fullWidth={fullWidth}
        disabled={disabled}
        name={name}
      >
        {chilran}
      </TextField>
    );
  }

  if (multiSelect) {
    return (
      <FormControl fullWidth={fullWidth} disabled={disabled}>
        <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple={multipleSelect}
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          name={name}
          size="small"
        >
          {multiSelectItems?.map((name, index) => (
            <MenuItem key={name + index} value={name}>
              {name.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (multiSelectValue) {
    return (
      <FormControl fullWidth={fullWidth} disabled={disabled}>
        <InputLabel id="demo-multiple-name-label">{label}</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple={multipleSelect}
          value={value}
          onChange={handleChange}
          input={<OutlinedInput label={label} />}
          name={name}
          size="small"
          defaultValue={defaultValue}
        >
          {multiSelectItems?.map((name, index) => (
            <MenuItem key={name + index} value={name?.value}>
              {name.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }

  if (multiline) {
    return (
      <TextField
        required={required}
        multiline
        maxRows={maxRowsValue}
        id="filled-required"
        label={label}
        sx={{
          "& .MuiInputLabel-root": {
            fontFamily: "Montserrat", // Change font style to italic
          },
        }}
        size="small"
        defaultValue={defaultValue}
        variant={variant}
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        fullWidth={fullWidth}
        disabled={disabled}
        error={error}
        name={name}
        rows={rows}
      />
    );
  }

  if (startIcon) {
    return (
      <TextField
        type={type}
        required={required}
        id="filled-required"
        label={label}
        defaultValue={defaultValue}
        variant={variant}
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        name={name}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">{inputIcon}</InputAdornment>
          ),
        }}
        size="small"
        onChange={handleChange}
        fullWidth={fullWidth}
        error={error}
        disabled={disabled}
      />
    );
  }

  if (endIcon) {
    return (
      <TextField
        type={type}
        required={required}
        id="filled-required"
        label={label}
        defaultValue={defaultValue}
        variant={variant}
        helperText={helperText}
        placeholder={placeholder}
        value={value}
        name={name}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">{inputIcon}</InputAdornment>
          ),
        }}
        error={error}
        size="small"
        onChange={handleChange}
        fullWidth={fullWidth}
        disabled={disabled}
      />
    );
  }

  if (labelTop) {
    return (
      <>
        {labelTop ? <div className="txt-mont fs14 ">{label}</div> : null}
        <TextField
          required={required}
          id="filled-required"
          defaultValue={defaultValue}
          variant="outlined"
          helperText={helperText}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          fullWidth={fullWidth}
          disabled={disabled}
          name={name}
          type={type}
          error={error}
          size="small"
          InputProps={{
            endAdornment: suffix && (
              <InputAdornment position="end">{suffix}</InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: labelTop,
          }}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            background: AppColors.white,
            width: fullWidth ? "100%" : "50%",
            borderRadius: 1,

            // "& .MuiFormHelperText-root.Mui-error": {
            //   fontSize: 10,
            // },
          }}
        />
      </>
    );
  }

  return (
    <TextField
      required={required}
      id="filled-required"
      label={label}
      defaultValue={defaultValue}
      variant="outlined"
      helperText={helperText}
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      fullWidth={fullWidth}
      disabled={disabled}
      name={name}
      type={type}
      error={error}
      size="small"
      sx={{
        display: "flex",
        alignItems: "center",
        background: backgroundColor ?? AppColors.white,
        width: fullWidth ? "100%" : "50%",
        borderRadius: 1,
        "& .MuiInputLabel-root": {
          fontFamily: "Montserrat", // Change font style to italic
        },
        // "& .MuiFormHelperText-root.Mui-error": {
        //   fontSize: 10,
        // },
      }}
    />
  );
};

CustomTextField.propTypes = {
  label: PropTypes.string,
  multiline: PropTypes.bool,
  helperText: PropTypes.string,
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  select: PropTypes.bool,
  maxRowsValue: PropTypes.number,
  handleChange: PropTypes.func,
  value: PropTypes.any,
  fullWidth: PropTypes.bool,
  password: PropTypes.bool,
  showPassword: PropTypes.bool,
  handleClickShowPassword: PropTypes.func,
  handleMouseDownPassword: PropTypes.func,
  iconTextField: PropTypes.bool,
  name: PropTypes.string,
  startIcon: PropTypes.bool,
  endIcon: PropTypes.bool,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  dateFormat: PropTypes.string,
  date: PropTypes.bool,
  multiSelect: PropTypes.bool,
  multiSelectItems: PropTypes.array,
  multipleSelect: PropTypes.bool,
  tagsDefaultValue: PropTypes.array,
  minDate: PropTypes.any,
  maxDate: PropTypes.any,
  mobileDate: PropTypes.bool,
  multiSelectValue: PropTypes.bool,
  rows: PropTypes.number,
  is12HourFomat: PropTypes.bool,
  labelTop: PropTypes.bool,
  mobileDateRange: PropTypes.bool,
};

CustomTextField.defaultProps = {
  label: "",
  multiline: false,
  helperText: "",
  placeholder: "",
  select: false,
  maxRowsValue: 4,
  handleChange: () => { },
  value: "",
  fullWidth: false,
  password: false,
  showPassword: false,
  handleClickShowPassword: () => { },
  handleMouseDownPassword: () => { },
  iconTextField: false,
  name: "",
  startIcon: false,
  endIcon: false,
  disabled: false,
  type: "text",
  dateFormat: "DD/MM/YYYY",
  date: false,
  multiSelect: false,
  multiSelectItems: [],
  multipleSelect: true,
  tagsDefaultValue: [],
  minDate: new Date(-315639000000),
  maxDate: null,
  mobileDate: false,
  multiSelectValue: false,
  rows: 4,
  is12HourFomat: true,
  labelTop: false,
  mobileDateRange: false,
};

export default CustomTextField;
