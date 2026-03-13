const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ username, email, password });
        
        console.log(`User created: ${user.email}`);

        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar || "",
            token: generateToken(user._id)
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            console.log(`Login failed: User not found (${email})`);
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        
        if (isMatch) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar || "",
                token: generateToken(user._id)
            });
        } else {
            console.log(`Login failed: Wrong password for ${email}`);
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (username) user.username = username;
        
        if (req.file) {
            const uploadFile = require('../services/storage.service');
            const result = await uploadFile(req.file.buffer);
            user.avatar = result.url;
        }

        const updatedUser = await user.save();
        
        // We need to return the token too, either from req or regened
        const token = req.headers.authorization?.split(' ')[1] || generateToken(updatedUser._id);

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            token: token
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: error.message });
    }
};
