import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

export const getAllTransactionAPI = async (token) => {
  return await axios.get(`${BASE_URL}/transaction`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addNewTransactionAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/transaction`, data, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const saveTransactionAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/transaction/save-bills`, data, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTransactionDetailsAPI = async (token, transactionId) => {
  return await axios.get(`${BASE_URL}/transaction/detail/` + transactionId, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getTransactionItemsAPI = async (token, transactionId) => {
  return await axios.get(`${BASE_URL}/transaction/items/` + transactionId, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const processTransactionAPI = async (token, transactionId) => {
  return await axios.get(`${BASE_URL}/transaction/process/` + transactionId, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deliveryTransactionAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/transaction/deliver`, data, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const transactionInfoAPI = async (data) => {
  return await axios.post(`${BASE_URL}/transaction/payment-details`, data, {
    "Content-Type": "application/json",
  });
};

export const customerMakePaymentAPI = async (transactionId, token) => {
  return await axios.get(`${BASE_URL}/transaction/pay/` + transactionId + `?token=` + token, {
    "Content-Type": "application/json",
  });
};
