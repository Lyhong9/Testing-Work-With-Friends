import axios from 'axios';

var baseURL = "http://localhost:3000/";
const request = (path="",method="" , data={}) =>{
    // const header = {
    //     ""
    // }
    return axios({
        method:method,
        url:baseURL+path,
        data :data,
        headers : {
            'Content-Type' : 'application/json'
        }
    })
    .then((response) =>{
        return response.data;
    })
    .catch((error) =>{
        console.log(error);
    })
}

export default request;