const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

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
            success:true,
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

const profile=async(req,res)=>{
    try{
        const user = req.user;
        return res.status(200).json({
        message: 'User information fetched successfully.',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const updateUser = async (req, res) => {
    try {
      const { name, email, role, password, confirmPassword } = req.body;
      const userId = req.user?._id;
  
      if (!userId) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (password && password !== confirmPassword) {
        return res.status(400).json({ success: false, message: "Passwords do not match" });
      }

      const updatePayload = {};
      if (name) updatePayload.name = name;
      if (email) updatePayload.email = email;
      if (role) updatePayload.role = role;

      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updatePayload.password = hashedPassword;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updatePayload, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      return res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  

  const getAvailableUsers = async (req, res) => {
    try {
        const users = await User.find({ team: null }).select('_id name email');
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching available users:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};



module.exports = { signup, login, deleteAccount,logout,profile,updateUser, getAvailableUsers };
