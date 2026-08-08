import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/animations.css';
import ALLAiChatThemes from '../components/NormalChatTheme/ALLAiChatThemes';
import { auth } from '../services/firebaseConfig';
import { saveChatToDB, getUserChatHistory, getSpecificChat } from '../services/chatService';
import ChatHistoryMenu from '../components/ChatHistoryMenu';
import { onAuthStateChanged } from 'firebase/auth';
import { sendToLocalAI } from '../services/localAIService';



export default function ChatInterface() {
    const navigate = useNavigate();
    const location = useLocation();
    const activeAI = location.state?.selectedModel || { name: "RAO PRO AI" };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedAI, setSelectedAI] = useState(activeAI.name);
    const [prompt, setPrompt] = useState("");

    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Edit-related state
    const [editingIndex, setEditingIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [chatId, setChatId] = useState(null);
    const [historyList, setHistoryList] = useState([]);



    const BACKEND_URL = "https://adox-ai.onrender.com/api/chat";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const embers = useMemo(() => {
        return Array.from({ length: 22 }).map((_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: 2 + Math.random() * 4,
            duration: 6 + Math.random() * 8,
            delay: Math.random() * 10,
            drift: (Math.random() * 60 - 30).toFixed(0) + "px",
        }));
    }, []);


    const sendToAI = async (userMessage) => {


        if (!selectedAI || selectedAI === "[ENTER AI NAME HERE]" || selectedAI === "") {
            setMessages(prev => [...prev, {
                text: "⚠️ Access Denied: Kripya pichle page se ek valid AI model select karein.",
                sender: "error"
            }]);
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(BACKEND_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({

                    chatHistory: [...messages, { text: userMessage, sender: "user" }],
                    message: userMessage,
                    aiModel: selectedAI
                }),
            });


            if (!response.ok) {
                throw new Error(`Backend error: ${response.status}`);
            }

            const data = await response.json();
            const aiText = data.reply || "Sorry, mujhe samajh nahi aaya.";

            setMessages(prev => [...prev, { text: aiText, sender: "ai" }]);
        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                text: "Connection error. Backend server chal raha hai ya nahi check kar lo.",
                sender: "error"
            }]);
        } finally {
            setIsLoading(false);
        }
    };


    const handleSendMessage = async () => {
        if (prompt.trim() === "") return;
        const userMessage = prompt;
        setPrompt("");
        setMessages(prev => [...prev, { text: userMessage, sender: "user" }]);
        setIsLoading(true);

        try {
            let aiReply = "";
            if (selectedAI === "[RAO PRO AI]") {

                aiReply = await sendToLocalAI(userMessage, messages);

            } else {
                aiReply = await sendToAI(userMessage);
            }


            if (aiReply && aiReply.trim() !== "") {
                setMessages(prev => [...prev, { text: aiReply, sender: "ai" }]);
            } else {
                console.log("API se khali reply aaya, isliye faltu dabba block kar diya!");
            }

        } catch (error) {
            setMessages(prev => [...prev, { text: "Connection error. Backend check karo.", sender: "error" }]);
        } finally {

            setIsLoading(false);
        }
        setTimeout(() => document.getElementById("main-chat-input")?.focus(), 100);
    };


    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleCopy = async (text, index) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 1500);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    };

    const handleEditStart = (index, currentText) => {
        setEditingIndex(index);
        setEditText(currentText);
    };

    const handleEditCancel = () => {
        setEditingIndex(null);
        setEditText("");
    };

    const handleEditSave = async (index) => {
        const trimmed = editText.trim();
        if (trimmed === "") return;

        const isUserMessage = messages[index].sender === "user";

        if (isUserMessage) {
            const updatedMessages = messages.slice(0, index);
            updatedMessages.push({ text: trimmed, sender: "user" });
            setMessages(updatedMessages);
            setEditingIndex(null);
            setEditText("");
            await sendToAI(trimmed);
        } else {
            const updatedMessages = [...messages];
            updatedMessages[index] = { ...updatedMessages[index], text: trimmed };
            setMessages(updatedMessages);
            setEditingIndex(null);
            setEditText("");
        }
    };

    const handleEditKeyDown = (e, index) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleEditSave(index);
        } else if (e.key === "Escape") {
            handleEditCancel();
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const history = await getUserChatHistory(user.uid);
                setHistoryList(history);
            } else {
                setHistoryList([]);
            }
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        if (messages.length === 0 || !auth?.currentUser) return;

        const chatTitle = messages.find(m => m.sender === "user")?.text?.substring(0, 30) + "..." || "New Chat";

        let currentChatId = chatId;

        if (!currentChatId) {
            currentChatId = "chat_" + Date.now();
            setChatId(currentChatId);
            const newHistoryItem = {
                chatId: currentChatId,
                title: chatTitle,
                aiModel: selectedAI,
                updatedAt: new Date()
            };
            setHistoryList(prevList => [newHistoryItem, ...prevList]);
        }
        const timerId = setTimeout(() => {
            saveChatToDB(auth.currentUser.uid, currentChatId, selectedAI, messages, chatTitle)
                .catch(err => console.error("Save error:", err));
        }, 1000);

        return () => clearTimeout(timerId);

    }, [messages]);

    const handleStartNewChat = () => {
        setMessages([]);
        setChatId(null);
    };


    const handleResumeChat = async (selectedChatId) => {
        if (!auth?.currentUser) return;

        setMessages([]);
        setChatId(selectedChatId);

        try {
            const chatData = await getSpecificChat(auth.currentUser.uid, selectedChatId);
            if (chatData && chatData.messages) {
                setMessages(chatData.messages);
            }
        } catch (error) {
            console.error("Error resuming chat:", error);
        }
    };

    const handleDeleteChat = async (chatIdToDelete) => {
        if (!auth?.currentUser) return;

        setHistoryList(prev => prev.filter(chat => chat.chatId !== chatIdToDelete));
        if (chatId === chatIdToDelete) {
            setMessages([]);
            setChatId(null);
        }
    };
    const speakText = async (text) => {
        if (window.currentAudio && !window.currentAudio.paused) {
            console.log("⏳ Wait karo, pehle ki aawaz chal rahi hai...");
            return;
        }

        try {
            console.log("🔊 Backend se aawaz ban rahi hai, wait karo...");
            const response = await fetch("https://adox-ai.onrender.com/api/speak", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text: text }),
            });

            if (!response.ok) {
                console.error("❌ Aawaz generate nahi ho payi. Backend error.");
                return;
            }
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioUrl);
            window.currentAudio = audio;
            audio.play();
            console.log("▶️ Priyamvada ki asli aawaz play ho rahi hai!");
            audio.onended = () => {
                URL.revokeObjectURL(audioUrl);
            };

        } catch (error) {
            console.error("❌ Network ya Audio play error:", error);
        }
    };




    if (selectedAI.toUpperCase().includes("RAO PRO")) {
        return (

            <div className="flex flex-col h-screen bg-[#05030c] text-[#e6dcf5] font-['Rajdhani'] overflow-hidden relative selection:bg-[#8b2fd1]/30">

                <ChatHistoryMenu
                    chatHistory={historyList}
                    onNewChat={handleStartNewChat}
                    onSelectChat={handleResumeChat}
                />


                {/* Global Hellforge Effects */}
                <div className="obsidian-grid"></div>
                <div className="lava-vein vein-1"></div>
                <div className="lava-vein vein-2"></div>
                <div className="lava-vein vein-3"></div>
                <div className="lava-vein vein-4"></div>
                <div className="ember-layer" aria-hidden="true">
                    {embers.map((e) => (
                        <span
                            key={e.id}
                            className="ember-particle"
                            style={{
                                left: `${e.left}%`,
                                width: `${e.size}px`,
                                height: `${e.size}px`,
                                animationDuration: `${e.duration}s`,
                                animationDelay: `${e.delay}s`,
                                ['--drift']: e.drift,
                            }}
                        ></span>
                    ))}
                </div>

                {/* Header - Forged Obsidian Plate */}
                <header className="flex items-center justify-between px-6 py-4 relative z-50 bg-[#0b0716]/85 backdrop-blur-md border-b border-[#8b2fd1]/25 shadow-[0_5px_30px_rgba(0,0,0,0.6)]">
                    <button onClick={() => navigate("/Select-ai")} className="p-2 text-[#9a7ab0] hover:text-[#d8b4fe] hover:bg-[#6b21a8]/15 rounded-none border border-transparent hover:border-[#8b2fd1]/40 transition-all duration-300">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <div className="relative flex items-center justify-center">
                        <h1 className="font-['Share_Tech_Mono'] text-lg md:text-xl font-bold tracking-[0.3em] uppercase text-[#ecdcd6] drop-shadow-[0_0_12px_rgba(255,77,28,0.4)]">
                            {selectedAI}
                        </h1>
                    </div>
                    <div className="w-10"></div>
                </header>

                {/* Main Chat Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col relative z-10 scroll-smooth custom-scrollbar">
                    {messages.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-1000">

                            {/* Forge Core Sigil */}
                            <div className="forge-core-wrap">
                                <div className="forge-ring outer"></div>
                                <div className="forge-ring mid"></div>
                                <div className="forge-core"></div>
                            </div>

                            <h1 className="fire-text text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                                RAO PRO AI
                            </h1>
                            <p className="stamp-badge">
                                ◈ Rao Pro AI ◈
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-5xl w-full mx-auto space-y-8 pb-24">
                            {messages.map((msg, index) => (
                                <div key={index} className={"flex animate-in fade-in slide-in-from-bottom-4 duration-300 " + (msg.sender === "user" ? "justify-end" : "justify-start")}>
                                    <div className={"group relative max-w-[85%] md:max-w-[70%] flex flex-col " + (msg.sender === "user" ? "items-end" : "items-start")}>

                                        {editingIndex === index ? (
                                            <div className="edit-slab w-full min-w-[300px] p-1">
                                                <div className="bg-[#0b0716] p-3">
                                                    <textarea
                                                        value={editText}
                                                        onChange={(e) => setEditText(e.target.value)}
                                                        onKeyDown={(e) => handleEditKeyDown(e, index)}
                                                        autoFocus
                                                        rows={Math.min(6, Math.max(2, editText.split("\n").length))}
                                                        className="w-full bg-transparent text-[#e6dcf5] resize-none outline-none text-sm md:text-base leading-relaxed font-['Rajdhani']"
                                                    />
                                                    <div className="flex justify-end gap-3 mt-3 border-t border-[#8b2fd1]/20 pt-2">
                                                        <button onClick={handleEditCancel} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wide font-['Share_Tech_Mono'] text-[#a08ab5] hover:text-[#d8b4fe] hover:bg-[#6b21a8]/10 transition-colors">
                                                            Abort
                                                        </button>
                                                        <button onClick={() => handleEditSave(index)} className="px-4 py-1.5 text-xs font-bold uppercase tracking-wide font-['Share_Tech_Mono'] text-[#05030c] bg-gradient-to-r from-[#8b2fd1] to-[#6b21a8] hover:brightness-110 shadow-[0_0_15px_rgba(139,47,209,0.5)] transition-all">
                                                            {msg.sender === "user" ? "Transmit" : "Save Logic"}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                {/* chat bubblessss
                                            Hellforge Vibe */}
                                                <div className={"px-5 py-4 text-sm md:text-base leading-relaxed font-medium tracking-wide " + (
                                                    msg.sender === "user"
                                                        ? "chat-bubble-user text-white"
                                                        : msg.sender === "error"
                                                            ? "chat-bubble-error text-[#b983ff] font-['Share_Tech_Mono'] uppercase text-xs tracking-widest"
                                                            : "chat-bubble-ai text-[#e6dcf5]"
                                                )}>
                                                    {msg.sender === "error" ? "⚠ " + msg.text : msg.text}
                                                </div>

                                                {msg.sender !== "error" && (
                                                    <div className={"flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 " + (msg.sender === "user" ? "flex-row-reverse" : "flex-row")}>
                                                        <button onClick={() => handleEditStart(index, msg.text)} className="p-1.5 text-[#6b5a75] hover:text-[#8b2fd1] transition-colors">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button onClick={() => handleCopy(msg.text, index)} className="p-1.5 text-[#6b5a75] hover:text-[#7c1fd1] transition-colors">
                                                            {copiedIndex === index ? (
                                                                <svg className="w-4 h-4 text-[#d8b4fe] drop-shadow-[0_0_5px_#d8b4fe]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                            )}
                                                        </button>
                                                        {/*  Speaker Button   */}
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

                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Processing Animation */}
                            {isLoading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="chat-bubble-ai px-6 py-4 flex items-center gap-3">
                                        <div className="text-[#8b2fd1] font-['Share_Tech_Mono'] text-xs font-bold uppercase tracking-widest">Forging Reply</div>
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 rounded-full bg-[#8b2fd1] animate-bounce" style={{ animationDelay: "0ms" }}></div>
                                            <div className="w-2 h-2 rounded-full bg-[#6b21a8] animate-bounce" style={{ animationDelay: "150ms" }}></div>
                                            <div className="w-2 h-2 rounded-full bg-[#d8b4fe] animate-bounce" style={{ animationDelay: "300ms" }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </main>

                {/* HELLFORGE COMMAND CONSOLE */}
                <div className="p-4 md:p-6 max-w-4xl w-full mx-auto relative z-20">

                    <div className="console-slab relative flex items-end gap-2 p-2">
                        <span className="hud-corner tl"></span>
                        <span className="hud-corner tr"></span>
                        <span className="hud-corner bl"></span>
                        <span className="hud-corner br"></span>

                        <input type="file" id="image-upload" accept="image/*" className="hidden" />
                        <label htmlFor="image-upload" className="p-3.5 text-[#7a6690] hover:text-[#8b2fd1] hover:bg-[#6b21a8]/10 transition-all cursor-pointer flex-shrink-0">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                        </label>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={"Transmit message to " + selectedAI + "..."}
                            className="w-full max-h-40 min-h-[55px] bg-transparent text-[#e6dcf5] placeholder-[#6b5f78] resize-none outline-none py-4 px-2 text-base font-medium font-['Rajdhani']"
                            rows={1}
                            disabled={isLoading}
                        />

                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || prompt.trim() === ""}
                            className={"p-4 flex-shrink-0 transition-all duration-300 " + (prompt.trim() !== "" && !isLoading ? "bg-gradient-to-br from-[#8b2fd1] to-[#6b21a8] text-white shadow-[0_0_18px_rgba(139,47,209,0.6)] hover:brightness-110 hover:scale-105" : "bg-[#1c0f2e] text-[#453a52] cursor-not-allowed")}
                        >
                            <svg className="w-6 h-6 translate-x-[1px]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </button>
                    </div>

                    <div className="mt-4 flex justify-between items-center px-4">
                        <div className="text-[10px] font-['Share_Tech_Mono'] text-[#8b2fd1] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-[#8b2fd1] shadow-[0_0_8px_#8b2fd1] animate-pulse"></span>
                            Forge Link Secure
                        </div>
                        <p className="text-right text-[10px] font-['Share_Tech_Mono'] text-[#7c1fd1] uppercase tracking-widest">
                            Rao Pro AI Engine v3.0
                        </p>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <>
                <ALLAiChatThemes
                    selectedAI={selectedAI}
                    messages={messages}
                    speakText={speakText}
                    setPrompt={setPrompt}
                    prompt={prompt}
                    isLoading={isLoading}
                    handleSendMessage={handleSendMessage}
                    handleKeyPress={handleKeyPress}
                    historyList={historyList}
                    onNewChat={handleStartNewChat}
                    onSelectChat={handleResumeChat}
                    onDeleteChat={handleDeleteChat}
                />
            </>
        );
    }

}
