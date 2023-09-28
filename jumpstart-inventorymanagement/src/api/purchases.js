import axios from "axios";
import { BASE_URL } from "./constant";
import { errorAlert, successConfAlert } from "../alert/sweetAlert";

// GET ALL CATEGORY
export const getAllPurchasesAPI = async (token) => {
  return await axios.get(`${BASE_URL}/purchase`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

//  ADD NEW CATEGORY
export const getPurchasesDetailsAPI = async (token, purchaseId) => {
  return await axios.post(`${BASE_URL}/purchase/detail/`, purchaseId, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
