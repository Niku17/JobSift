import Job from '../models/jobModel.js';
import User from '../models/userModel.js';

// Get All Jobs
export const getJobs = async (req, res) => {
    try {
        const { title, location, type, search } = req.query;
        let query = {};

        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        if (location) {
            query.location = { $regex: location, $options: 'i' };
        }
        if (type) {
            query.type = type;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await Job.find(query).populate('employerId', 'name companyName');
        res.json({ success: true, jobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Single Job
export const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('employerId', 'name companyName');
        if (!job) return res.json({ success: false, message: 'Job not found' });
        res.json({ success: true, job });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Post a Job (Employer Only)
export const postJob = async (req, res) => {
    try {
        const { title, description, location, salary, type, deadline } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });

        const newJob = new Job({
            title,
            description,
            company: user.companyName,
            location,
            salary,
            type,
            deadline,
            employerId: userId
        });

        await newJob.save();
        res.json({ success: true, message: 'Job Posted Successfully', job: newJob });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Apply for a Job (Seeker Only)
export const applyJob = async (req, res) => {
    try {
        const { jobId } = req.body;
        const userId = req.user.id;

        const job = await Job.findById(jobId);
        if (!job) return res.json({ success: false, message: 'Job not found' });

        // Check availability (deadline)
        if (job.deadline && new Date() > new Date(job.deadline)) {
            return res.json({ success: false, message: 'Application deadline has passed' });
        }

        // Check if already applied
        const alreadyApplied = job.applicants.some(app => app.userId.toString() === userId);
        if (alreadyApplied) {
            return res.json({ success: false, message: 'Already Applied' });
        }

        job.applicants.push({ userId, status: 'Applied' });
        await job.save();

        res.json({ success: true, message: 'Applied Successfully' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Employer's Jobs
export const getEmployerJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ employerId: req.user.id });
        res.json({ success: true, jobs });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Seeker's Applications
export const getSeekerApplications = async (req, res) => {
    try {
        const userId = req.user.id;
        // Find jobs where applicants array contains an object with this userId
        const jobs = await Job.find({ 'applicants.userId': userId });

        // Map to include status
        const applications = jobs.map(job => {
            const app = job.applicants.find(a => a.userId.toString() === userId);
            return {
                ...job.toObject(),
                status: app ? app.status : 'Applied',
                appliedAt: app ? app.appliedAt : null
            };
        });

        res.json({ success: true, applications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete Job (Employer)
export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.json({ success: false, message: 'Job not found' });

        if (job.employerId.toString() !== req.user.id) {
            return res.json({ success: false, message: 'Not authorized to delete this job' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Job (Employer - e.g. Extend Deadline)
export const updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.json({ success: false, message: 'Job not found' });

        if (job.employerId.toString() !== req.user.id) {
            return res.json({ success: false, message: 'Not authorized to update this job' });
        }

        const { deadline } = req.body;
        if (deadline) job.deadline = deadline;

        await job.save();
        res.json({ success: true, message: 'Job updated successfully', job });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Applicants for a specific Job (Employer)
export const getJobApplicants = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('applicants.userId', 'name email resume');
        if (!job) return res.json({ success: false, message: 'Job not found' });

        if (job.employerId.toString() !== req.user.id) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        res.json({ success: true, applicants: job.applicants });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update Applicant Status (Employer)
export const updateApplicantStatus = async (req, res) => {
    try {
        const { id, applicantId } = req.params;
        const { status } = req.body;

        const job = await Job.findById(id);
        if (!job) return res.json({ success: false, message: 'Job not found' });

        if (job.employerId.toString() !== req.user.id) {
            return res.json({ success: false, message: 'Not authorized' });
        }

        const applicant = job.applicants.find(app => app.userId.toString() === applicantId);
        if (!applicant) return res.json({ success: false, message: 'Applicant not found' });

        applicant.status = status;
        await job.save();

        res.json({ success: true, message: 'Status User Updated' });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
