import axios from "axios";
import { redirect } from "react-router-dom";



axios.defaults.withCredentials = true;

export default async function authValidater(){
    
    let url = "http://localhost:17291/isAuthenticated";
    try{
        let respose = await axios.post(url);
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