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
