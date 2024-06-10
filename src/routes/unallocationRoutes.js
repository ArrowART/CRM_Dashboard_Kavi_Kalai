import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { allocateTeamLeader, deleteallallocation, deleteallocation, getFollowupAndFutureFollowupData, getProductivityStatus, getSelectedTeamLeaderAndTelecallerData, getallunallocation, savebulkunallocation, updateAllocation } from '../controllers/Unallocation/unallocationController.js'

const unallocationRouter = express.Router()
unallocationRouter.get('/apigetallallocation', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']), getallunallocation)
unallocationRouter.get('/apigetselectedteamleaderandtelecallerdata', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']), getSelectedTeamLeaderAndTelecallerData)
unallocationRouter.get('/apigetfollowupandfuturefollowupdata', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']),getFollowupAndFutureFollowupData)
unallocationRouter.get('/apigetallproductivitydata', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']),getProductivityStatus)
unallocationRouter.post('/apisavebulkallocation', authMiddleware(['SuperAdmin','TeamLeader']), savebulkunallocation)
unallocationRouter.post('/apiallocateteamleader', authMiddleware(['SuperAdmin','TeamLeader',,'Telecaller']), allocateTeamLeader)
unallocationRouter.delete('/apideleteallocation', authMiddleware(['SuperAdmin','TeamLeader']),deleteallallocation )
unallocationRouter.delete('/apideletesingleallocation', authMiddleware(['SuperAdmin','TeamLeader']),deleteallocation )
unallocationRouter.put('/apiupdatallocation', authMiddleware(['SuperAdmin','TeamLeader']),updateAllocation)

export default unallocationRouter
