import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  salary: { type: Number, required: true },

  totalLeave: {
    type: Number,
    default: 0
  }
})

const Employee = mongoose.model('Employee', employeeSchema)

export default Employee