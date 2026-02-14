import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.token || req.headers.authorization?.split(' ')[1];
    if (!token) return res.json({ success: false, message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        res.json({ success: false, message: 'Invalid Token' });
    }
};

export const verifyEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.json({ success: false, message: 'Employer Access Only' });
    }
    next();
};
