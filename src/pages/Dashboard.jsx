import { useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseConfig';
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import apiService from '../services/apiService';
import tokenManager from '../utils/tokenManager';
import '../styles/animations.css';

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [balance, setBalance] = useState(0);
    const [selectedModel, setSelectedModel] = useState('gpt-4o');
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState('');
    const [usage, setUsage] = useState([]);
    const [estimatedCost, setEstimatedCost] = useState('0');

    const AI_MODELS = [
        {
            id: 'gpt-4o',
            name: 'GPT-4o',
            provider: 'OpenAI',
            icon: '⚡',
            description: 'Most advanced model',
            costPerToken: 0.0015
        },
        {
            id: 'claude-3.5',
            name: 'Claude 3.5',
            provider: 'Anthropic',
            icon: '🧠',
            description: 'Long context & reasoning',
            costPerToken: 0.0012
        },
        {
            id: 'cursor-pro',
            name: 'Cursor Pro',
            provider: 'Cursor',
            icon: '💻',
            description: 'Code generation expert',
            costPerToken: 0.001
        },
        {
            id: 'github-copilot',
            name: 'GitHub Copilot',
            provider: 'GitHub',
            icon: '🚀',
            description: 'Development assistance',
            costPerToken: 0.0008
        }
    ];

    useEffect(() => {
        initializeDashboard();
    }, []);

    useEffect(() => {
        const estimated = tokenManager.estimateTokens(selectedModel, prompt);
        const cost = tokenManager.calculateCost(estimated);
        setEstimatedCost(cost);
    }, [prompt, selectedModel]);

    const initializeDashboard = async () => {
        try {
            const currentUser = auth.currentUser;
            setUser(currentUser);
            const balance = await apiService.getUserBalance();
            setBalance(balance);
            const usageRef = collection(db, 'users', currentUser.uid, 'usage');
            const q = query(usageRef, orderBy('timestamp', 'desc'), limit(10));
            const snapshot = await getDocs(q);
            const usageData = snapshot.docs.map(doc => doc.data());
            setUsage(usageData);
        } catch (error) {
            console.error('Dashboard init error:', error);
        }
    };

    const handleSendPrompt = async () => {
        if (!prompt.trim()) return;

        setLoading(true);
        try {
            const estimated = tokenManager.estimateTokens(selectedModel, prompt);

            if (balance < estimated) {
                alert('Insufficient tokens. Please purchase more tokens.');
                setLoading(false);
                return;
            }

            const result = await apiService.useTokens(selectedModel, prompt, estimated);

            if (result.success) {
                setResponse(result.response);
                setPrompt('');
                const newBalance = await apiService.getUserBalance();
                setBalance(newBalance);
                ''
                await initializeDashboard();
            } else {
                alert('Error: ' + result.error);
            }
        } catch (error) {
            console.error('Send prompt error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900 bg-opacity-90 backdrop-blur-md border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold">
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent font-bold">Rao pro AI's</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700">
                            <span className="text-slate-400 text-sm">Balance: </span>
                            <span className="text-blue-400 font-bold">{tokenManager.formatTokens(balance)}</span>
                        </div>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                            + Buy Tokens
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="pt-20 pb-8 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Get Started Button Section */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center py-10 mt-8">
                        <button
                            onClick={() => navigate('/chat')}
                            className="px-10 py-4 bg-cyan-500 hover:bg-cyan-400 text-white text-xl font-bold rounded-full transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.6)] flex items-center gap-3"
                        >
                            Get Started <span className="text-2xl">→</span>
                        </button>
                        <p className="text-slate-400 mt-4 text-sm">No credit card required. Try free for 7 days.</p>
                    </div>

                    {/* Quick Buy Tokens */}
                    <div className="mt-8 p-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg">
                        <h4 className="font-bold text-white mb-3">Quick Buy</h4>
                        <div className="space-y-2">
                            {tokenManager.getPricingPackages().map((pkg, idx) => (
                                <button
                                    key={idx}
                                    className="w-full py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded text-white text-sm transition"
                                >
                                    {tokenManager.formatTokens(pkg.tokens)} - ₹{pkg.price}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-2">
                {/* Chat Interface */}
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur-md rounded-xl border border-slate-700 overflow-hidden flex flex-col h-96">
                    {/* Response Display */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        {response ? (
                            <div className="space-y-4">
                                <div className="bg-slate-700 bg-opacity-50 p-4 rounded-lg">
                                    <p className="text-slate-300 text-sm mb-2">Your Prompt:</p>
                                    <p className="text-white">{prompt}</p>
                                </div>
                                <div className="bg-blue-600 bg-opacity-20 border border-blue-500 p-4 rounded-lg">
                                    <p className="text-blue-400 text-sm mb-2">Response:</p>
                                    <p className="text-white whitespace-pre-wrap">{response}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500">
                                <p>Select a model and enter a prompt to get started</p>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-slate-700 p-4 bg-slate-900 bg-opacity-50">
                        <div className="flex gap-3">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Enter your prompt..."
                                className="flex-1 bg-slate-700 text-white rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 border border-slate-600"
                                rows="3"
                            />
                            <button
                                onClick={handleSendPrompt}
                                disabled={loading || !prompt.trim()}
                                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed self-end"
                            >
                                {loading ? '⏳' : '✓ Send'}
                            </button>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm text-slate-400">
                            <span>Estimated cost: ₹{estimatedCost}</span>
                            <span>Model: {selectedModel}</span>
                        </div>
                    </div>
                </div>

                {/* Usage History */}
                <div className="mt-8">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Usage</h3>
                    <div className="space-y-2">
                        {usage.length > 0 ? (
                            usage.map((item, idx) => (
                                <div key={idx} className="bg-slate-800 bg-opacity-50 rounded-lg p-4 border border-slate-700 flex justify-between items-center">
                                    <div>
                                        <p className="text-white font-semibold">{item.model}</p>
                                        <p className="text-slate-400 text-sm">{item.tokensUsed} tokens • ₹{item.cost}</p>
                                    </div>
                                    <span className="text-slate-400 text-sm">{new Date(item.timestamp?.toDate()).toLocaleDateString()}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-500 text-center py-8">No usage history yet</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}