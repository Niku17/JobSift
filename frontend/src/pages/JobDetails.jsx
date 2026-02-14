import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { MapPin, Briefcase, DollarSign, Clock, Building, ChevronLeft } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, backendUrl, token } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`${backendUrl}/api/jobs/${id}`);
                if (data.success) {
                    setJob(data.job);
                    if (user && data.job.applicants.some(app => app.userId === user._id)) {
                        setHasApplied(true);
                    }
                }
            } catch (error) {
                toast.error("Failed to load job details");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [backendUrl, id, user]);

    const handleApply = async () => {
        if (!user) {
            toast.info("Please login to apply");
            return navigate('/login');
        }

        // Check if user has a resume
        try {
            const userProfile = await axios.get(`${backendUrl}/api/users/me`, { headers: { token } });
            if (!userProfile.data.user.resume) {
                toast.warn("Please upload your resume in the Dashboard before applying.");
                return navigate('/dashboard');
            }
        } catch (error) {
            console.error("Error checking profile", error);
        }

        setApplying(true);
        try {
            const { data } = await axios.post(`${backendUrl}/api/jobs/apply`, { jobId: job._id }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                setHasApplied(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error applying");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
    if (!job) return <div className="text-center mt-20 text-xl text-gray-600">Job not found</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <button onClick={() => navigate(-1)} className="flex items-center text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
                <ChevronLeft className="w-5 h-5 mr-1" /> Back to Jobs
            </button>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-32 relative"></div>
                <div className="px-8 pb-8">
                    <div className="relative -top-10 flex flex-col md:flex-row md:items-end justify-between">
                        <div className="flex items-end">
                            <div className="bg-white p-4 rounded-2xl shadow-lg">
                                <Building className="w-12 h-12 text-indigo-600" />
                            </div>
                            <div className="ml-4 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                                <p className="text-lg text-gray-600 font-medium">{job.company}</p>
                            </div>
                        </div>
                        <div className="mt-4 md:mt-0">
                            {user?.role === 'employer' ? null : (
                                <button
                                    onClick={handleApply}
                                    disabled={hasApplied || applying}
                                    className={`px-8 py-3 rounded-xl font-semibold text-lg shadow-lg transition-all ${hasApplied
                                        ? 'bg-green-100 text-green-700 cursor-default'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-200'
                                        }`}
                                >
                                    {hasApplied ? 'Applied' : applying ? 'Sending...' : 'Apply Now'}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 border-t border-gray-100 pt-8">
                        <div className="flex items-center text-gray-700">
                            <MapPin className="w-5 h-5 text-indigo-500 mr-2" />
                            <span>{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <Clock className="w-5 h-5 text-indigo-500 mr-2" />
                            <span>{job.type}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                            <DollarSign className="w-5 h-5 text-indigo-500 mr-2" />
                            <span>{job.salary}</span>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                            <Briefcase className="w-5 h-5 text-indigo-500 mr-2" />
                            Job Description
                        </h2>
                        <div className="prose prose-indigo text-gray-600 leading-relaxed">
                            {job.description}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
