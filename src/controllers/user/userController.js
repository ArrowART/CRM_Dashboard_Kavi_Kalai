import mongoose from "mongoose";
import User from "../../models/UserModel.js";
import { generateUniqueUserName } from "../../services/uniqueidService.js";



export const getallUsers = async (req, res, next) => {
    try {
      const { first, rows, globalfilter, ...othersdata } = req.query
      const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }))
      const fieldArray = Object.keys(User.schema.obj)
      const globalFilter = globalfilter ? { $or: fieldArray.filter((field1) => User.schema.path(field1) instanceof mongoose.Schema.Types.String).map(field => ({ [field]:{ $regex: globalfilter, $options: 'i' } })) } : {}
      const filter = { $and: [globalFilter, ...individualFilters] }
      const resdata = await User.find(filter).skip(first).limit(rows)
      const totallength = await User.countDocuments(filter)
      res.send({ resdata, totallength })
    } catch (err) {
      console.error(err)
    }
  }
  
  export const getuniquevaluebyfield = async (req, res, next) => {
    try {
      const { field } = req.query
      const resdata = await User.distinct(field)
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
  }
  
  export const searchCategory = async (req, res, next) => {
    try {
      const { Category } = req.body
      const response = await User.find({ Category: { $in: [new RegExp(Category, 'i')] } }, { _id: 0, __v: 0, createdAt: 0, updatedAt: 0, Images: 0, Status: 0, Category: { $elemMatch: { $in: [new RegExp(Category, 'i')] } } })
      res.status(200).send(response)
    } catch (err) {
      console.log(err)
      res.status(500).send('Internal Server Error')
    }
  }
  
//   export const saveUser = async (req, res, next) => {
//     try {
//       const resdata = await new User(req.body).save()
//       res.send(resdata)
//     } catch (err) {
//       console.error(err)
//     }
//   }


export const saveUser = async (req, res, next) => {
  try {
      const userData = req.body;
      let userRole = userData.Role;
      const lastUsers = await User.find().sort({createdAt: -1}).limit(1); 
      const UserName = await generateUniqueUserName(userRole, lastUsers); 
      userData.UserName = UserName;
      const newUser = new User(userData);
      const savedUser = await newUser.save(); 
      res.send(savedUser); 
  } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal server error' });
  }
};
  // export const updateUser = async (req, res, next) => {
  //   try {
  //     const { _id } = req.query
  //     const resdata = await User.findOneAndUpdate({ _id }, req.body, { new: true })
  //     res.send(resdata)
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }

  export const updateUser = async (req, res, next) => {
    try {
      const { _id } = req.query;
      const { Role } = req.body;
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).send({ error: 'User not found' });
      }
  
      let newUserName;
      let userNameChanged = false;
  
      if (Role !== user.Role) {
        if (Role === 'TeamLeader') {
          newUserName = user.UserName.replace(/^TC/, 'TL');
        } else if (Role === 'Telecaller') {
          newUserName = user.UserName.replace(/^TL/, 'TC');
        }
  
        // Check if the new username already exists
        const existingUser = await User.findOne({ UserName: newUserName });
        if (existingUser) {
          // Generate a new unique username
          const lastUsers = await User.find().sort({ createdAt: -1 }).limit(1);
          newUserName = await generateUniqueUserName(Role, lastUsers);
        }
  
        req.body.UserName = newUserName;
        userNameChanged = true;
      }
  
      const updatedUser = await User.findByIdAndUpdate(_id, req.body, { new: true });
      res.send(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'Internal server error' });
    }
  };
  
  
  
  export const deleteUser = async (req, res, next) => {
    try {
      const { _id } = req.query
      const resdata = await User.deleteOne({ _id })
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
  }
  