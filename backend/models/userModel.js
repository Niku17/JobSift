import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['seeker', 'employer'], default: 'seeker' },
    resume: { type: String, default: '' }, // URL to resume
    companyName: { type: String }, // Only for employers
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
