import 'dotenv/config'
import express from 'express'
import connectDB from './config/db.js'
import employeeRoutes from './routes/employeeRoutes.js'

const app = express()

// Middleware
app.use(express.json())

// Home route
app.get('/', (req, res) => {
  res.send('Crew-board backend is connected')
})

// Employee routes
app.use('/api/employees', employeeRoutes)

import authRoutes from './routes/authRoutes.js'

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