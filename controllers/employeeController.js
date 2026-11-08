
import Employee from '../models/employeeInfo.js'

// Add Employee
const addEmployee = async (req, res) => {
  try {
    const employee = await Employee.create(req.body)

    res.status(201).json({
      message: 'Employee added successfully',
      employee
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

// Get Employees With More Than 3 Leave Days
const getEmployeesWithExcessLeave = async (req, res) => {
  try {
    const employees = await Employee.find()

    const employeesWithExcessLeave = employees.filter((employee) => {
      return employee.totalLeave > 3
    })

    res.status(200).json({
      success: true,
      employees: employeesWithExcessLeave
    })
  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}

export { addEmployee, getEmployeesWithExcessLeave }
