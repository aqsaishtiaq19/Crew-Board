import express from 'express'
import { register, login, deleteUser } from '../controllers/authController.js'
import { protect, authorize } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.delete('/users/:id', protect, authorize('admin'), deleteUser)

export default router