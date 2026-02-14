import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('seeker');
    const [companyName, setCompanyName] = useState('');

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await register(name, email, password, role, companyName);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                    <p className="mt-2 text-gray-600">Join JobSift today</p>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button type="button" onClick={() => setRole('seeker')} className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${role === 'seeker' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                Job Seeker
                            </button>
                            <button type="button" onClick={() => setRole('employer')} className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${role === 'employer' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                Employer
                            </button>
                        </div>
                    </div>
                    {role === 'employer' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input type="text" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary outline-none" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                        </div>
                    )}
                    <button type="submit" className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-indigo-700 focus:outline-none transition-all">Sign Up</button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium text-primary hover:text-indigo-500">Sign in</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
