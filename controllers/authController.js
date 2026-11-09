import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

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

    if (!firstName) return res.status(400).json({ message: 'First name is required' })
    if (!lastName) return res.status(400).json({ message: 'Last name is required' })
    if (!email) return res.status(400).json({ message: 'Email is required' })
    if (!password) return res.status(400).json({ message: 'Password is required' })
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' })
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // The very first account becomes the admin. Everyone after that is an employee.
    const userCount = await User.countDocuments()
    const role = userCount === 0 ? 'admin' : 'employee'

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ firstName, lastName, email, password: hashedPassword, role })

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token: signToken(user._id),
      user: publicUser(user)
    })
  } catch (error) {
    console.error('REGISTER ERROR:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// ===== LOGIN =====
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email) return res.status(400).json({ message: 'Email is required' })
    if (!password) return res.status(400).json({ message: 'Password is required' })

    const user = await User.findOne({ email: email.toLowerCase() })
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
    if (req.params.id === String(req.user._id)) {
      return res.status(400).json({ message: 'You cannot delete your own account' })
    }

    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    res.status(200).json({ success: true, message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}