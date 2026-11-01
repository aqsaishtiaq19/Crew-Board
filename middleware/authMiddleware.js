const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.headers.authorization;

        // Check if header exists and starts with "Bearer"
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'No token provided'
            });
        }

        // Extract token
        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Save decoded data in request
        
        req.user = { id: decoded.id };
        // Continue to next middleware/controller
        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = protect;