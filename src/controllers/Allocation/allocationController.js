// import Allocation from "../../models/AllocationModel.js";
// import mongoose from "mongoose";
// import jwt from 'jsonwebtoken';


// export const getallallocation = async (req, res, next) => {
//   try {
//     const { Role, UserName } = jwt.decode(req.headers.authorization.split(' ')[1]);
    
//     let filter = {};

//     if (Role === 'SuperAdmin') {
//       filter = { Status: "Allocate" };
//     } else if (Role === 'TeamLeader') {
//       filter = { selectedTeamLeader: UserName };
//     } else if (Role === 'Telecaller') {
//       filter = { selectedTelecaller: UserName };
//     }
    
//     const { globalfilter } = req.query;
//     let filterQuery = Allocation.find(filter);
    
//     if (globalfilter) {
//       const regex = { $regex: globalfilter, $options: 'i' };
//       const stringFields = Object.keys(Allocation.schema.paths).filter(field => Allocation.schema.paths[field].instance === 'String');
//       if (stringFields.length > 0) {
//         filterQuery = filterQuery.or(stringFields.map(field => ({ [field]: regex })));
//       }
//     }
    
//     const resdata = await filterQuery.exec();
//     const totallength = resdata.length;
    
//     res.send({ resdata, totallength });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ error: 'Internal Server Error' });
//   }
// };


import Allocation from "../../models/AllocationModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

export const getallallocation = async (req, res, next) => {
  try {
    const { Role, UserName } = jwt.decode(req.headers.authorization.split(' ')[1]);
    
    let filter = {};

    if (Role === 'SuperAdmin') {
      filter = { Status: "Allocate" };
    } else if (Role === 'TeamLeader') {
      filter = { selectedTeamLeader: UserName };
    } else if (Role === 'Telecaller') {
      filter = { selectedTelecaller: UserName };
    }
    
    const { globalfilter } = req.query;
    let filterQuery = Allocation.find(filter);
    
    if (globalfilter) {
      const regex = { $regex: globalfilter, $options: 'i' };
      const stringFields = Object.keys(Allocation.schema.paths).filter(field => Allocation.schema.paths[field].instance === 'String');
      if (stringFields.length > 0) {
        filterQuery = filterQuery.or(stringFields.map(field => ({ [field]: regex })));
      }
    }
    
    const resdata = await filterQuery.exec();
    const totallength = resdata.length;

    // Count each product type
    const productCounts = resdata.reduce((counts, item) => {
      counts[item.Product] = (counts[item.Product] || 0) + 1;
      return counts;
    }, {});

    res.send({ resdata, totallength, productCounts });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};
