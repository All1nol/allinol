import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();            
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };
    
    return (    
        <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"> 
            <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Login</h2>
                {error && <div className="mb-4 text-red-500 dark:text-red-400">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2 text-slate-700 dark:text-slate-300">Email</label>
                        <input 
                            type="email"
                            id="email"
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"    
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>  
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-slate-700 dark:text-slate-300">Password</label>
                        <input 
                            type="password"
                            id="password"
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"    
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className={cn(
                            "w-full p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800",
                            loading && "opacity-70 cursor-not-allowed"
                        )}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p className="mt-4 text-center text-slate-700 dark:text-slate-300">
                        Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Register</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;