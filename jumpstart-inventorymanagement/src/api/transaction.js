import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

export const getAllTransactionAPI = async (token) => {
  return await axios.get(`${BASE_URL}/transaction`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW TRANSACTION
export const addNewTransactionAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/transaction`, data, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};
