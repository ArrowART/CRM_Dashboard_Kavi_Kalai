import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { deleteTelecallerAllocation, getalltelecallerallocation, saveTelecallerAllocation, updateTelecallerAllocation } from '../controllers/telecallerallocation/telecallerallocationController.js'

const telecallerallocationRouter = express.Router()
telecallerallocationRouter.get('/apigetalltelecallerallocation', authMiddleware(['SuperAdmin','TeamLeader','Telecaller']), getalltelecallerallocation )
telecallerallocationRouter.post('/apisavetelecallerallocation', authMiddleware(['SuperAdmin','TeamLeader']), saveTelecallerAllocation)
telecallerallocationRouter.put('/apiupdatetelecallerallocation', authMiddleware(['SuperAdmin','Team Leader']),updateTelecallerAllocation)
telecallerallocationRouter.delete('/apideletetelecallerallocation', authMiddleware(['SuperAdmin','Team Leader']),deleteTelecallerAllocation )
export default telecallerallocationRouter
