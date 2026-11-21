// models/User.js
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }, // store a bcrypt hash, never plain text
    roles: {
      type: [String],
      enum: ['admin', 'manager', 'employee'],
      default: ['employee'],
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.model('User', userSchema)