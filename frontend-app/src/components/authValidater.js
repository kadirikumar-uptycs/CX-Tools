import axios from "axios";
import config from "../config";

axios.defaults.withCredentials = true;

export default async function authValidater(){
    
    let url = `${config.SERVER_BASE_ADDRESS}/isAuthenticated`;
    try{
        let respose = await axios.get(url, { withCredentials: true });
        if(respose?.data?.Authorized){
            return null;
        }
        else{
            window.location.href = '/login';
        }
    }catch(err){
        console.log(err);
        // window.location.href = '/login';
    }

}