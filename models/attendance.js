// models/Attendance.js
const attendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },          // "2026-11-09", the work day
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, default: null },
  workedMinutes: { type: Number, default: 0 },
  autoClosed: { type: Boolean, default: false }
}, { timestamps: true })

attendanceSchema.index({ user: 1, checkIn: -1 })