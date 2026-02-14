import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Briefcase, Filter, X } from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const { backendUrl } = useContext(AuthContext);
    const navigate = useNavigate();

    const [filters, setFilters] = useState({
        search: '',
        location: '',
        type: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    const fetchJobs = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.location) params.append('location', filters.location);
            if (filters.type) params.append('type', filters.type);

            const { data } = await axios.get(`${backendUrl}/api/jobs?${params.toString()}`);
            if (data.success) {
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [backendUrl]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-slate-50 relative pb-20">
            {/* Hero Section - Reduced height for Jobs page */}
            <div className="bg-indigo-600 pt-10 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        Browse Jobs
                    </h1>

                    {/* Search Bar */}
                    <div className="max-w-3xl mx-auto bg-white p-2 rounded-full shadow-lg flex items-center">
                        <Search className="w-6 h-6 text-gray-400 ml-4" />
                        <input
                            type="text"
                            name="search"
                            value={filters.search}
                            onChange={handleFilterChange}
                            placeholder="Job title, keywords, or company"
                            className="flex-1 px-4 py-3 rounded-full focus:outline-none text-gray-700 placeholder-gray-400"
                        />
                        <button onClick={fetchJobs} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold transition-all">
                            Search
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10 flex flex-col md:flex-row gap-8">

                {/* Mobile Filter Toggle */}
                <button
                    className="md:hidden bg-white p-4 rounded-xl shadow-md flex items-center justify-center font-semibold text-indigo-600"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="w-5 h-5 mr-2" /> Filters
                </button>

                {/* Sidebar Filters */}
                <div className={`w-full md:w-1/4 bg-white p-6 rounded-2xl shadow-sm h-fit ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-900 flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-indigo-500" /> Filters
                        </h3>
                        {showFilters && <button onClick={() => setShowFilters(false)}><X className="w-5 h-5" /></button>}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="location"
                                    value={filters.location}
                                    onChange={handleFilterChange}
                                    placeholder="e.g. New York, Remote"
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none"
                                >
                                    <option value="">All Types</option>
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Internship">Internship</option>
                                </select>
                            </div>
                        </div>

                        <button
                            onClick={fetchJobs}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium transition-colors"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>

                {/* Job List */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <div key={job._id} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 group flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h3>
                                            <p className="text-sm text-gray-500">{job.employerId?.companyName || job.company}</p>
                                        </div>
                                        <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ml-2">{job.type}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{job.description}</p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                                        <span className="text-sm font-semibold text-gray-700">{job.salary}</span>
                                        <button
                                            onClick={() => navigate(`/jobs/${job._id}`)}
                                            className="text-indigo-600 font-medium text-sm hover:underline bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                No jobs found matching your criteria.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
