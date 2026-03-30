import { useState, useEffect, useNavigate, uselocation, use } from "react"
import { request } from "../../utils/request";
import {alertError, alertSuccess, confirmDelete} from "../swertalert/AlertSuccess"; 
import {GetLocalStorage,RemoveLocalStorage,SetLocalUser} from "../store/LocalStorage"
const UseLogin = () => {
    const [dataUser, setDataUser] = useState({});
    const navigate = useNavigate();
    const location = uselocation();


    const handleLogin = async (e) =>{
        e.preventDefault();
        try{
          const userData = {
            email: dataUser.email,
            password: dataUser.password
          }
          const res = await request("/api/user", "port", userData);
          if(res){
            alertSuccess({title: "login success", text: "login successfully!"})
            SetLocalUser(res.access_token)
            navigate('/');
          }
        }catch(error){
          alertError({text: error?.message || 'login user failed'})
        }
    }
  return {
    handleLogin,
    dataUser,
    setDataUser
  }
}

export default UseLogin