import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">J</span>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-gray-900">JobSift</span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">Home</Link>
                        <Link to="/jobs" className="text-gray-600 hover:text-primary transition-colors font-medium">Jobs</Link>
                        {user && (
                            <Link to="/dashboard" className="text-gray-600 hover:text-primary transition-colors font-medium">Dashboard</Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-gray-600 hidden sm:block">Hi, {user.name}</span>
                                <button
                                    onClick={() => { logout(); navigate('/login'); }}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-medium transition-all"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="text-gray-600 hover:text-primary font-medium px-4 py-2 rounded-full hover:bg-gray-50 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-primary hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full text-sm font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all transform hover:-translate-y-0.5"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
