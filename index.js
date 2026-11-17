import 'dotenv/config'
import app from './app.js'
import connectDB from './config/db.js'

// Connect to the database, then start the server
const start = async () => {
  await connectDB()
  app.listen(7979, () => {
    console.log('Server is running on http://localhost:7979')
  })
}

start()