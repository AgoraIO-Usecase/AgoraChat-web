import "./login.scss";
import React, { ChangeEvent, useEffect, useState } from "react";
import i18next from "../../i18n";
import loading from "../../assets/loading.png";
import closeIcon from "../../assets/Xmark@2x.png";
import toast from "../../components/toast/toast";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../service/login";
import { loginWithToken, setSDKConfig } from "../../store/loginSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { DEMO_VERSION, SDK_VERSION, UIKIT_VERSION, appId } from "../../config";
import notice from "../../assets/candle_in_circle_fill.png";

import eyeOpen from "../../assets/eye@2x.png";
import eyeClose from "../../assets/eye_slash@2x.png";

const Login = () => {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.login);
  const appConfigState = useAppSelector((state) => state.appConfig);
  useEffect(() => {
    dispatch(
      setSDKConfig({
        appId: appId,
        useDNS: true,
      }),
    );
  }, []);
  useEffect(() => {
    if (state.loggedIn) {
      navigate("/main");
    }
  }, [state.loggedIn]);

  const [values, setValues] = useState({
    userId: "",
    password: "",
    showPassword: false,
  });
  const [isLogging, setIsLogging] = useState(false);
  const handleChange =
    (type: "userId" | "password") => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      if (type === "userId") {
        if (/^[a-zA-Z0-9_.-]*$/.test(value) || value === "") {
          setValues({
            ...values,
            userId: value,
          });
        }
      } else if (type === "password") {
        setValues({
          ...values,
          password: event.target.value,
        });
      }
    };

  const clearPhoneNumber = () => {
    setValues({
      ...values,
      userId: "",
    });
  };

  const login = () => {
    setIsLogging(true);
    if (!values.userId || !values.password) {
      toast.error(i18next.t("Please enter the correct username and password"));
      setIsLogging(false);
      return;
    }
    getToken(values.userId.toLowerCase(), values.password)
      .then((res) => {
        const { chatUserName, accessToken, agoraUid } = res.data;
        dispatch(
          loginWithToken({
            userId: chatUserName.toLowerCase(),
            chatToken: accessToken,
            agoraUid: agoraUid,
          })
        );
      })
      .catch(function (error) {
        console.log("get token failed", error);
        switch (error.response?.data?.errorInfo) {
          case "UserId password error.":
            toast.error(i18next.t("Incorrect username or password"));
            break;
          case `UserId ${values.userId} does not exist.`:
            toast.error(i18next.t("user does not exist"));
            break;
          case "phone number illegal":
            toast.error(i18next.t("Please enter the correct phone number"));
            break;
          case "SMS verification code error.":
            toast.error(i18next.t("Verification code error"));
            break;
          case "Sms code cannot be empty":
            toast.error(i18next.t("The verification code cannot be empty"));
            break;
          case "Please send SMS to get mobile phone verification code.":
            toast.error(
              i18next.t("Please use SMS verification code to log in")
            );
            break;
          default:
            toast.error(i18next.t("Login failed, please try again"));
            break;
        }
        setIsLogging(false);
      });
  };
  const navigate = useNavigate();

  const goRegister = () => {
    navigate("/register", { replace: true });
  };
  const [activeType, setActiveType] = useState("password");
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
    if (activeType === "password") {
      setActiveType("text");
    } else {
      setActiveType("password");
    }
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLImageElement>
  ) => {
    event.preventDefault();
  };

  return (
    <div className="login-container">
      <div
        className={`login-form ${
          appConfigState.theme == "classic" ? "" : "ground"
        }`}
      >
        <div className="login-form-icon"></div>
        <div className="login-form-AC">{i18next.t("Agora")} Chat</div>
        <div className="input-box">
          <input
            disabled={isLogging}
            className="login-form-input"
            placeholder={i18next.t("Username")}
            onChange={handleChange("userId")}
            value={values.userId}
          ></input>
          {values.userId && (
            <img
              src={closeIcon}
              alt="close"
              onClick={clearPhoneNumber}
              className="close-btn"
            />
          )}
        </div>
        <div className="input-box">
          <input
            disabled={isLogging}
            type={activeType}
            className="login-form-input"
            placeholder={i18next.t("Password")}
            value={values.password}
            onChange={handleChange("password")}
          ></input>
          {values.showPassword ? (
            <img
              src={eyeClose}
              alt="close"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              className="close-btn"
            />
          ) : (
            <img
              src={eyeOpen}
              alt="close"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              className="close-btn"
            />
          )}
        </div>
        <div className="loading-box">
          <input
            disabled={false}
            type="button"
            className="login-form-input login-button"
            value={isLogging ? "" : i18next.t("login")}
            onClick={login}
          ></input>
          {isLogging && (
            <img className="loading-img" src={loading} alt="loading" />
          )}
        </div>
        <div className="login-form-agreement">
          <img src={notice} alt="notice"></img>
          You will be registered as a new user upon your first login.
        </div>
      </div>
      <div className="login-copyright">
        {`© ${new Date().getFullYear()} Agora.io Inc, SDK Version: ${SDK_VERSION},  UIKit Version: ${UIKIT_VERSION},  Demo Version: ${DEMO_VERSION}`}{" "}
      </div>
    </div>
  );
};

export default Login;
