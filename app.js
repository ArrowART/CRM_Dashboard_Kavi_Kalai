import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import cors from 'cors'
import router from './routes/index.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(compression())
app.use('/uploads', express.static('uploads'))
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173','http://localhost:5174', 'http://192.168.0.20:5173', 'http://192.168.0.125:5173', 'http://192.168.0.25:5173', 'http://192.168.0.26:5173','http://192.168.0.25:5174'],
  credentials: true
}))

app.use('/', router)
app.get('/app', (req, res) => res.send('Welcome to CRM Dashboard'))
export default app
