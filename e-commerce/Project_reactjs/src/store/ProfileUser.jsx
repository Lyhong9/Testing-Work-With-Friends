export const setProfileUser = (data) => {
    localStorage.setItem("profile_user", JSON.stringify(data));
};


export const getProfileUser = () => {
    const data = localStorage.getItem("profile_user");
    return data ?  JSON.parse(data) : null;
};

export const removeProfileUser = () => {
    localStorage.removeItem("profile_user");
};

export const setProfileCustomer = (data) =>{
    localStorage.setItem("profile_customer",JSON.stringify(data))
};

export const getProfileCustomer = () => {
    const data = localStorage.getItem("profile_customer");
    return data ? JSON.parse(data): null;
};

export const removeProfileCustomer = () => {
    localStorage.removeItem("profile_customer");
};
