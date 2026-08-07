import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './services/firebaseConfig';
import Login from './pages/Login';
import HomeScreen from './components/Home/HomeScreen';
import ChatInterface from './pages/ChatInterface';
import './styles/globals.css';
import './styles/animations.css';
import './styles/darkTheme.css';
import AISelection from './pages/AISelection';

function ProtectedRoute({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-500 font-semibold">Loading...</p>
                </div>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomeScreen />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatInterface />
                        </ProtectedRoute>
                    }
                />
                <Route path="/" element={<Navigate to="/home" />} />
                <Route
                    path="/select-ai"
                    element={
                        <ProtectedRoute>
                            <AISelection />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}