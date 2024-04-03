import axios from "axios";
import { redirect } from "react-router-dom";
import config from "../config";

axios.defaults.withCredentials = true;

export default async function authValidater(){
    
    let url = `${config.SERVER_BASE_ADDRESS}/isAuthenticated`;
    try{
        let respose = await axios.post(url, {}, { withCredentials: true });
        if(respose?.data?.Authorized){
            return null;
        }
        else{
            throw redirect('/login');
        }
    }catch(err){
        throw redirect('/login');
    }

}