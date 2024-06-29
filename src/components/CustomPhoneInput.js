import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const CustomPhoneInput = ({
  value,
  onChange,
  name,
  helperText,
  error,
  searchPlaceholder,
}) => {
  return (
    <>
      <p>Phone number</p>
      <PhoneInput
        country={"in"}
        value={value}
        onChange={onChange}
        inputStyle={{
          width: "100%",
          height: 50,
          border: error ? "1px solid red" : "",
        }}
        name={name}
        helperText={helperText}
        placeholder={"Phone"}
        searchPlaceholder={searchPlaceholder}
        error={error}
      />
      {error && <span style={{ color: "red" }}>{helperText}</span>}
    </>
  );
};

export default CustomPhoneInput;
