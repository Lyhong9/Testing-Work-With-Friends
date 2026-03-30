export const SetLocalUser = async (data) =>{
    return localStorage.setItem("token_key", data);
}

export const GetLocalStorage = async () => {
    return localStorage.getItem("token_key")
}

export const RemoveLocalStorage = async () =>{
    return localStorage.removeItem("token_key");
}