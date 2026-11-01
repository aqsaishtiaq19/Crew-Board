const User = require('../models/Userschema')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// ===== REGISTER =====
const register = async (req, res) => {
    try {
        const {firstName, lastName, 
               email, password} = req.body

        if(!firstName) {
            return res.status(400).json({ 
                message: "First name is required" 
            })
        }
        if(!lastName) {
            return res.status(400).json({ 
                message: "Last name is required" 
            })
        }
        if(!email) {
            return res.status(400).json({ 
                message: "Email is required" 
            })
        }
        if(!password) {
            return res.status(400).json({ 
                message: "Password is required" 
            })
        }

        const existingUser = await User.findOne({ email })
        if(existingUser) {
            return res.status(400).json({ 
                message: "Email already registered" 
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        })

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email
            }
        })

     } catch (error) {
    console.error("REGISTER ERROR:", error.message)
    res.status(500).json({ message: error.message })
}
}

// ===== LOGIN =====
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if(!email) {
            return res.status(400).json({ 
                message: "Email is required" 
            })
        }
        if(!password) {
            return res.status(400).json({ 
                message: "Password is required" 
            })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ 
                message: "Invalid credentials" 
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ 
                message: "Invalid credentials" 
            })
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                email: user.email
            }
        })

    } catch (error) {
        console.error("LOGIN ERROR:", error.message)
        res.status(500).json({ message: "Server error" })
    }
}
//  delete user by id (admin only)
   const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
}

module.exports = { register, login, deleteUser }