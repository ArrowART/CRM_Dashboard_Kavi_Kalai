import TelecallerAllocation from "../../models/TelecallerallocationModel.js";
import mongoose from "mongoose";

export const getalltelecallerallocation = async (req, res, next) => {
  try {
    const { first, rows, globalfilter, ...othersdata } = req.query;
    const individualFilters = Object.keys(othersdata).map(field => ({ [field]: { $regex: req.query[field] ?? '' } }));
    const fieldArray = Object.keys(TelecallerAllocation.schema.obj);
    const globalFilter = globalfilter ? { $or: fieldArray.filter(field1 => TelecallerAllocation.schema.path(field1) instanceof mongoose.Schema.Types.String).map(field => ({ [field]: { $regex: globalfilter, $options: 'i' } })) } : {};
    const isTelecaller = req.user.Role === 'Telecaller'; // Assuming 'Telecaller' is the role of telecallers
    const isTeamLeader = req.user.Role === 'TeamLeader';
    const filter = isTelecaller ? { $and: [globalFilter, { 'telecaller.UserName': req.user.UserName }, ...individualFilters] } : // Filter for telecallers
                   isTeamLeader ? { $and: [globalFilter, { 'teamleader.UserName': req.user.UserName }, ...individualFilters] } : // Filter for team leaders
                   { $and: [globalFilter, ...individualFilters] }; // Default filter for other roles
    const resdata = await TelecallerAllocation.find(filter).skip(first).limit(rows);
    const totallength = await TelecallerAllocation.countDocuments(filter);
    res.send({ resdata, totallength });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
};


export const saveTelecallerAllocation = async (req, res) => {
    try {
      const { teamleader, telecaller } = req.body;
      const newTelecallerAllocation = new TelecallerAllocation({teamleader,telecaller});
      const savedTelecallerAllocation = await newTelecallerAllocation.save();
      res.status(201).json(savedTelecallerAllocation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const updateTelecallerAllocation = async (req, res, next) => {
    try {
      const { _id } = req.query
      const resdata = await TelecallerAllocation.findOneAndUpdate({ _id }, req.body, { new: true })
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
  }

  export const deleteTelecallerAllocation = async (req, res, next) => {
    try {
      const { _id } = req.query
      const resdata = await TelecallerAllocation.deleteOne({ _id })
      res.send(resdata)
    } catch (err) {
      console.error(err)
    }
  }