import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, errorReturnConfAlert, successConfAlert } from "../alert/sweetAlert";

// REGISTER
export const registerAPI = async (data, token) => {
  return await axios.post(`${BASE_URL}/user`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// REGISTER
export const loginAPI = async (user, userCtx, navigate, setError, setModalShow) => {
  // CALL LOGIN API
  await axios
    .post(`${BASE_URL}/auth`, user)
    .then((response) => {
      // IF SUCCESS, TAKE THE TOKEN
      let token = response.data.token;
      console.log(response.data);
      let redirectUrl;
      userCtx(token);

      // REDIRECT TO SPECIFIC PAGES
      switch (response.data.role) {
        case "SUPER_ADMIN":
          redirectUrl = "/dashboard";
          break;
        case "STORE_ADMIN":
          redirectUrl = "/dashboard";
          break;

        default:
          navigate("/login");
          break;
      }

      // SHOW SUCCESS ALERT
      successConfAlert("Success", "Login Successfull", navigate(redirectUrl));
    })
    .catch((err) => {
      // Return Error Status
      let errorType = err.response.data.errorType;
      let errorMessage = err.response.data.errorMessage;

      errorReturnConfAlert("Login Failed", errorMessage);

      // if (errorType === "NOT_FOUND") {
      //   setError({
      //     status: true,
      //     message: errorMessage,
      //   });
      // }
    });
};

// GET USER FROM TOKEN
export const getUserLoginAPI = async (token) => {
  return await axios.get(`${BASE_URL}/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// LOGOUT
export const LogoutApi = async (token) => {
  return await axios.get(`${BASE_URL}/auth/logout`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
