import mongoose from 'mongoose'

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true, select: false }, // hidden unless explicitly requested
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },

    leave: {
      total: { type: Number, default: 0 },
      used: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
)

export default mongoose.model('Employee', employeeSchema)