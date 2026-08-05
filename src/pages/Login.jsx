import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import '../styles/animations.css';

export default function Login() {
    const [isLoginMode, setIsLoginMode] = useState(true);

    const [name, setName] = useState(''); // Naya Name field
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username || !password || (!isLoginMode && !name)) {
            setError('Please fill in all the required fields.');
            return;
        }

        try {
            if (isLoginMode) {
                //  LOGIN LOGIC
                const result = await authService.loginWithUsername(username, password);
                if (result.success) {
                    console.log("Login Successful!", result.user);
                    navigate('/home');
                } else {
                    setError(result.error || 'Incorrect Username or Password!');
                }
            } else {
                // CREATE NEW ACCOUNT LOGIC
                const result = await authService.registerUser(name, username, password);
                if (result.success) {
                    console.log("Account Created Successfully!", result.user);
                    navigate('/home');
                } else {
                    setError(result.error || 'Username already taken or registration failed.');
                }
            }
        } catch (err) {
            console.error("Auth Error:", err);
            setError('Server connection failed. Please try again later.');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#02050a] flex items-center justify-center p-4 overflow-hidden font-sans selection:bg-cyan-500/30">

            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="real-lightning strike-1"></div>
                <div className="real-lightning strike-2"></div>
                <div className="real-lightning strike-3"></div>

                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full filter blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full filter blur-[120px]" style={{ animationDelay: '-3s' }}></div>

                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="energy-orb"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 15 + 8}px`,
                            height: `${Math.random() * 15 + 8}px`,
                            animationDuration: `${Math.random() * 4 + 4}s`,
                            animationDelay: `${Math.random() * 5}s`,
                        }}
                    />
                ))}
            </div>

            <div className="glass-3d-console relative z-10 w-full max-w-md p-10 transition-transform duration-500 hover:scale-[1.02]">

                {/* Header Section */}
                <div className="text-center mb-10 relative">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-blue-500 mb-2 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
                        Rao Pro AI
                    </h1>
                    <p className="text-cyan-400/80 text-xs font-bold tracking-[0.3em] uppercase">
                        {isLoginMode ? 'Access Your Terminal' : 'Initialize New ID'}
                    </p>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_10px_#00ffff]"></div>
                </div>

                {/* Main Auth Form */}
                <form onSubmit={handleSubmit} className="space-y-6 mb-6 mt-6">

                    {!isLoginMode && (
                        <div className="space-y-2 group">
                            <label className="block text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-cyan-300">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-5 py-3.5 bg-[#050a14]/60 border border-cyan-900/50 rounded-xl text-cyan-50 placeholder-cyan-900/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_15px_rgba(0,255,255,0.2)_inset]"
                                placeholder="Enter your full name"
                            />
                        </div>
                    )}

                    <div className="space-y-2 group">
                        <label className="block text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-cyan-300">
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-5 py-3.5 bg-[#050a14]/60 border border-cyan-900/50 rounded-xl text-cyan-50 placeholder-cyan-900/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_15px_rgba(0,255,255,0.2)_inset]"
                            placeholder="Choose a unique username"
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="block text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-cyan-300">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-5 py-3.5 bg-[#050a14]/60 border border-cyan-900/50 rounded-xl text-cyan-50 placeholder-cyan-900/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] focus:shadow-[0_0_15px_rgba(0,255,255,0.2)_inset]"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-950/50 border border-red-500/50 text-red-400 text-xs text-center py-2.5 rounded-xl shadow-[0_0_10px_rgba(255,0,0,0.2)]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn-cyber w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold tracking-widest uppercase text-sm py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] border border-cyan-400/50 transform transition-all active:scale-[0.98]"
                    >
                        {isLoginMode ? 'Initialize Link (Login)' : 'Create New Account'}
                    </button>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError('');
                        }}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-semibold tracking-wide transition-colors"
                    >
                        {isLoginMode
                            ? "Don't have an account? Create one"
                            : "Already have an account? Login here"}
                    </button>
                </div>

            </div>
        </div>
    );
}
