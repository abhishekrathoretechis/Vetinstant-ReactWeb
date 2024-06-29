import PropTypes from "prop-types";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { googlePlacesApiKey } from "../utils/apikey";

const msgStyles = {
  // background: "skyblue",
  color: "white",
};

const CustomGooglePlaces = ({
  location,
  handleChange,
  apiKey,
  placeholder,
  error,
  helperText,
  name,
}) => {
  return (
    <>
      <GooglePlacesAutocomplete
        name={name}
        value={location}
        selectProps={{
          placeholder: placeholder,
          onChange: (value) => {
            handleChange(value);
          },
          styles: {
            control: (provided) => ({
              ...provided,
              height: "56px",
              borderRadius: "5px",
              background: "transparent",
            }),
            noOptionsMessage: (base) => ({ ...base, ...msgStyles }),
            menu: (provided) => ({
              ...provided,
              zIndex: 100,
            }),
          },
        }}
        apiKey={apiKey}
      />
      {error && <span style={{ color: "red" }}>{helperText}</span>}
    </>
  );
};

CustomGooglePlaces.propTypes = {
  location: PropTypes.string,
  handleChange: PropTypes.func,
  apiKey: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string,
  name: PropTypes.string,
};

CustomGooglePlaces.defaultProps = {
  location: "",
  handleChange: () => {},
  apiKey: googlePlacesApiKey,
  placeholder: "",
  error: false,
  helperText: "",
  name: "",
};

export default CustomGooglePlaces;
