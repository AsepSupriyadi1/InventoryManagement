import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL CATEGORY
export const getAllPurchasesAPI = async (token) => {
  return await axios.get(`${BASE_URL}/purchase`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addNewBillsAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/purchase`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const confirmPurchasesAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/purchase/save-bills`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getPurchasesDetailsAPI = async (token, purchaseId) => {
  return await axios.get(`${BASE_URL}/purchase/detail/` + purchaseId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getAllDetailsItem = async (token, purchaseId) => {
  return await axios.get(`${BASE_URL}/purchase/items/` + purchaseId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const approveBillsAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/purchase/approve`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const receiveGoodsAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/purchase/arrived`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const makePaymentAPI = async (token, purchaseId) => {
  return await axios.get(`${BASE_URL}/purchase/pay/` + purchaseId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
