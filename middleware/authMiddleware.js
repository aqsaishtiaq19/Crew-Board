// middleware/authMiddleware.js
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifies the JWT and attaches the user (with roles) to req.user
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id).select('-password')
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User no longer exists or is inactive' })
    }

    req.user = user // includes roles, email, employee link
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired, please log in again' })
    }
    return res.status(401).json({ message: 'Invalid token' })
  }
}

// Allows the request only if the user has at least one of the given roles.
// Must be used AFTER protect.
export const authorize = (...allowed) => (req, res, next) => {
  const userRoles = req.user?.roles || []
  const hasRole = userRoles.some((role) => allowed.includes(role))

  if (!hasRole) {
    return res.status(403).json({ message: 'You do not have permission to do this' })
  }
  next()
}

// Optional helper: allow admins, or the user who owns the resource.
// Example: router.get('/employees/:id', protect, adminOrSelf('id'), getEmployee)
export const adminOrSelf = (paramName = 'id') => (req, res, next) => {
  const isAdmin = req.user?.roles?.includes('admin')
  const isSelf =
    req.user?.employee && req.user.employee.toString() === req.params[paramName]

  if (!isAdmin && !isSelf) {
    return res.status(403).json({ message: 'You do not have permission to do this' })
  }
  next()
}