import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const aiModels = [
    {
        id: 'model-02',
        name: '[Jimmu AI]',
        role: '[GROQ-POWERED INFERENCE ENGINE]',
        description: '[Powered by the Groq API for ultra-low latency conversational responses. Integrated with Piper TTS for seamless, real-time voice interactions]',
        theme: 'blue',
        gradientText: 'from-blue-300 via-blue-100 to-indigo-500',
        glowHover: 'group-hover:shadow-[0_0_50px_rgba(59,130,246,0.6)] group-hover:border-blue-400/80',
    },
    {
        id: 'model-01',
        name: '[RAO PRO AI]',
        role: '[​CUSTOM NATIVE CHATBOT]',
        description: '[A custom-built conversational engine developed entirely from the ground up without relying on third-party LLM APIs. Features native conversational logic and Piper-powered voice synthesis]',
        theme: 'cyan',
        gradientText: 'from-cyan-300 via-cyan-100 to-blue-500',
        glowHover: 'group-hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] group-hover:border-cyan-400/80',
    },

    {
        id: 'model-03',
        name: '[ENTER AI NAME HERE]',
        role: '[ENTER ROLE HERE]',
        description: '[ENTER DESCRIPTION HERE]',
        theme: 'indigo',
        gradientText: 'from-indigo-300 via-indigo-100 to-purple-500',
        glowHover: 'group-hover:shadow-[0_0_50px_rgba(99,102,241,0.6)] group-hover:border-indigo-400/80',
    },
    {
        id: 'model-04',
        name: '[ENTER AI NAME HERE]',
        role: '[ENTER ROLE HERE]',
        description: '[ENTER DESCRIPTION HERE]',
        theme: 'violet',
        gradientText: 'from-violet-300 via-violet-100 to-fuchsia-500',
        glowHover: 'group-hover:shadow-[0_0_50px_rgba(139,92,246,0.6)] group-hover:border-violet-400/80',
    },
];

export default function AISelection() {
    const navigate = useNavigate();
    const [hoveredId, setHoveredId] = useState(null);

    const handleSelectAI = (model) => {
        navigate('/chat', { state: { selectedModel: model } });
    };

    return (
        <div className="relative min-h-screen w-full bg-[#030712] overflow-hidden font-sans text-white">


            <style>{`
        /* Continuous Moving Cyber Grid */
        @keyframes scrollGrid {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        
        /* Laser Scanline going up and down */
        @keyframes scanline {
          0% { transform: translateY(-100vh); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* Floating effect for Main Text */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        /* Sci-Fi Text Glitch Effect */
        @keyframes glitch {
          0%, 100% { text-shadow: 0 0 0px rgba(6, 182, 212, 0); transform: translate(0); }
          5% { text-shadow: -3px 0 10px rgba(6, 182, 212, 0.8), 3px 0 10px rgba(255, 0, 255, 0.8); transform: translate(-2px, 1px); }
          10% { text-shadow: 0 0 0px rgba(6, 182, 212, 0); transform: translate(0); }
          15% { text-shadow: 3px 0 10px rgba(6, 182, 212, 0.8), -3px 0 10px rgba(255, 0, 255, 0.8); transform: translate(2px, -1px); }
          20% { text-shadow: 0 0 0px rgba(6, 182, 212, 0); transform: translate(0); }
        }

        /* Rotating Core Ring inside Cards */
        @keyframes spin-slow {
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          100% { transform: rotate(-360deg); }
        }
      `}</style>



            {/* 1. Base Gradient Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0a192f_0%,_#030712_80%)] opacity-80" />

            {/* 2. Scrolling Cyber Grid (Live Movement) */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 perspective-1000">
                <div
                    className="absolute w-full h-[200%] bg-[linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] bg-[size:50px_50px]"
                    style={{ animation: 'scrollGrid 15s linear infinite' }}
                />
            </div>

            {/* 3. Global Laser Scanline */}
            <div
                className="pointer-events-none absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_30px_5px_rgba(6,182,212,0.8)] opacity-50"
                style={{ animation: 'scanline 6s ease-in-out infinite' }}
            />

            {/* 4. Giant Glowing Orbs (Breathing) */}
            <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] bg-cyan-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-blue-800/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

            {/* Back Button */}
            <button
                onClick={() => navigate('/home')}
                className="absolute top-6 left-6 z-50 flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-black/40 px-6 ... "
            >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 transition-transform ...">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Abort / Return
            </button>


            {/* Main Content */}
            <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-32">

                {/* Animated Header */}
                <header className="mb-20 text-center md:mb-28 mt-8 md:mt-0">
                    <p className="mb-4 text-[10px] md:text-[12px] font-bold uppercase tracking-[0.7em] text-cyan-400/80 animate-pulse">
                        [ SYSTEM // NEURAL CORE ACTIVE ]
                    </p>

                    {/* Glitching & Floating Main Title */}
                    <div className="inline-block" style={{ animation: 'float 6s ease-in-out infinite' }}>
                        <h1
                            className="bg-gradient-to-r from-white via-cyan-200 to-blue-500 bg-clip-text text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.1em] text-transparent drop-shadow-[0_0_25px_rgba(6,182,212,0.4)]"
                            style={{ animation: 'glitch 4s infinite' }}
                        >
                            Select Your Intelligence
                        </h1>
                    </div>

                    <div className="mx-auto mt-10 flex items-center justify-center gap-4">
                        <div className="h-[2px] w-12 bg-cyan-500/50" />
                        <p className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.5em] text-cyan-100/50">
                            Awaiting Command Input
                        </p>
                        <div className="h-[2px] w-12 bg-cyan-500/50" />
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:gap-14">
                    {aiModels.map((model, index) => (
                        <div
                            key={model.id}
                            onClick={() => handleSelectAI(model)}
                            onMouseEnter={() => setHoveredId(model.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`group relative cursor-pointer outline-none rounded-[2rem] transition-all duration-500 ease-out hover:-translate-y-4`}
                        >
                            {/* Outer Glow & Glass Layer */}
                            <div
                                className={`relative h-full overflow-hidden rounded-[2rem] border border-white/5 bg-[#0a1128]/60 p-8 md:p-10 backdrop-blur-3xl transition-all duration-500 shadow-2xl shadow-black/50 ${model.glowHover}`}
                            >
                                {/* Internal Glass Reflection (Shine) */}
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-50 pointer-events-none" />
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

                                {/* Rotating Sci-Fi Core (Top Right) */}
                                <div className="absolute top-8 right-8 w-16 h-16 opacity-30 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="absolute inset-0 border border-dashed border-cyan-400 rounded-full" style={{ animation: 'spin-slow 10s linear infinite' }} />
                                    <div className="absolute inset-2 border-t-2 border-l-2 border-blue-500 rounded-full" style={{ animation: 'spin-reverse 6s linear infinite' }} />
                                    <div className={`absolute inset-0 m-auto w-2 h-2 rounded-full shadow-[0_0_10px_currentColor] animate-ping bg-${model.theme}-400`} />
                                </div>

                                {/* System Unit Tag */}
                                <div className="mb-10 flex items-center gap-3">
                                    <div className={`h-2 w-2 bg-${model.theme}-400 rounded-sm animate-pulse shadow-[0_0_10px_currentColor]`} />
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                                        UNIT // {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* AI Name with Gradient */}
                                <h2
                                    className={`mb-3 bg-gradient-to-r ${model.gradientText} bg-clip-text text-2xl font-black uppercase tracking-[0.1em] text-transparent md:text-[28px] drop-shadow-md`}
                                >
                                    {model.name}
                                </h2>

                                {/* AI Role */}
                                <p className="mb-6 font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-200/60">
                                    {model.role}
                                </p>

                                {/* Divider Line */}
                                <div className="mb-6 h-[1px] w-full bg-gradient-to-r from-cyan-500/30 via-cyan-500/10 to-transparent" />

                                {/* AI Description */}
                                <p className="mb-10 text-sm leading-relaxed text-slate-300/80 font-light tracking-wide">
                                    {model.description}
                                </p>

                                {/* Initialize Button Area */}
                                <div className="flex items-center justify-between mt-auto">
                                    <span className={`text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 transition-colors duration-500 group-hover:text-${model.theme}-400`}>
                                        Establish Connection
                                    </span>

                                    {/* Hexagon / Arrow Icon Button */}
                                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-500 group-hover:translate-x-2 group-hover:bg-${model.theme}-500/20 group-hover:border-${model.theme}-400`}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`h-5 w-5 text-white/50 transition-colors duration-300 group-hover:text-${model.theme}-400`}>
                                            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
