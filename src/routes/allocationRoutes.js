import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { allocateTeamLeader, deleteallallocation, getFollowupAndFutureFollowupData, getProductivityStatus, getSelectedTeamLeaderAndTelecallerData, getallallocation, savebulkallocation } from '../controllers/Allocation/allocationController.js'

const allocationRouter = express.Router()
allocationRouter.get('/apigetallallocation', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']), getallallocation)
allocationRouter.get('/apigetselectedteamleaderandtelecallerdata', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']), getSelectedTeamLeaderAndTelecallerData)
allocationRouter.get('/apigetfollowupandfuturefollowupdata', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']),getFollowupAndFutureFollowupData)
allocationRouter.get('/apigetallproductivitydata', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']),getProductivityStatus)
allocationRouter.post('/apisavebulkallocation', authMiddleware(['SuperAdmin','TeamLeader']), savebulkallocation)
allocationRouter.post('/apiallocateteamleader', authMiddleware(['SuperAdmin','TeamLeader',,'Telecaller']), allocateTeamLeader)
allocationRouter.delete('/apideleteallocation', authMiddleware(['SuperAdmin','TeamLeader']),deleteallallocation )
export default allocationRouter
