import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import Job from './models/jobModel.js';
import User from './models/userModel.js';

dotenv.config();

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');

        // Create Dummy Employer
        let employer = await User.findOne({ email: 'demo@jobportal.com' });
        if (!employer) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            employer = new User({
                name: 'Demo Employer',
                email: 'demo@jobportal.com',
                password: hashedPassword,
                role: 'employer',
                companyName: 'Tech Corp'
            });
            await employer.save();
            console.log('Dummy Employer Created');
        } else {
            console.log('Dummy Employer Exists');
        }

        // Clear existing jobs
        await Job.deleteMany({});
        console.log('Existing jobs cleared');

        // Seed Jobs
        const jobs = [
            {
                title: 'Frontend Developer',
                description: 'We are looking for a skilled Frontend Developer with React and Tailwind CSS experience.',
                company: 'Tech Corp',
                location: 'Remote',
                salary: '$60k - $80k',
                type: 'Full-time',
                employerId: employer._id
            },
            {
                title: 'Backend Developer',
                description: 'Join our team as a Backend Developer. Proficiency in Node.js and MongoDB is required.',
                company: 'Tech Corp',
                location: 'New York, NY',
                salary: '$70k - $90k',
                type: 'Full-time',
                employerId: employer._id
            },
            {
                title: 'UI/UX Designer',
                description: 'Creative UI/UX Designer needed to design intuitive user interfaces for our web applications.',
                company: 'Design Studio',
                location: 'San Francisco, CA',
                salary: '$65k - $85k',
                type: 'Contract',
                employerId: employer._id
            },
            {
                title: 'Full Stack Engineer',
                description: 'Looking for a Full Stack Engineer comfortable with the MERN stack.',
                company: 'Startup Inc',
                location: 'Austin, TX',
                salary: '$90k - $120k',
                type: 'Full-time',
                employerId: employer._id
            },
            {
                title: 'Data Analyst',
                description: 'Analyze data trends and help us make data-driven decisions.',
                company: 'DataWorks',
                location: 'Chicago, IL',
                salary: '$55k - $75k',
                type: 'Part-time',
                employerId: employer._id
            },
            {
                title: 'DevOps Engineer',
                description: 'Manage our cloud infrastructure and CI/CD pipelines.',
                company: 'CloudNet',
                location: 'Remote',
                salary: '$80k - $110k',
                type: 'Full-time',
                employerId: employer._id
            }
        ];

        await Job.insertMany(jobs);
        console.log('Database seeded with 6 jobs');

        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
