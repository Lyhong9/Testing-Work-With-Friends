import axios from "axios";
import { BaseURL } from "./BaseURL";
import { GetLocalStorage, RemoveLocalStorage } from "../store/LocalStorage";

const request = async (path = "", method = "GET", data = {}) => {
  const token = GetLocalStorage();

  try {
    const res = await axios({
      method,
      url: BaseURL + path,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? "Bearer " + token : "",
      },
    });

    const statusCode = res.status;

    if (statusCode === 401) {
      // 🔴 Unauthorized case
      RemoveLocalStorage();
      window.location.href = "/login"; // redirect user
      throw new Error("Unauthorized. Please login again.");
    }

    if (statusCode < 200 || statusCode >= 300) {
      throw new Error(`Request failed with status code ${statusCode}`);
    }

    if (res.data.status === "error") {
      throw new Error(res.data.message);
    }

    if (res.data.status === "fail") {
      throw new Error(res.data.message);
    }

    if (res.data.status === "success") {
      console.log(res.data.message);
    }

    return res.data;

  } catch (error) {
    console.log(error);

    // 🔴 handle axios error response (important for 401 from server)
    if (error?.response?.status === 401) {
      RemoveLocalStorage();
      window.location.href = "/login";
      throw new Error("Unauthorized. Please login again.");
    }

    throw error;
  }
};

export default request;