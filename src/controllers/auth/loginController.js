import { Createtoken } from '../../services/tokenService.js';
import { SuperAdmin } from '../../models/SuperAdminModel.js';
import User from '../../models/UserModel.js';

export const Login = async (req, res, next) => {
  try {
    const { UserName, Password } = req.body;
    console.log('Received login request for UserName:', UserName);
    
    const superAdmin = await SuperAdmin.findOne({ UserName, Status: 'Active', Password });
    if (superAdmin) {
      console.log('SuperAdmin login successful');
      const token = Createtoken({
        _id: superAdmin._id,
        UserName: superAdmin.UserName,
        Role: superAdmin.Role,
        First_Name: superAdmin.First_Name,
        Last_Name: superAdmin.Last_Name
      });
      console.log('Generated token for SuperAdmin:', token);
      return res.send({ status: 'Success', token, Role: superAdmin.Role });
    }
    
    const user = await User.findOne({ UserName, User_Status: 'Active', Password });
    if (user) {
      console.log(`${user.Role} login successful`);
      const token = Createtoken({
        _id: user._id,
        UserName: user.UserName,
        Role: user.Role,
        First_Name: user.First_Name,
        Last_Name: user.Last_Name
      });
      console.log('Generated token for User:', token);
      return res.send({ status: 'Success', token, Role: user.Role });
    }
    
    console.log('Invalid username or password');
    return res.send({ status: 'Invalid username or password' });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ status: 'Error', message: 'Internal Server Error' });
  }
};