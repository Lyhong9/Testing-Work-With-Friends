// export const SetLocalUser = (data) => {
//   localStorage.setItem("token_key", JSON.stringify(data));
// };

// export const GetLocalStorage = () => {
//   const data = localStorage.getItem("token_key");
//   return data ? JSON.parse(data) : null;
// };

// export const RemoveLocalStorage = () => {
//   localStorage.removeItem("token_key");
// };
export const SetLocalUser = (data) => {
  localStorage.setItem("token_key", data);
};

export const GetLocalStorage = () => {
  return localStorage.getItem("token_key");
};

export const RemoveLocalStorage = () => {
  return localStorage.removeItem("token_key");
};

