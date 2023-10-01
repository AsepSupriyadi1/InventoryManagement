import React, { createContext, useEffect, useState } from "react";
import { context_user, user_type } from "./context-type";
import { LogoutApi, getUserLoginAPI } from "../api/auth";

export const AuthContext = React.createContext(context_user);

export function retriveStoredToken() {
  const storedToken = localStorage.getItem("token");

  return {
    token: storedToken,
  };
}

export function AuthContextProvider(props) {
  const storedToken = retriveStoredToken();
  let initialToken;

  if (storedToken) {
    initialToken = storedToken.token;
  }

  const [token, setToken] = useState(initialToken);
  const [user, setUser] = useState(user_type);
  const [isLoading, setIsLoading] = useState(true); // Tambahkan isLoading

  const userIsLoggedIn = !!token;

  // GET USER LOGIN DATA
  useEffect(() => {
    if (token === null) {
      setUser(user_type);
      setIsLoading(false); // Set isLoading menjadi false ketika selesai
    } else {
      getUserLoginAPI(token)
        .then((res) => {
          let data = res.data;
          setUser({
            userId: data.userId,
            fullName: data.fullName,
            email: data.email,
            address: data.address,
            userRole: data.role,
            phoneNumber: data.phoneNumber,
            outletId: data.outletId,
          });
          console.log(res.data);
          setIsLoading(false); // Set isLoading menjadi false ketika selesai
        })
        .catch((err) => {
          console.log("Token error");
          localStorage.removeItem("token");
          window.location.href = "/login";
          setIsLoading(false); // Set isLoading menjadi false ketika selesai
        });
    }

    return () => {};
  }, [token]);

  function logoutHandler() {
    localStorage.removeItem("token");
    setToken(null);
  }

  function loginHandler(token) {
    localStorage.setItem("token", token);
    setToken(token);
  }

  let contextValue = {
    currentUser: user,
    token: token,
    isLoggedIn: userIsLoggedIn,
    isLoading: isLoading, // Tambahkan isLoading ke dalam konteks
    login: loginHandler,
    logout: logoutHandler,
  };

  return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
}
