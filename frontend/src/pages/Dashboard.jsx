import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Trash2, Calendar, Edit2, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

const Dashboard = () => {
    const { user, backendUrl } = useContext(AuthContext);
    const navigate = useNavigate();

    // Employer State
    const [jobs, setJobs] = useState([]);
    const [jobData, setJobData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        salary: '',
        deadline: ''
    });
    const [editJobId, setEditJobId] = useState(null);
    const [editDeadline, setEditDeadline] = useState('');

    // Seeker State
    const [applications, setApplications] = useState([]);

    // Resume & Profile State
    const [resume, setResume] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch User Data & Jobs/Applications
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    // Fetch User
                    const userRes = await axios.get(`${backendUrl}/api/users/me`, { headers: { token } });
                    if (userRes.data.success) {
                        setResume(userRes.data.user.resume || '');
                    }

                    // Fetch Jobs if Employer
                    if (user && user.role === 'employer') {
                        const jobRes = await axios.get(`${backendUrl}/api/jobs/employer-jobs`, { headers: { token } });
                        if (jobRes.data.success) {
                            setJobs(jobRes.data.jobs);
                        }
                    }

                    // Fetch Applications if Seeker
                    if (user && user.role === 'seeker') {
                        const appRes = await axios.get(`${backendUrl}/api/jobs/seeker-applications`, { headers: { token } });
                        if (appRes.data.success) {
                            setApplications(appRes.data.applications);
                        }
                    }

                } catch (error) {
                    console.error("Error fetching data", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        fetchData();
    }, [backendUrl, user]);

    // --- Common Functions ---
    const handleResumeUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${backendUrl}/api/users/update`, { resume }, { headers: { token } });
            if (data.success) {
                toast.success('Resume Updated Successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update resume");
        }
    };

    // --- Employer Functions ---
    const handleJobPost = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${backendUrl}/api/jobs/post`, jobData, { headers: { token } });
            if (data.success) {
                toast.success('Job Posted Successfully!');
                setJobData({ title: '', description: '', location: '', salary: '', type: 'Full-time', deadline: '' });
                // Refresh jobs
                setJobs([...jobs, data.job]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Are you sure you want to delete this job?")) return;
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.delete(`${backendUrl}/api/jobs/${id}`, { headers: { token } });
            if (data.success) {
                toast.success("Job Deleted");
                setJobs(jobs.filter(job => job._id !== id));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to delete job");
        }
    };

    const handleExtendJob = async (id) => {
        if (!editDeadline) return toast.warn("Please select a new deadline");
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${backendUrl}/api/jobs/${id}`, { deadline: editDeadline }, { headers: { token } });
            if (data.success) {
                toast.success("Job Updated");
                setJobs(jobs.map(job => job._id === id ? { ...job, deadline: editDeadline } : job));
                setEditJobId(null);
                setEditDeadline('');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update job");
        }
    };

    // --- Applicant Management ---
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [applicantsList, setApplicantsList] = useState([]);

    const fetchJobApplicants = async (jobId) => {
        if (selectedJobId === jobId) {
            setSelectedJobId(null); // Toggle close
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${backendUrl}/api/jobs/${jobId}/applicants`, { headers: { token } });
            if (data.success) {
                setApplicantsList(data.applicants);
                setSelectedJobId(jobId);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to fetch applicants");
        }
    };

    const handleStatusUpdate = async (jobId, applicantId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.put(`${backendUrl}/api/jobs/${jobId}/applicant/${applicantId}`, { status: newStatus }, { headers: { token } });
            if (data.success) {
                toast.success("Status Updated");
                // Update local state
                setApplicantsList(applicantsList.map(app =>
                    app.userId._id === applicantId ? { ...app, status: newStatus } : app
                ));
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    // --- Helper for Status Color ---
    const getStatusColor = (status) => {
        switch (status) {
            case 'Applied': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'Shortlisted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'OA': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Interview': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Hired': return 'bg-green-100 text-green-800 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

            {user && user.role === 'employer' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Post Job Form */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Post a New Job</h2>
                        <form onSubmit={handleJobPost} className="space-y-4">
                            <input type="text" placeholder="Job Title" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={jobData.title} onChange={e => setJobData({ ...jobData, title: e.target.value })} required />
                            <textarea placeholder="Job Description" className="w-full px-4 py-2 border rounded-lg h-32 focus:ring-2 focus:ring-indigo-500 outline-none" value={jobData.description} onChange={e => setJobData({ ...jobData, description: e.target.value })} required />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Location" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={jobData.location} onChange={e => setJobData({ ...jobData, location: e.target.value })} required />
                                <input type="text" placeholder="Salary (e.g. $50k - $80k)" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={jobData.salary} onChange={e => setJobData({ ...jobData, salary: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={jobData.type} onChange={e => setJobData({ ...jobData, type: e.target.value })}>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-gray-400 text-xs">Deadline</span>
                                    <input type="date" className="w-full px-4 py-2 pt-6 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" value={jobData.deadline} onChange={e => setJobData({ ...jobData, deadline: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors">Post Job</button>
                        </form>
                    </div>

                    {/* Quick Stats & Posted Jobs */}
                    <div className="space-y-8">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
                            <h2 className="text-xl font-bold mb-4">Your Stats</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-3xl font-bold">{jobs.length}</div>
                                    <div className="text-indigo-100 text-sm">Active Jobs</div>
                                </div>
                                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                                    <div className="text-3xl font-bold">0</div>
                                    <div className="text-indigo-100 text-sm">Total Applicants</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">My Posted Jobs</h2>
                            <div className="space-y-4">
                                {jobs.length > 0 ? (
                                    jobs.map((job) => (
                                        <div key={job._id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-shadow">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                                                    <p className="text-sm text-gray-500">{job.location} • {job.type}</p>
                                                    {job.deadline && <p className="text-xs text-orange-600 mt-1 flex items-center"><Calendar className="w-3 h-3 mr-1" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</p>}
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleDeleteJob(job._id)} className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors" title="Remove Job">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setEditJobId(editJobId === job._id ? null : job._id)} className="text-indigo-500 hover:bg-indigo-50 p-2 rounded-full transition-colors" title="Extend Date">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Edit Deadline Mode */}
                                            {editJobId === job._id && (
                                                <div className="mt-4 flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                                                    <input
                                                        type="date"
                                                        className="px-2 py-1 border rounded text-sm"
                                                        value={editDeadline}
                                                        onChange={(e) => setEditDeadline(e.target.value)}
                                                    />
                                                    <button onClick={() => handleExtendJob(job._id)} className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700">Save</button>
                                                </div>
                                            )}

                                            <div className="mt-3 flex items-center justify-between">
                                                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
                                                    {job.applicants.length} Applicants
                                                </span>
                                                <button onClick={() => fetchJobApplicants(job._id)} className="text-sm text-indigo-600 hover:underline">
                                                    View Applicants
                                                </button>
                                            </div>

                                            {/* Applicants List */}
                                            {selectedJobId === job._id && (
                                                <div className="mt-4 border-t border-gray-100 pt-4">
                                                    <h4 className="font-bold text-gray-800 mb-3 text-sm">Applicants</h4>
                                                    {applicantsList.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {applicantsList.map((app) => (
                                                                <div key={app._id} className="bg-gray-50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                                    <div>
                                                                        <p className="font-semibold text-sm text-gray-900">{app.userId.name}</p>
                                                                        <p className="text-xs text-gray-500">{app.userId.email}</p>
                                                                        {app.userId.resume && <a href={app.userId.resume} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline">View Resume</a>}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <select
                                                                            value={app.status}
                                                                            onChange={(e) => handleStatusUpdate(job._id, app.userId._id, e.target.value)}
                                                                            className="text-xs border rounded px-2 py-1 outline-none bg-white"
                                                                        >
                                                                            <option value="Applied">Applied</option>
                                                                            <option value="Shortlisted">Shortlisted</option>
                                                                            <option value="OA">OA</option>
                                                                            <option value="Interview">Interview</option>
                                                                            <option value="Hired">Hired</option>
                                                                            <option value="Rejected">Rejected</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-gray-500">No applicants yet.</p>
                                                    )}
                                                </div>
                                            )}

                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-4">You haven't posted any jobs yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Resume Section */}
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h2>
                        <div className="max-w-2xl">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Resume URL (Portfolio, LinkedIn, Google Drive)</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={resume}
                                    onChange={(e) => setResume(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                                <button
                                    onClick={handleResumeUpdate}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                                >
                                    Save Resume
                                </button>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Employers will see this link when you apply for jobs.</p>
                        </div>
                    </div>

                    {/* Applications Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">My Applications</h2>
                        <div className="space-y-4">
                            {applications.length > 0 ? (
                                applications.map((app) => (
                                    <div key={app._id} className="p-4 border border-gray-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between hover:shadow-md transition-all gap-4">
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-lg">{app.title}</h3>
                                            <p className="text-gray-600">{app.company}</p>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                                <span>{app.location}</span>
                                                <span>•</span>
                                                <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                                            {/* Progress Stepper */}
                                            <div className="flex items-center justify-between relative">
                                                {['Applied', 'Shortlisted', 'OA', 'Interview', 'Hired'].map((step, index) => {
                                                    const steps = ['Applied', 'Shortlisted', 'OA', 'Interview', 'Hired'];
                                                    const currentStepIndex = steps.indexOf(app.status);
                                                    const isCompleted = currentStepIndex > index;
                                                    const isCurrent = currentStepIndex === index;
                                                    const isRejected = app.status === 'Rejected';

                                                    return (
                                                        <div key={step} className="flex flex-col items-center z-10 w-full relative">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isRejected ? 'border-red-500 bg-red-50 text-red-500' :
                                                                isCompleted ? 'border-green-500 bg-green-500 text-white' :
                                                                    isCurrent ? 'border-indigo-600 bg-white text-indigo-600' :
                                                                        'border-gray-300 bg-white text-gray-300'
                                                                }`}>
                                                                {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                                                                    isRejected && index === 0 ? <XCircle className="w-5 h-5" /> : // visual placeholder for rejected
                                                                        <div className={`w-2.5 h-2.5 rounded-full ${isCurrent ? 'bg-indigo-600' : isRejected ? 'bg-red-500' : 'bg-transparent'}`} />}
                                                            </div>
                                                            <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-indigo-600' :
                                                                isCompleted ? 'text-green-600' :
                                                                    isRejected ? 'text-red-500' : 'text-gray-400'
                                                                }`}>{step}</span>

                                                            {/* Connector Line */}
                                                            {index < steps.length - 1 && (
                                                                <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${currentStepIndex > index ? 'bg-green-500' : 'bg-gray-200'
                                                                    }`} />
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            {app.status === 'Rejected' && (
                                                <div className="text-center mt-2">
                                                    <span className="text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold border border-red-100">Application Rejected</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">You haven't applied to any jobs yet.</p>
                                    <button onClick={() => navigate('/jobs')} className="text-indigo-600 font-medium hover:underline">Browse Jobs &rarr;</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
