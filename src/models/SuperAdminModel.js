import mongoose from 'mongoose'
import { conn } from '../config/db/db.js'

const SuperAdminschema = mongoose.Schema({
  Name: String,
  Email: String,
  Password: String,
  Role: { type: String, default: 'SuperAdmin' }, // define default register role based on application
  OTP: String,
  Status: { type: String, default: 'Inactive' }
})
const SuperAdmin = conn.model('superadmins', SuperAdminschema)
export { SuperAdmin }
