import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Crew-board backend is connected')
})

app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)

export default app