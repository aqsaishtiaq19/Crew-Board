import express from 'express'
import employeeRoutes from './routes/employeeRoutes.js'

const app = express()

// Middleware
app.use(express.json())

// Home route
app.get('/', (req, res) => {
  res.send('Hello World')
})

// Employee routes
app.use('/api/employees', employeeRoutes)

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})