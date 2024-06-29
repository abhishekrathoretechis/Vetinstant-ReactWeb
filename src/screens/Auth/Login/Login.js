import { Grid, Typography } from "@mui/material";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// import {
//   loadCaptchaEnginge,
//   LoadCanvasTemplate,
//   validateCaptcha,
// } from "react-simple-captcha";
import LoginLogo from "../../../assets/images/png/login.png";
import VetLogo from "../../../assets/images/png/logo.png";
import keyIcon from "../../../assets/images/png/key.png";

import CustomButton from "../../../components/CustomButton";
import CustomTextField from "../../../components/CustomTextField";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import { ErrorStrings } from "../../../util/ErrorString";
import { EmailRegex } from "../../../util/Validations";
import api from "../../../redux/actions/api";
import "./Login.css";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

const initialValues = {
  email: "",
  password: "",
  captcha: "",
};

const initialError = {
  email: false,
  password: false,
  captcha: false,
};

const initialHelp = {
  email: "",
  password: "",
  captcha: "",
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginValues, setLoginValues] = useState(initialValues);
  const [showPassword, setShowPassword] = useState(false);
  const [loginErrors, setLoginErrors] = useState(initialError);
  const [loginHelps, setLoginHelps] = useState(initialHelp);

  // useEffect(() => {
  //   loadCaptchaEnginge(6);
  // }, []);

  const handleChange = (e) => {
    if (e.target.name === "email") {
      emailValidation(e.target.value);
    }
    if (e.target.name === "password") {
      passValidation(e.target.value);
    }
    setLoginValues({
      ...loginValues,
      [e.target.name]: e.target.value,
    });
  };

  const emailValidation = (value) => {
    if (value === "") {
      setLoginErrors({
        ...loginErrors,
        email: true,
      });
      setLoginHelps({ ...loginHelps, email: ErrorStrings.emptyEmail });
      return;
    }
    if (!EmailRegex.test(value)) {
      setLoginErrors({
        ...loginErrors,
        email: true,
      });
      setLoginHelps({ ...loginHelps, email: ErrorStrings.inValidEmail });
      return;
    }
    setLoginErrors({
      ...loginErrors,
      email: false,
    });
    setLoginHelps({ ...loginHelps, email: "" });
  };

  const passValidation = (value) => {
    if (value === "") {
      setLoginErrors({
        ...loginErrors,
        password: true,
      });
      setLoginHelps({ ...loginHelps, password: ErrorStrings.emptyPass });
      return;
    }
    if (value.length < 6) {
      setLoginErrors({
        ...loginErrors,
        password: true,
      });
      setLoginHelps({ ...loginHelps, password: ErrorStrings.inValidPass });
      return;
    }
    setLoginErrors({
      ...loginErrors,
      password: false,
    });
    setLoginHelps({ ...loginHelps, password: "" });
  };

  const getValidation = () => {
    const emailValue = loginValues.email.trim();
    const passValue = loginValues.password.trim();

    if (emailValue === "" && passValue === "") {
      setLoginErrors({ ...loginErrors, email: true, password: true });
      setLoginHelps({
        ...loginHelps,
        email: ErrorStrings.emptyEmail,
        password: ErrorStrings.emptyPass,
      });
    }
    if (emailValue !== "" && passValue === "") {
      setLoginErrors({
        ...loginErrors,
        email: !EmailRegex.test(emailValue) ? true : false,
        password: true,
      });
      setLoginHelps({
        ...loginHelps,
        email: !EmailRegex.test(emailValue) ? ErrorStrings.inValidEmail : "",
        password: ErrorStrings.emptyPass,
      });
    }

    if (emailValue === "" && passValue !== "") {
      setLoginErrors({
        ...loginErrors,
        email: true,
        password: passValue.length < 6 ? true : false,
      });
      setLoginHelps({
        ...loginHelps,
        email: ErrorStrings.emptyEmail,
        password: passValue.length < 6 ? ErrorStrings.inValidPass : "",
      });
    }

    if (emailValue !== "" && passValue !== "") {
      setLoginErrors({
        ...loginErrors,
        email: !EmailRegex.test(emailValue) ? true : false,
        password: passValue.length < 6 ? true : false,
      });
      setLoginHelps({
        ...loginHelps,
        email: !EmailRegex.test(emailValue) ? ErrorStrings.inValidEmail : "",
        password: passValue.length < 6 ? ErrorStrings.inValidPass : "",
      });
    }
  };

  const handleLogin = async (e) => {
    if (e.keyCode === 13) {
      dispatch(showLoader());
      getValidation();
      const user = {
        // username: loginValues.email,
        username: loginValues.email,
        password: loginValues.password,
        // role: "admin",
      };
      let user_captcha = loginValues.captcha;

      // alert('Captcha Matched');
      // loadCaptchaEnginge(6);
      setLoginValues({ captcha: "" });
      try {
        const res = await api({ contentType: true }).post("/user/login", user);
        if (res.status === 200) {
          const token = res.data.accessToken;
          localStorage.setItem("accessToken", token);
          const decoded = jwt_decode(token);
          const role = decoded?.role[0].authority;
          console.log("role", role);
          const hospitalId = decoded?.hospital;
          localStorage.setItem("role", role);
          localStorage.setItem("userId", decoded?.id);
          localStorage.setItem("name", decoded?.name);
          if (hospitalId) localStorage.setItem("hospitalId", hospitalId);
          if (role === "ROLE_ADMIN") {
            navigate("/home");
          }
          if (role === "ROLE_DOCTOR") {
            navigate("/vet-dashboard");
          } else {
            navigate("/dashboard");
          }

          dispatch(hideLoader());
        } else {
          dispatch(hideLoader());
        }
      } catch (err) {
        dispatch(hideLoader());
      }
    }
  };

  const handleCreateAccount = () => {
    navigate("/sign-up");
  };

  const handleForgetPassword = () => {
    navigate("/forgot-password");
  };

  const handleClickShowPassword = (value) => {
    setShowPassword(!value);
  };

  return (
    <div className="Login-main-container" onKeyDown={handleLogin}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <div className="Login-right-con">
            <div className="Login-left-top">
              <img src={VetLogo} alt="" className="Login-vet-logo" />
            </div>

            <div className="mh15Per">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Typography className="txt-bold fs30 mv20 flex-start black3">
                    Welcome Back
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <CustomTextField
                    label="User Name"
                    placeholder="User Name"
                    name="email"
                    fullWidth
                    handleChange={handleChange}
                    value={loginValues?.email}
                    helperText={loginHelps?.email}
                    error={loginErrors?.email}
                    startIcon
                    inputIcon={<MailOutlineIcon />}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <CustomTextField
                    label="Password"
                    placeholder="Password"
                    name="password"
                    // password
                    fullWidth
                    value={loginValues?.password}
                    handleChange={handleChange}
                    showPassword={showPassword}
                    handleClickShowPassword={handleClickShowPassword}
                    helperText={loginHelps?.password}
                    error={loginErrors?.password}
                    startIcon
                    inputIcon={<img src={keyIcon} className="key" />}
                  />
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="Login-center">
                    <div className="Login-btn">
                      <CustomButton
                        text="Login"
                        onClick={() => handleLogin({ keyCode: 13 })}
                      />
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="Login-center">
                    <Typography
                      onClick={handleForgetPassword}
                      className="txt-regular fs14 red4"
                    >
                      Forgot Password?
                    </Typography>
                  </div>
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <div className="Login-left-con" id="loginLeftCon">
            <div className="flex1-center">
              <img src={LoginLogo} alt="" className="Login-main-img" />
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
