import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], default: 'Full-time' },
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    applicants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Applied', 'Shortlisted', 'OA', 'Interview', 'Rejected', 'Hired'], default: 'Applied' },
        appliedAt: { type: Date, default: Date.now }
    }],
    deadline: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
