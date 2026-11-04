const Employee = require("../models/employeeInfo");

const addEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);

        res.status(201).json({
            message: "Employee added successfully",
            employee
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { addEmployee };