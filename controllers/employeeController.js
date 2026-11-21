// controllers/employeeController.js
import Employee from '../models/employeeInfo.js'

// Add Employee (admin only, enforced in the route)
const addEmployee = async (req, res) => {
  try {
    // Whitelist fields. Passing req.body straight to create() lets a client set
    // any field in the schema, including ones you add later (mass assignment).
    const { name, email, position, salary, totalLeave } = req.body

    const employee = await Employee.create({ name, email, position, salary, totalLeave })

    res.status(201).json({
      success: true,
      message: 'Employee added successfully',
      employee
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message })
    }
    if (error.code === 11000) {
      return res.status(409).json({ message: 'An employee with this email already exists' })
    }
    console.error('ADD EMPLOYEE ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// Get Employees With More Than 3 Leave Days
const getEmployeesWithExcessLeave = async (req, res) => {
  try {
    // Filter in the database, not in JavaScript, so we don't load every employee into memory
    const employees = await Employee.find({ totalLeave: { $gt: 3 } })

    res.status(200).json({
      success: true,
      count: employees.length,
      employees
    })
  } catch (error) {
    console.error('EXCESS LEAVE ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export { addEmployee, getEmployeesWithExcessLeave }