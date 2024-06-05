import axios from "axios";
import apiurl from "../apiendpoint/apiendpoint";
import {gettoken} from "../token/token";

export const getallallocation = async(params)=>{
   var res=await axios.get(`${apiurl()}/allocation/apigetallallocation`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getallunallocation = async(params)=>{
   var res=await axios.get(`${apiurl()}/unallocation/apigetallallocation`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

//  export const getallselectedteamleaderandtelecaller = async(params)=>{
//    var res=await axios.get(`${apiurl()}/unallocation/apigetselectedteamleaderandtelecallerdata`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
//    return res.data;
// }
export const getallselectedteamleaderandtelecaller = async (params) => {
   const res = await axios.get(`${apiurl()}/unallocation/apigetselectedteamleaderandtelecallerdata`, { params: params, headers: { "Authorization": `Bearer ${gettoken()}` } });
   return res.data;
 };
 

 export const savebulkallocation=async(datas)=>{
    try {
       var res=await axios.post(`${apiurl()}/unallocation/apisavebulkallocation`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
       return res.data;
    }
    catch(err){
       console.log(err);
    }
 }

 export const getallfollowup = async(params)=>{
   var res=await axios.get(`${apiurl()}/unallocation/apigetfollowupandfuturefollowupdata`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

export const getallallProductivity = async(params)=>{
   var res=await axios.get(`${apiurl()}/unallocation/apigetallproductivitydata`,{params:params, headers: {"Authorization" : `Bearer ${gettoken()}`}});
   return res.data;
}

 export const allocateteamleader=async(datas)=>{
   try {
      var res=await axios.post(`${apiurl()}/unallocation/apiallocateteamleader`,datas,{ headers: {"Authorization" : `Bearer ${gettoken()}`}});
      return res.data;
   }
   catch(err){
      console.log(err);
   }
}

 export const deleteAllAllocation = async () => {
   try {
       const res = await axios.delete(`${apiurl()}/unallocation/apideleteallocation`, {
           headers: { "Authorization": `Bearer ${gettoken()}` }
       });
       return res.data;
   } catch (error) {
       console.error("Error deleting all unallocation:", error);
       throw error; // Optionally, handle the error based on your requirements
   }
};

