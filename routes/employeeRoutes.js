
import express from 'express'

import {
  addEmployee,
  getEmployeesWithExcessLeave
} from '../controllers/employeeController.js'

const router = express.Router()

// Add employee
router.post('/add', addEmployee)

// Get employees with more than 3 leave days
router.get('/excess-leave', getEmployeesWithExcessLeave)

export default router
