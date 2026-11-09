import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
    position: { type: String, trim: true },
    salary: { type: Number, min: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User