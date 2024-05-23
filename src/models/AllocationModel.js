import mongoose from "mongoose";
import { conn } from "../config/db/db.js";
const Allocationschema = new mongoose.Schema({
    Region:String,
    Location: String,
    Product: String,
    Name: String,
    Firm_Name: String,
    Mobile1: String,
    Mobile2: String,
    Campaign_Name: String,
    Disposition: String,
    Sub_Disposition: String,
    Remarks: String,
    selectedTeamLeader:String,
    selectedTelecaller:String,
    Productivity_Status:String,
    Date_Time:String,
    Status: { type: String, default: 'Un Allocate' }
  }, 
  { timestamps: true })
  const Allocation = conn.model("allocations",Allocationschema)
  export default Allocation