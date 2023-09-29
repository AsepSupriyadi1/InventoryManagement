import axios from "axios";
import { BASE_URL } from "./constant";

// GET ALL CATEGORY
export const getAllStocksLevelAPI = async (token) => {
  return await axios.get(`${BASE_URL}/stock/all-stock-level`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW CATEGORY
export const addOrUpdateStocksLevelAPI = async (token, data) => {
  return await axios.post(`${BASE_URL}/stock`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
