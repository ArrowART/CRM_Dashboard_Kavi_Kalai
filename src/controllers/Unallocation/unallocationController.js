import Allocation from "../../models/AllocationModel.js";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';


export const getallunallocation = async (req, res, next) => {
  try {
    const { Role, UserName } = jwt.decode(req.headers.authorization.split(' ')[1]);
    const filter = Role === 'SuperAdmin' ? {Status:{$ne: "Allocate"}} : Role === 'TeamLeader' ? { selectedTeamLeader: UserName,selectedTelecaller:{$exists:false} } : Role === 'Telecaller' ? { selectedTelecaller: UserName } : {};
    const { globalfilter } = req.query;
    let filterQuery = Allocation.find(filter);
    if (globalfilter) {
      const regex = { $regex: globalfilter, $options: 'i' };
      const stringFields = Object.keys(Allocation.schema.paths).filter(field => Allocation.schema.paths[field].instance === 'String');
      if (stringFields.length > 0) {filterQuery = filterQuery.or(stringFields.map(field => ({ [field]: regex })));}
    }
    const resdata = await filterQuery.exec();
    const totallength = resdata.length;
    res.send({ resdata, totallength });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const savebulkunallocation = async (req, res) => {
  try {
    const data = req.body; 
    console.log(req.body)
    const result = await Allocation.insertMany(data);
    res.status(201).json({ success: true, message: "Bulk allocation upload successful", data: result });
  } catch (error) {
    console.error("Error in bulk upload:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getSelectedTeamLeaderAndTelecallerData = async (req, res, next) => {
  try {
    const { Role, UserName } = jwt.decode(req.headers.authorization.split(' ')[1]);
    let filter = {};
    if (Role === 'SuperAdmin') {filter.$or = [{ selectedTelecaller: { $exists: true, $ne: null } }];
    } else if (Role === 'TeamLeader') {filter.selectedTeamLeader = UserName;
    } else if (Role === 'Telecaller') {filter.selectedTelecaller = UserName;
    } else {return res.status(200).json({ resdata: [], totallength: 0 });
    }
    const { first = 0, rows = 0, globalfilter } = req.query;
    if (globalfilter) {
      const regex = new RegExp(globalfilter, 'i');
      const stringFields = Object.keys(Allocation.schema.paths).filter(field => Allocation.schema.paths[field].instance === 'String');
      if (stringFields.length > 0) {filter.$or = stringFields.map(field => ({ [field]: regex })); }
    }
    const resdata = await Allocation.find(filter).skip(parseInt(first)).limit(parseInt(rows));
    const totallength = await Allocation.countDocuments(filter);
    res.send({ resdata, totallength });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};

export const getProductivityStatus = async (req, res) => {
  try {
    const allocations = await Allocation.find();
    const filteredData = allocations.filter(item => item.Productivity_Status && item.Productivity_Status.trim() !== "");
    const finalResponse = {success: true,message: "Filtered data retrieved successfully",data: filteredData};
    return res.status(200).json(finalResponse);
  } catch (error) {
    console.error("Error in retrieving allocations:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFollowupAndFutureFollowupData = async (req, res, next) => {
  try {
    const { Role, UserName } = jwt.decode(req.headers.authorization.split(' ')[1]);
    const { first = 0, rows = 20 } = req.query;
    const filter = Role === 'SuperAdmin' ? { $or: [{ Disposition: /^Not Int/ }, { Disposition: /^Call Back/ },{ Disposition: /^DNE/ }] }: Role === 'TeamLeader' ? { $and: [{ $or: [{ Disposition: /^Not Int/ }, { Disposition: /^Call Back/ },{ Disposition: /^DNE/ }] }, { selectedTeamLeader: UserName }] } : Role === 'Telecaller' ? { $and: [{ $or: [{ Disposition: /^Not Int/ }, { Disposition: /^Call Back/ },{ Disposition: /^DNE/ }] }, { selectedTelecaller: UserName }] }  : { resdata: [], totallength: 0 };
    if (typeof filter === 'object' && filter.resdata) { return res.status(200).json(filter);}
    const totallength = await Allocation.countDocuments(filter);
    const resdata = await Allocation.find(filter).skip(parseInt(first)) .limit(parseInt(rows)) .lean();
    res.status(200).send({ resdata, totallength });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal Server Error' });
  }
};


export const allocateTeamLeader = async (req, res) => {
  try {
    const { data, selectedTeamLeader, selectedTelecaller } = req.body;
    const result = await Promise.all(
      (Array.isArray(data) ? data : [data]).map(async (item) => {
        const productivityStatus = {"Submit Lead": "Worked Leads","Not Int": "Reached","Followup": "Reached","Future Followup": "Reached","Call Back": "Not Reached","Lead Accepted": "Lead Accepted",}[item.selectedDisposition] || "Not Updated";
        const updatedFields = {
          selectedTeamLeader: selectedTeamLeader || item.selectedTeamLeader,
          selectedTelecaller: selectedTelecaller || undefined,
          Remarks: item.Remarks,
          Productivity_Status: productivityStatus,
        };
        const currentTimestamp = new Date().toISOString();
        if (item.selectedDisposition) {updatedFields.Disposition = `${item.selectedDisposition} (${currentTimestamp})`;
        } else { updatedFields.Disposition = `unchanged (${currentTimestamp})`; }
        if (item.selectedSubDisposition) {updatedFields.Sub_Disposition = `${item.selectedSubDisposition} (${currentTimestamp})`;
        } else {updatedFields.Sub_Disposition = `unchanged (${currentTimestamp})`; }
        const allocation = await Allocation.findByIdAndUpdate(item._id,updatedFields,{ new: true });
        if (selectedTeamLeader) {allocation.Status = "Allocate";  await allocation.save();}
        return allocation;
      })
    );

    return res.status(200).json({
      success: true,
      message: "Team leader, telecaller, and remarks saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error in allocating team leader and telecaller:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// export const allocateTeamLeader = async (req, res) => {
//   try {
//     const { data, selectedTeamLeader, selectedTelecaller, Productivity_Status } = req.body; 
//     console.log(req.body)
//     const result = await Promise.all(
//       (Array.isArray(data) ? data : [data]).map(async (item) => {
//         const productivityStatus = Productivity_Status || ({"Submit Lead": "Worked Leads","Not Int": "Reached","Followup": "Reached","Future Followup": "Reached","Call Back": "Not Reached","Lead Accepted": "Lead Accepted",}[item.selectedDisposition] || "Not Updated");
//         const updatedFields = {
//           selectedTeamLeader: selectedTeamLeader || item.selectedTeamLeader,
//           selectedTelecaller: selectedTelecaller || undefined,
//           Remarks: item.Remarks,
//           Productivity_Status: Productivity_Status||item.Productivity_Status,
//         };
//         const currentTimestamp = new Date().toISOString();
//         if (item.selectedDisposition) {
//           updatedFields.Disposition = `${item.selectedDisposition} (${currentTimestamp})`;
//         } else {
//           updatedFields.Disposition = `unchanged (${currentTimestamp})`;
//         }
//         if (item.selectedSubDisposition) {
//           updatedFields.Sub_Disposition = `${item.selectedSubDisposition} (${currentTimestamp})`;
//         } else {
//           updatedFields.Sub_Disposition = `unchanged (${currentTimestamp})`;
//         }
//         const allocation = await Allocation.findByIdAndUpdate(item._id, updatedFields, { new: true });
//         if (selectedTeamLeader) {
//           allocation.Status = "Allocate";
//           await allocation.save();
//         }
//         return allocation;
//       })
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Team leader, telecaller, and remarks saved successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error in allocating team leader and telecaller:", error);
//     return res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };


export const deleteallallocation = async (req, res) => {
  try {
    await Allocation.deleteMany({}); 
    res.status(200).json({ success: true, message: "All allocation deleted successfully" });
  } catch (error) {
    console.error("Error in deleting allocation:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};