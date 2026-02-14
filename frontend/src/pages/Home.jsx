import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, Users, Building2 } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-indigo-600 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                        Find Your <span className="text-indigo-200">Dream Job</span> Today
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-10">
                        Connecting the world's best talent with top-tier companies. Your next career move starts here.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={() => navigate('/jobs')}
                            className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Browse Jobs
                        </button>
                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-indigo-500 hover:bg-indigo-400 text-white border border-indigo-400 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                        >
                            Post a Job
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900">Why JobSift?</h2>
                    <p className="text-gray-600 mt-4 max-w-2xl mx-auto">We provide the best tools to help you find your perfect role or candidate.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <TrendingUp className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Matching</h3>
                        <p className="text-gray-600">Our algorithm connects you with jobs that fit your skills and preferences perfectly.</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building2 className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Top Companies</h3>
                        <p className="text-gray-600">Access thousands of job listings from industry-leading startups and corporations.</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Easy Application</h3>
                        <p className="text-gray-600">Apply to multiple jobs with a single click using your stored resume.</p>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-indigo-400 mb-2">10k+</div>
                        <div className="text-gray-400">Active Jobs</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-400 mb-2">5k+</div>
                        <div className="text-gray-400">Companies</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-400 mb-2">50k+</div>
                        <div className="text-gray-400">Job Seekers</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-indigo-400 mb-2">24h</div>
                        <div className="text-gray-400">Support</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
