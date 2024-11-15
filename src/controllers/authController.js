const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Constants for configuration
const JWT_EXPIRY = '1d';
const SALT_ROUNDS = 10;

// Helper function for token generation
const generateToken = (userId) => {
    try {
        return jwt.sign(
            { id: userId },
            process.env.JWT_SECRET,
            { expiresIn: JWT_EXPIRY }
        );
    } catch (error) {
        console.error('Token generation error:', error);
        throw new Error('Failed to generate token');
    }
};

console.log('JWT_SECRET:', process.env.JWT_SECRET);

// Helper function for error responses
const sendError = (res, statusCode, message) => {
    return res.status(statusCode).json({ success: false, message });
};

// register
exports.register = async (req, res) => {
    try {
        const { username,name, email, password } = req.body;

        // Input validation
        if (!username || !email || !password || !name) {
            return sendError(res, 400, 'All fields are required');
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 400, 'Invalid email format');
        }

        // Check if user exists (both email and username)
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingUser) {
            return sendError(res, 400, 
                existingUser.email === email ? 'Email already registered' : 'Username already taken'
            );
        }

        // Create new user
        const user = new User({ username, name, email, password });
        await user.save();

        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name

                
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return sendError(res, 500, 'Server error during registration');
    }
};

// login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Request body:', req.body); // Keep this log

        // Add middleware check
        if (Object.keys(req.body).length === 0) {
            return sendError(res, 400, 'Empty request body');
        }

        // Input validation
        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required');
        }

        // Check if user exists and explicitly include password field
        const user = await User.findOne({ email }).select('+password');
        console.log('Found user:', user); // More detailed debug log

        if (!user) {
            return sendError(res, 401, 'Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match attempt completed:', isMatch); // Better debug log

        if (!isMatch) {
            return sendError(res, 401, 'Invalid credentials');
        }

        const token = generateToken(user._id);

        // Set token in header
        res.setHeader('Authorization', `Bearer ${token}`);

        // Return token and user data
        return res.status(200).json({
            success: true,
            token: token, // Make sure token is a string
            user: {
                id: user._id.toString(), // Convert ObjectId to string
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error details:', error.stack);
        return sendError(res, 500, `Server error during login: ${error.message}`);
    }
};

// logout 
exports.logout = async (req, res) => {
    try {
        res.json({
            success: true,
            message: 'Successfully logged out'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return sendError(res, 500, 'Server error during logout');
    }
};

// New method to get current user
exports.getCurrentUser = async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Get user from database (excluding password)
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    name: user.name
                }
            });
        } catch (jwtError) {
            return res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        console.error('Get current user error:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
                                                


