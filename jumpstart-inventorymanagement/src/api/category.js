import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL CATEGORY
export const getAllCategory = async (token) => {
  return await axios.get(`${BASE_URL}/product/all-category`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW CATEGORY
export const addNewCategory = async (token, data) => {
  return await axios.post(`${BASE_URL}/product/category`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Detail CATEGORY
export const detailCategoryAPI = async (token, categoryId) => {
  return await axios.get(`${BASE_URL}/product/category/detail/` + categoryId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Update CATEGORY
export const updateCategoryAPI = async (token, data, categoryId) => {
  return await axios.put(`${BASE_URL}/product/category/update/` + categoryId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  Delete CATEGORY
export const deleteCategoryAPI = async (token, categoryId) => {
  return await axios.delete(`${BASE_URL}/product/category/delete/` + categoryId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
