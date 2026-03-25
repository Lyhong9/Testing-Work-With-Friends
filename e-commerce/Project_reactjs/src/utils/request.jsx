import axios from "axios";
import {BaseURL} from "./BaseURL";

const request = (path = "", method = "", data = {}) => {
  if (data instanceof FormData) {
    return axios({
      method: method,
      url: BaseURL + path,
      data: data,
      headers: {
        "Accept": "application/json", 
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return axios({
      method: method,
      url: BaseURL + path,
      data: data,
      headers: {
        "Accept": "application/json",
      },
    })
      .then((response) => {
        const resData = response.data;

        if (resData.error) {
          throw resData.error;
        }

        if (resData.message) {
          throw resData.message;
        }

        if (resData.errors) {
          throw resData.errors;
        }

        return resData;
      })
      .catch((error) => {
        console.log(error);
        throw error; // better to rethrow so caller can handle
      });
  }
};

export default request;