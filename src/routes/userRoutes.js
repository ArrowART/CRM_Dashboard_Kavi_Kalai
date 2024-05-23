import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'
import { deleteUser, getallUsers, getuniquevaluebyfield, saveUser, searchCategory, updateUser } from '../controllers/user/userController.js'
const userRouter = express.Router()
userRouter.get('/apigetalluser', authMiddleware(['SuperAdmin','TeamLeader']), getallUsers)
userRouter.get('/apigetuniquevaluebyfield', authMiddleware(['SuperAdmin','TeamLeader']), getuniquevaluebyfield)
userRouter.post('/apisaveuser', authMiddleware(['SuperAdmin','TeamLeader']), saveUser)
userRouter.put('/apiupdateuser', authMiddleware(['SuperAdmin','TeamLeader']),updateUser)
userRouter.delete('/apideleteuser', authMiddleware(['SuperAdmin','TeamLeader']), deleteUser)
userRouter.get('/apisearchcategory', authMiddleware(['SuperAdmin','TeamLeader']), searchCategory)
export default userRouter





