import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/users/login', formData);
      
      // Save token and user details to localStorage
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      localStorage.setItem('token', response.data.token);

      toast.success('Login successful!');
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    'w-full bg-slate-900 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans text-slate-300">
      <ToastContainer theme="dark" position="top-right" />
      
      <div className="max-w-md w-full bg-slate-800/50 p-8 rounded-2xl shadow-xl border border-slate-700/50 backdrop-blur-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-wide text-red-500">Welcome Back</h1>
          <p className="text-slate-400">Log in to book your favorite movies</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              name="email"
              className={inputClasses}
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="password"
              name="password"
              className={inputClasses}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-400 hover:text-red-300 font-medium transition-colors">
            Sign Up here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
