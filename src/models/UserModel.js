import mongoose from "mongoose";
import { conn } from "../config/db/db.js";

const Userschema = new mongoose.Schema({
  UserName:String,
    First_Name: String,
    Last_Name: String,
    Email: String,
    Password: String,
    Mobilenumber: String,
    Role: String,
    User_Status: { type: String, default: 'Active' }
  }, 
  { timestamps: true })
  const User = conn.model("users",Userschema)
  export default User