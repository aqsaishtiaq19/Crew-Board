// controllers/attendanceController.js
import Attendance from '../models/attendance.js'

// "Today" must be the business-local date, not the UTC date.
// toISOString() is UTC, so a check-in at 2 AM in Pakistan would land on yesterday.
const localDate = (now) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: process.env.APP_TIMEZONE || 'Asia/Karachi'
  }).format(now) // -> YYYY-MM-DD

export const checkIn = async (req, res) => {
  try {
    const open = await Attendance.findOne({ user: req.user._id, checkOut: null })
    if (open) return res.status(400).json({ message: 'You are already checked in' })

    const now = new Date()
    const record = await Attendance.create({
      user: req.user._id,
      date: localDate(now),
      checkIn: now
    })

    res.status(201).json({ message: 'Checked in', record })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already checked in' })
    }
    console.error('CHECK-IN ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

export const checkOut = async (req, res) => {
  try {
    const open = await Attendance.findOne({ user: req.user._id, checkOut: null })
    if (!open) return res.status(400).json({ message: 'You are not checked in' })

    open.checkOut = new Date()
    open.workedMinutes = Math.round((open.checkOut - open.checkIn) / 60000)
    await open.save()

    res.json({ message: 'Checked out', record: open })
  } catch (error) {
    console.error('CHECK-OUT ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}