import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL SUPPLIER FROM API
export const getAllSupplierAPI = async (token) => {
  return await axios.get(`${BASE_URL}/supplier`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ADD NEW SUPPLIER
export const addNewSupplierAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/supplier`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET DETAILS SUPPLIER FROM API
export const getDetailSupplierAPI = async (token, supplierId) => {
  return await axios.get(`${BASE_URL}/supplier/detail/` + supplierId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ADD NEW SUPPLIER
export const updateSupplier = async (token, data, supplierId) => {
  return await axios.put(`${BASE_URL}/supplier/update/` + supplierId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ADD NEW SUPPLIER
export const deleteSupplierAPI = async (token, supplierId) => {
  return await axios.delete(`${BASE_URL}/supplier/delete/` + supplierId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
