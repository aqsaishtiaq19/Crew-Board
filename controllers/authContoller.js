import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' })

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    const exists = await User.findOne({ email })
    if (exists) return res.status(400).json({ message: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, role })

    res.status(201).json({
      message: 'User registered',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: signToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !user.isActive || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({
      message: 'Login successful',
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token: signToken(user._id)
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}