import User from '../models/userModel.js';

// Update User Profile (Resume, etc.)
export const updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { resume, companyName, name } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (resume) user.resume = resume;
        if (companyName && user.role === 'employer') user.companyName = companyName;
        if (name) user.name = name;

        await user.save();

        res.json({
            success: true, message: 'Profile Updated Successfully', user: {
                name: user.name,
                role: user.role,
                resume: user.resume,
                companyName: user.companyName
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get User Profile
export const getUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        res.json({ success: true, user });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
