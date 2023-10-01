import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL CUSTOMER
export const getAllCustomersAPI = async (token) => {
  return await axios.get(`${BASE_URL}/customer`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW customer
export const addNewCustomerAPI = async (data, token) => {
  return await axios.post(`${BASE_URL}/customer`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  DETAILS customer
export const detailCustomerAPI = async (token, customerId) => {
  return await axios.get(`${BASE_URL}/customer/detail/` + customerId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  update customer
export const updateCustomersAPI = async (token, data, customerId) => {
  return await axios.put(`${BASE_URL}/customer/update/` + customerId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  delete customer
export const deleteCustomerAPI = async (token, customerId) => {
  return await axios.delete(`${BASE_URL}/customer/delete/` + customerId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
