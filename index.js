import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import employeeRoutes from './routes/employeeRoutes.js'

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Home route
app.get('/', (req, res) => {
  res.send('Crew-board backend is connected')
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/employees', employeeRoutes)

// Connect to the database, then start the server
const start = async () => {
  await connectDB()
  app.listen(7979, () => {
    console.log('Server is running on http://localhost:7979')
  })
}

start()