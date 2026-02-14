import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('DB Connection Error:', err);
        process.exit(1);
    }
};

import authRouter from './routes/authRoute.js';
import jobRouter from './routes/jobRoute.js';
import userRouter from './routes/userRoute.js';

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/users', userRouter);

app.get('/', (req, res) => res.send('API Working'));

// Start Server
connectDB().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
