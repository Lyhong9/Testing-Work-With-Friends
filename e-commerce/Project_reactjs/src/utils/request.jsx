import axios from "axios";
import { BaseURL } from "./BaseURL";

const request = async (path = "", method = "", data = {}) => {
  try {
    const res = await axios({
      method,
      url: BaseURL + path,
      data,
      headers:
        data instanceof FormData
          ? {
              Accept: "application/json",
              "Content-Type": "multipart/form-data",
            }
          : {
              "Content-Type": "application/json",
            },
      Authorization: "Bearer " + localStorage.getItem("access_token"),
      
    });

    const resData = res.data;

    // ✅ ONLY throw when failed
    if (resData.success === false) {
      throw resData.message || "Request failed";
    }

    return resData; // IMPORTANT
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};

export default request;