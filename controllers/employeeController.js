import Employee from '../models/employeeInfo.js'

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

const employeesWithExcessLeave = employees.filter((employee) => {
  return employee.totalLeave > 3
})}
}

export { addEmployee }