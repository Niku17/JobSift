import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Register User
export const register = async (req, res) => {
    try {
        const { name, email, password, role, companyName } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.json({ success: false, message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role,
            companyName: role === 'employer' ? companyName : undefined
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, token, user: { name: newUser.name, role: newUser.role } });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ success: true, token, user: { name: user.name, role: user.role } });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
