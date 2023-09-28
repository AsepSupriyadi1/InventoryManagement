import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL OUTLETS
export const getAllProductAPI = async (token) => {
  return await axios.get(`${BASE_URL}/product`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW PRODUCT
export const addNewProduct = async (token, data) => {
  return await axios.post(`${BASE_URL}/product`, data, {
    "Content-Type": "application/json",
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Detail Product
export const detailProductAPI = async (token, productId) => {
  return await axios.get(`${BASE_URL}/product/detail/` + productId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Update Product
export const updateProduct = async (token, data, productId) => {
  return await axios.put(`${BASE_URL}/product/update/` + productId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Detail Product
export const deleteProductAPI = async (token, productId) => {
  return await axios.delete(`${BASE_URL}/product/delete/` + productId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Find All Product By Supplier
export const findAllBySupplierIdAPI = async (token, supplierId) => {
  return await axios.get(`${BASE_URL}/product/supplier/` + supplierId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
