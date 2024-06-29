import axios from "axios";

function headerConfig(contentType, auth, formData) {
  const header = {};

  if (contentType && typeof contentType === "string") {
    header["Content-Type"] = contentType;
  } else {
    header["Content-Type"] = "application/json";
  }

  if (formData === true) {
    header["Content-Type"] = "multipart/form-data";
  }

  if (auth === true) {
    const token = localStorage.getItem("accessToken");
    header.Authorization = `Bearer ${token}`;
  }

  return header;
}

// const baseURL= "https://api.vetinstant.com/api/v1", //live
// const baseURL=
//       "http://ec2-43-205-203-142.ap-south-1.compute.amazonaws.com:4000/api/v1/"
// const baseURL = "http://137.184.130.244:4500/api/v1";

const baseURL = "http://137.184.130.244:1993/api/v2";

//local
// const baseURL = "http://localhost:1993/api/v2";

export default ({ contentType, auth, formData }) =>
  axios.create({
    baseURL,
    headers: headerConfig(contentType, auth, formData),
  });
