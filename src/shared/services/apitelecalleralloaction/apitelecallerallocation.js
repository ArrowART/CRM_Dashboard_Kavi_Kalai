import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import { gettoken } from "../token/token";


export const getalltelecallerallocation = async(params)=>{
   var res=await axios.get(`${apiurl()}/telecallerallocation/apigetalltelecallerallocation`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const savetelecallerallocation = async(datas)=>{
    try {
       var data = datas.Category?{...datas, Category:datas.Category.split(',')}:datas
       var res=await axios.post(`${apiurl()}/telecallerallocation/apisavetelecallerallocation`,data,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
       return res.data;
    }
    catch(err){
       console.log(err);
    }
 }