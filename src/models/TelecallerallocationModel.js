import mongoose from "mongoose";
import { conn } from "../config/db/db.js";

const TelecallerallocationModel = new mongoose.Schema({
   teamleader : Array,
   telecaller:Array
})
const TelecallerAllocation = conn.model('telecallerallocations',TelecallerallocationModel);
export default TelecallerAllocation