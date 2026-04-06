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