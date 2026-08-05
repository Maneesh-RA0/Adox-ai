import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import GoogleAuthButton from './GoogleAuthButton';
import '../../styles/animations.css';

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
                navigate('/home');
            }
        };
        checkUser();
    }, [navigate]);

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const result = await authService.signInWithGoogle();
            if (result.success) {
                setUser(result.user);
                setTimeout(() => navigate('/home'), 500);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            </div>
            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-12 animate-fadeIn">
                    <h1 className="text-6xl font-bold mb-2">
                        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                            adox
                        </span>
                        <span className="text-blue-400">.ai</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Professional AI Suite</p>
                </div>
                <div className="bg-slate-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 border border-slate-700 shadow-2xl animate-slideInRight">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-slate-400 mb-8">Sign in with your Google account to continue</p>
                    <GoogleAuthButton onClick={handleGoogleSignIn} loading={loading} />
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-slate-600"></div>
                        <span className="px-3 text-slate-500 text-sm">or</span>
                        <div className="flex-1 border-t border-slate-600"></div>
                    </div>
                    <p className="text-xs text-slate-500 text-center">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>

                <div className="mt-12 grid grid-cols-3 gap-4 text-center">
                    {['🔒 Secure', '⚡ Fast', '🎯 Powerful'].map((feature, idx) => (
                        <div key={idx} className="text-slate-400 text-sm hover:text-blue-400 transition">
                            {feature}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}