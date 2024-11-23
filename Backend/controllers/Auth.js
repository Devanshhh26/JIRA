const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'Developer',
        });

        await newUser.save();
        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1d' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, 
        });    
        return res.status(200).json({
            message: 'Login successful.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    
};

const logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Logged out successfully.',
        });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

const deleteAccount = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.clearCookie('token');
        await user.deleteOne();
        return res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
        console.error('Error deleting account:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};



module.exports = { signup, login, deleteAccount,logout };
