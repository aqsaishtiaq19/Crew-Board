// controllers/authController.js
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import User from '../models/User.js'

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== ''

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

const publicUser = (user) => ({
  id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role
})

// ===== REGISTER =====
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body

    if (![firstName, lastName, email, password].every(isNonEmptyString)) {
      return res
        .status(400)
        .json({ message: 'First name, last name, email and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }
    // bcrypt ignores everything after 72 bytes, so reject longer passwords explicitly
    if (password.length > 72) {
      return res.status(400).json({ message: 'Password must be at most 72 characters' })
    }

    const normalizedEmail = email.trim().toLowerCase()

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // The very first account becomes the admin. Everyone after that is an employee.
    const userCount = await User.countDocuments()
    const role = userCount === 0 ? 'admin' : 'employee'

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role
    })

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: signToken(user._id),
      user: publicUser(user)
    })
  } catch (error) {
    // Two simultaneous registrations can both pass the findOne check; the unique index catches it
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' })
    }
    console.error('REGISTER ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // password is select:false in the schema, so it must be requested explicitly
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password')
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: signToken(user._id),
      user: publicUser(user)
    })
  } catch (error) {
    console.error('LOGIN ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// ===== DELETE USER (admin only, enforced in the route) =====
export const deleteUser = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user id' })
    }
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' })
    }

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    console.error('DELETE USER ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}