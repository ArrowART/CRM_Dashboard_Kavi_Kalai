// apiRoutes.js
import express from 'express'
import { Login } from '../controllers/auth/loginController.js'

const apiRouter = express.Router()
apiRouter.post('/apilogin', Login)
export default apiRouter
