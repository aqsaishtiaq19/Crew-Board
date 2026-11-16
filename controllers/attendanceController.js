// controllers/attendanceController.js
export const checkIn = async (req, res) => {
const open = await Attendance.findOne({ user: req.user._id, checkOut: null })
if (open) return res.status(400).json({ message: 'You are already checked in' })

const now = new Date()
const record = await Attendance.create({
user: req.user._id,
date: now.toISOString().slice(0, 10),
checkIn: now
})
res.status(201).json({ message: 'Checked in', record })
}

export const checkOut = async (req, res) => {
const open = await Attendance.findOne({ user: req.user._id, checkOut: null })
if (!open) return res.status(400).json({ message: 'You are not checked in' })

open.checkOut = new Date()
open.workedMinutes = Math.round((open.checkOut - open.checkIn) / 60000)
await open.save()
res.json({ message: 'Checked out', record: open })
}