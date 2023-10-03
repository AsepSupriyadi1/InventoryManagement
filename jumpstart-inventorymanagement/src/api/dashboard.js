import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

export const getDashboardInfoAPI = async (token) => {
  return await axios.get(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllPendingTransactionAPI = async (token) => {
  return await axios.get(`${BASE_URL}/dashboard/all-pending-transaction`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getExpensesAndRevenueAPI = async (token) => {
  return await axios.get(`${BASE_URL}/dashboard/dollars`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
