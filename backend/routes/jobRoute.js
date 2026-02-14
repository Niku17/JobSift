import express from 'express';
import { getJobs, getJobById, postJob, applyJob, getEmployerJobs, getSeekerApplications, deleteJob, updateJob, getJobApplicants, updateApplicantStatus } from '../controllers/jobController.js';
import { verifyToken, verifyEmployer } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/employer-jobs', verifyToken, verifyEmployer, getEmployerJobs);
router.get('/seeker-applications', verifyToken, getSeekerApplications);
router.get('/:id', getJobById);
router.post('/post', verifyToken, verifyEmployer, postJob);
router.post('/apply', verifyToken, applyJob);
router.delete('/:id', verifyToken, verifyEmployer, deleteJob);
router.put('/:id', verifyToken, verifyEmployer, updateJob);
router.get('/:id/applicants', verifyToken, verifyEmployer, getJobApplicants);
router.put('/:id/applicant/:applicantId', verifyToken, verifyEmployer, updateApplicantStatus);

export default router;
