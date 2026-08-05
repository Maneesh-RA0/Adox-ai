import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function ChatHistoryMenu({ chatHistory, onNewChat, onSelectChat, onDeleteChat }) {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSubMenu, setActiveSubMenu] = useState(null);

    const [lockedChats, setLockedChats] = useState(() => {
        const saved = localStorage.getItem('lockedChats');
        return saved ? JSON.parse(saved) : {};
    });

    const [lockSetup, setLockSetup] = useState(null);
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const pass1Ref = useRef(null);

    const [unlockPrompt, setUnlockPrompt] = useState(null);
    const [unlockPass, setUnlockPass] = useState("");
    const unlockRef = useRef(null);


    useEffect(() => {
        if (lockSetup) {
            const t = setTimeout(() => pass1Ref.current?.focus(), 30);
            return () => clearTimeout(t);
        }
    }, [lockSetup]);

    useEffect(() => {
        if (unlockPrompt) {
            if (setActiveSubMenu) setActiveSubMenu(null);

            const t = setTimeout(() => {
                if (unlockRef.current) {
                    unlockRef.current.focus();
                    unlockRef.current.select();
                }
            }, 100);

            return () => clearTimeout(t);
        }
    }, [unlockPrompt]);



    useEffect(() => {
        if (!isOpen) {
            setActiveSubMenu(null);
        }
    }, [isOpen]);

    const handleSetLock = () => {
        if (!pass1 || !pass2) return alert("Password daalna zaroori hai! ⚠️");
        if (pass1 !== pass2) return alert("Password match nahi ho rahe! ❌");
        const newLocks = { ...lockedChats, [lockSetup]: pass1 };
        setLockedChats(newLocks);
        localStorage.setItem('lockedChats', JSON.stringify(newLocks));
        setLockSetup(null); setPass1(""); setPass2("");
        alert("Lock set successfully! 🔒");
    };

    const handleUnlock = () => {
        if (unlockPass === lockedChats[unlockPrompt]) {
            onSelectChat(unlockPrompt);
            setUnlockPrompt(null);
            setUnlockPass("");
        } else {
            alert("Galat Password! Chat nahi khulegi. ❌");
        }
    };

    return (
        <>
            <div className="absolute top-3 right-6 z-[9999]">
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-white bg-black/50 border border-gray-600 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.6)] hover:shadow-[0_0_20px_rgba(0,255,255,0.9)] hover:border-cyan-400 transition-all duration-300">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-3 w-72 bg-[#1e1e24]/95 backdrop-blur-md border border-cyan-500/30 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                        <button onClick={() => { onNewChat(); setIsOpen(false); }} className="w-full text-left px-5 py-4 text-sm text-cyan-400 font-bold hover:bg-cyan-500/10 border-b border-gray-700/50">
                            + Start New Chat
                        </button>
                        <div className="overflow-y-auto py-2 flex-1">
                            {chatHistory && chatHistory.map((chat) => (
                                <div key={chat.chatId} className="relative flex items-center border-b border-gray-800/30 group">
                                    <button
                                        onClick={() => {
                                            if (lockedChats[chat.chatId]) {
                                                setUnlockPrompt(chat.chatId);
                                                setIsOpen(false);
                                            } else {
                                                onSelectChat(chat.chatId);
                                                setIsOpen(false);
                                            }
                                        }}
                                        className="flex-1 text-left px-5 py-3 text-sm text-gray-300 hover:bg-gray-700/50 truncate flex justify-between"
                                    >
                                        <span className="truncate">💬 {chat.title || "New Chat"}</span>
                                        {lockedChats[chat.chatId] && <span>🔒</span>}
                                    </button>
                                    <button onClick={(e) => { e.stopPropagation(); setActiveSubMenu(activeSubMenu === chat.chatId ? null : chat.chatId); }} className="p-3 text-gray-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                    </button>
                                    {activeSubMenu === chat.chatId && (
                                        <div className="absolute right-12 top-8 bg-[#2a2a35] border border-gray-600 rounded-md shadow-2xl z-[99999] w-32">
                                            <button onClick={(e) => { e.stopPropagation(); if (onDeleteChat) onDeleteChat(chat.chatId); setActiveSubMenu(null); }} className="w-full text-left px-4 py-2 text-red-400">🗑️ Delete</button>
                                            {!lockedChats[chat.chatId] && (
                                                <button onClick={(e) => { e.stopPropagation(); setLockSetup(chat.chatId); setActiveSubMenu(null); setIsOpen(false); }} className="w-full text-left px-4 py-2 text-yellow-400">🔒 Lock Chat</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>


            {lockSetup && createPortal(
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 2147483647, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}
                >
                    <div
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{ backgroundColor: '#1e1e24', padding: '24px', borderRadius: '12px', width: '320px', border: '1px solid #06b6d4' }}
                    >
                        <h3 className="text-cyan-400 font-bold text-center mb-4">Set Lock Password</h3>
                        <input ref={pass1Ref} autoFocus type="password" placeholder="Enter Password" value={pass1} onChange={(e) => setPass1(e.target.value)} className="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-3 outline-none focus:border-cyan-400" />
                        <input type="password" placeholder="Confirm Password" value={pass2} onChange={(e) => setPass2(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleSetLock(); }} className="w-full bg-black/50 border border-gray-600 rounded p-3 text-white mb-4 outline-none focus:border-cyan-400" />
                        <div className="flex gap-3">
                            <button onClick={() => { setLockSetup(null); setPass1(""); setPass2(""); }} className="flex-1 py-2 rounded bg-gray-700 text-white font-bold">Cancel</button>
                            <button onClick={handleSetLock} className="flex-1 py-2 rounded bg-cyan-600 text-white font-bold">Save</button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {unlockPrompt && createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 2147483647,
                        backgroundColor: 'rgba(0, 0, 0, 0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        pointerEvents: 'auto'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        style={{
                            backgroundColor: '#1e1e24',
                            padding: '24px',
                            borderRadius: '12px',
                            width: '320px',
                            border: '1px solid #eab308',
                            position: 'relative',
                            zIndex: 2147483647
                        }}
                    >
                        <h3 className="text-yellow-400 font-bold text-center mb-4">🔒 Chat is Locked</h3>
                        <input
                            ref={unlockRef}
                            type="password"
                            placeholder="Enter Password to Unlock"
                            value={unlockPass}
                            onChange={(e) => setUnlockPass(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                            onClick={(e) => {
                                e.stopPropagation();
                                unlockRef.current?.focus();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            style={{ pointerEvents: 'auto' }}
                            className="w-full bg-gray-800 text-white p-2 rounded border border-gray-700 mb-4 focus:outline-none focus:border-yellow-500 relative z-[2147483647]"
                        />

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setUnlockPrompt(null); setUnlockPass(""); }}
                                className="flex-1 py-2 rounded bg-gray-700 text-white font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnlock}
                                className="flex-1 py-2 rounded bg-yellow-600 text-black font-bold"
                            >
                                Unlock
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}


        </>
    );
}