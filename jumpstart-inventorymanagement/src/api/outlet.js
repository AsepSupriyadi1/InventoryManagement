import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL OUTLETS
export const getAllOutlets = async (token) => {
  return await axios.get(`${BASE_URL}/outlet`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW OUTLET
export const addNewOutletAPI = async (data, token) => {
  return await axios.post(`${BASE_URL}/outlet`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET DETAILS OUTLET FROM API
export const getDetailOutletAPI = async (token, outletId) => {
  return await axios.get(`${BASE_URL}/outlet/detail/` + outletId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// UPDATE OUTLET DATA
export const updateOutletAPI = async (token, data, outletId) => {
  return await axios.put(`${BASE_URL}/outlet/update/` + outletId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
