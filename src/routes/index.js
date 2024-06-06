import express from 'express'
import apiRouter from './apiRoutes.js'
import userRouter from './userRoutes.js'
import telecallerallocationRouter from './telecallerallocationRoutes.js'
import unallocationRouter from './unallocationRoutes.js'
import allocationRouter from './allocationRoutes.js'

const router = express.Router()
router.use('/api', apiRouter)
router.use('/telecallerallocation', telecallerallocationRouter)
router.use('/users',userRouter)
router.use('/unallocation',unallocationRouter)
router.use('/allocation',allocationRouter)
export default router