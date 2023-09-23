import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET USER FROM TOKEN
export const getAllUsersAPI = async (token) => {
  return await axios.get(`${BASE_URL}/user/all-staffs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET USER FROM TOKEN
export const getAllAvailableStaffsAPI = async (token) => {
  return await axios.get(`${BASE_URL}/user/all-available-staffs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET USER FROM TOKEN
export const getStaffDetailsAPI = async (token, staffId) => {
  return await axios.get(`${BASE_URL}/user/detail/` + staffId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET USER FROM TOKEN
export const updateUserAdminAPI = async (token, data, staffId) => {
  return await axios.put(`${BASE_URL}/user/update/` + staffId, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// GET USER FROM TOKEN
export const deleteStaffAdminAPI = async (token, staffId) => {
  return await axios.delete(`${BASE_URL}/user/delete/` + staffId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
