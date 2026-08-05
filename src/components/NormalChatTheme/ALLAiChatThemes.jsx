import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ChatHistoryMenu from '../ChatHistoryMenu';

export default function ALLAiChatThemes({
    selectedAI,
    messages = [],
    prompt = "",
    setPrompt,
    isLoading,
    handleSendMessage,
    handleKeyPress,
    handleCopy,
    handleEditStart,
    handleEditCancel,
    handleEditSave,
    editingIndex,
    editText,
    setEditText,
    historyList,
    onNewChat,
    onSelectChat,
    onDeleteChat,
    speakText,

}) {
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const [localCopiedIndex, setLocalCopiedIndex] = useState(null);



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);


    useEffect(() => {
        if (!isLoading) {
            let raf2;
            const raf1 = requestAnimationFrame(() => {
                raf2 = requestAnimationFrame(() => {
                    inputRef.current?.focus();
                });
            });
            return () => {
                cancelAnimationFrame(raf1);
                if (raf2) cancelAnimationFrame(raf2);
            };
        }
    }, [isLoading]);



    const onCopyClick = async (text, index) => {
        if (handleCopy) {
            handleCopy(text, index);
        } else {
            try {
                await navigator.clipboard.writeText(text);
                setLocalCopiedIndex(index);
                setTimeout(() => setLocalCopiedIndex(null), 2000);
            } catch (err) {
                console.error("Copy failed:", err);
            }
        }
    };

    const onEditClick = (text, index) => {
        if (handleEditStart) {
            handleEditStart(index, text);
        } else {
            setPrompt(text);
        }
    };

    return (
        <div className="flex flex-col h-screen !bg-black text-gray-100 font-sans relative overflow-hidden selection:bg-blue-600/40">


            <ChatHistoryMenu
                chatHistory={historyList}
                onNewChat={onNewChat}
                onSelectChat={onSelectChat}
                onDeleteChat={onDeleteChat}
            />

            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-blue-900/10 rounded-full blur-[150px] pointer-events-none"></div>

            <style>{`
                @keyframes floatBubbleUp {
                    0%   { transform: translateY(0) translateX(0) scale(0.8); opacity: 0; }
                    10%  { opacity: 0.7; }
                    50%  { transform: translateY(-55vh) translateX(15px) scale(1.05); opacity: 0.45; }
                    90%  { opacity: 0.15; }
                    100% { transform: translateY(-110vh) translateX(-15px) scale(0.9); opacity: 0; }
                }
            `}</style>
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                {[
                    { left: '6%', size: 14, dur: 14, delay: 0 },
                    { left: '16%', size: 8, dur: 10, delay: 2 },
                    { left: '27%', size: 20, dur: 18, delay: 1 },
                    { left: '38%', size: 10, dur: 12, delay: 4 },
                    { left: '49%', size: 16, dur: 16, delay: 3 },
                    { left: '61%', size: 9, dur: 11, delay: 5 },
                    { left: '72%', size: 22, dur: 20, delay: 2.5 },
                    { left: '83%', size: 12, dur: 13, delay: 6 },
                    { left: '91%', size: 17, dur: 17, delay: 1.5 },
                    { left: '52%', size: 24, dur: 22, delay: 7 },
                ].map((b, i) => (
                    <span
                        key={i}
                        className="absolute bottom-0 rounded-full bg-gradient-to-br from-violet-400/40 to-fuchsia-600/10 blur-[1px] shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                        style={{
                            left: b.left,
                            width: `${b.size}px`,
                            height: `${b.size}px`,
                            animation: `floatBubbleUp ${b.dur}s ease-in-out ${b.delay}s infinite`
                        }}
                    ></span>
                ))}
            </div>

            <header className="flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-2xl sticky top-0 z-50 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
                <div className="flex items-center gap-4">
                    {/* BACK BUTTON */}
                    <button
                        onClick={() => navigate('/Select-ai')}
                        className="group flex items-center justify-center p-2 rounded-none border border-white/10 bg-white/5 hover:bg-blue-600/20 hover:border-blue-500/50 transition-all duration-300"
                        title="Go Back to Selection"
                    >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    </button>

                    <div className="flex items-center gap-3">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex h-2.5 w-2.5 bg-cyan-500 shadow-[0_0_12px_#06b6d4]"></span>
                        </span>
                        <h1 className="text-[18px] font-bold tracking-[0.2em] uppercase bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.3)]">
                            [{selectedAI || "SYSTEM KERNEL"}]
                        </h1>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="text-[10px] uppercase tracking-widest text-blue-400/70 border border-blue-500/20 px-3 py-1 bg-blue-900/10 hidden md:block">

                </div>
            </header>

            {/* MAIN CHAT AREA */}
            <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 z-10 custom-scrollbar pb-40 relative">

                {messages.length === 0 ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-90 mt-10 pointer-events-none">
                        <div className="relative w-48 h-48 flex items-center justify-center mb-8">
                            {/* Outer Spinning Ring */}
                            <div className="absolute inset-0 border-t-2 border-b-2 border-blue-500/50 rounded-full animate-[spin_4s_linear_infinite] shadow-[0_0_30px_rgba(59,130,246,0.2)]"></div>
                            {/* Inner Counter-Spinning Ring */}
                            <div className="absolute inset-4 border-r-2 border-l-2 border-cyan-400/60 rounded-full animate-[spin_3s_reverse_linear_infinite]"></div>
                            {/* Core Energy Sphere */}
                            <div className="absolute inset-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full blur-[10px] animate-pulse"></div>
                            <div className="absolute inset-14 bg-black rounded-full flex items-center justify-center border border-white/20 shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]">
                                <svg className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_10px_#67e8f9] animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500 uppercase tracking-[0.4em] mb-2 drop-shadow-lg">
                            Powered by Rao Pro Ai
                        </h2>
                        <p className="text-blue-400/60 font-mono text-xs tracking-widest uppercase">
                            How can I help you today?
                        </p>
                    </div>
                ) : (
                    <div className="max-w-5xl w-full mx-auto space-y-8">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"} group`}>

                                {msg.sender === "user" ? (
                                    <div className="relative flex flex-col items-end max-w-[85%]">

                                        {editingIndex === index ? (
                                            <div className="bg-gradient-to-br from-blue-900 to-black border border-cyan-500/50 p-4 shadow-[0_0_20px_rgba(6,182,212,0.2)] z-20 w-full min-w-[300px]">
                                                <textarea
                                                    value={editText}
                                                    onChange={(e) => setEditText(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter" && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handleEditSave(index);
                                                        } else if (e.key === "Escape") {
                                                            handleEditCancel();
                                                        }
                                                    }}
                                                    autoFocus
                                                    rows={Math.min(6, Math.max(2, editText.split("\n").length))}
                                                    className="w-full bg-transparent text-white resize-none outline-none text-[15px] leading-relaxed font-mono"
                                                />
                                                <div className="flex justify-end gap-3 mt-3 pt-3 border-t border-white/10">
                                                    <button onClick={handleEditCancel} className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                                                        Cancel
                                                    </button>
                                                    <button onClick={() => handleEditSave(index)} className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-black bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all">
                                                        Update Logic
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (

                                            <>
                                                <div className="px-6 py-4 bg-gradient-to-br from-blue-700 to-blue-900 border border-blue-400/40 text-white rounded-none shadow-[inset_0_1px_4px_rgba(255,255,255,0.4),0_8px_20px_rgba(29,78,216,0.3)] text-[16px] leading-relaxed tracking-wide z-10">
                                                    {msg.text}
                                                </div>

                                                {/* Action Bar*/}
                                                <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {/* Edit Button */}
                                                    <button onClick={() => onEditClick(msg.text, index)} className="text-gray-500 hover:text-blue-400 transition-colors p-1" title="Edit Message">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    {/* Copy Button */}
                                                    <button onClick={() => onCopyClick(msg.text, index)} className="text-gray-500 hover:text-cyan-400 transition-colors p-1" title="Copy Message">
                                                        {localCopiedIndex === index ? (
                                                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                        )}
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>



                                ) : msg.sender === "error" ? (
                                    <div className="max-w-[85%] px-6 py-4 bg-red-950/40 backdrop-blur-xl border border-red-500/50 text-red-400 rounded-none shadow-[inset_0_1px_2px_rgba(248,113,113,0.3)] text-[15px] flex items-center gap-3">
                                        <svg className="w-6 h-6 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <span className="tracking-wide font-mono">{msg.text}</span>
                                    </div>

                                ) : (
                                    <div className="relative flex flex-col items-start max-w-[90%]">

                                        <div className="px-6 py-5 bg-[#0f0f11]/80 backdrop-blur-2xl border border-white/10 text-gray-200 rounded-none shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                            <div className="prose prose-invert max-w-none whitespace-pre-wrap">
                                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                                            </div>
                                        </div>



                                        <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {/* 👇 Speaker Button 👇 */}
                                            {msg.sender !== "user" && (
                                                <button
                                                    onClick={() => speakText(msg.text)}
                                                    className="p-1.5 text-[#6b5a75] hover:text-[#d8b4fe] transition-colors"
                                                    title="Bol kar sunao"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                                                    </svg>
                                                </button>
                                            )}
                                            <button onClick={() => onCopyClick(msg.text, index)} className="text-gray-500 hover:text-cyan-400 transition-colors">
                                                {localCopiedIndex === index ? (
                                                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start items-center my-4 ml-2 w-full">
                                <div className="relative">

                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-transparent rounded-2xl rounded-bl-sm blur opacity-50"></div>

                                    {/* Main Chat Bubble */}
                                    <div className="relative flex items-center gap-1.5 px-5 py-3.5 bg-[#202124] rounded-2xl rounded-bl-sm border border-gray-700/50 shadow-xl shadow-black/20">
                                        {/* 3 Bouncing Dots */}
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}


                        <div ref={messagesEndRef} />
                    </div>
                )}
            </main>

            <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-20">
                <div className="max-w-5xl mx-auto flex items-end gap-3 bg-white/[0.03] backdrop-blur-3xl border border-white/20 p-2 rounded-none shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_10px_40px_rgba(0,0,0,0.9)] focus-within:border-cyan-500/50 focus-within:bg-blue-900/10 transition-all duration-300">

                    {/* Gallery Button */}
                    <input type="file" id="gemini-image-upload" accept="image/*" className="hidden" />
                    <label htmlFor="gemini-image-upload" className="p-3 text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-none transition-all cursor-pointer flex-shrink-0 border border-transparent hover:border-cyan-500/30">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </label>


                    {/* Text Input */}
                    <textarea
                        id="main-chat-input"
                        ref={inputRef}
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={`Transmit query to [${selectedAI || "KERNEL"}]...`}
                        className="w-full max-h-32 min-h-[52px] bg-transparent text-white placeholder-gray-600 resize-none outline-none py-3 px-4"
                        rows={1}
                        disabled={isLoading}
                    />


                    {/* Mic Button */}
                    <button className="p-3 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-none transition-all flex-shrink-0 border border-transparent hover:border-purple-500/30">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </button>

                    {/* Send Button */}
                    <button
                        onClick={handleSendMessage}
                        disabled={isLoading || prompt.trim() === ""}
                        className={`p-3 rounded-none flex-shrink-0 transition-all duration-300 border ${prompt.trim() !== "" && !isLoading
                            ? "bg-cyan-500/20 text-cyan-400 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:bg-cyan-500 hover:text-black"
                            : "bg-transparent text-gray-700 border-gray-800 cursor-not-allowed"
                            }`}
                    >
                        <svg className="w-6 h-6 translate-x-[1px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}