import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
    // must match the name registered in employeeInfo.js
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeInfo', default: null },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)