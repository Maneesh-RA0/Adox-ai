import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // 1. User check karna jab component load ho
    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await authService.getCurrentUser();
            if (currentUser) {
                setUser(currentUser);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await authService.signOut();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <div style={{ position: 'absolute', top: '24px', right: '40px', zIndex: 9999 }}>
            <div ref={dropdownRef} style={{ position: 'relative' }}>

                {/* PROFILE BUTTON */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        background: 'rgba(20, 20, 20, 0.6)',
                        color: '#ffffff',
                        padding: '10px 20px',
                        borderRadius: '50px',
                        border: '1px solid rgba(255, 75, 43, 0.3)',
                        cursor: 'pointer',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
                        fontSize: '15px',
                        fontWeight: '500',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <div style={{
                        width: '30px', height: '30px', borderRadius: '50%',
                        background: 'linear-gradient(45deg, #ff4b2b, #ff416c)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 'bold', fontSize: '14px'
                    }}>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>

                    <span style={{ letterSpacing: '0.5px' }}>
                        {user.displayName || user.email.split('@')[0]}
                    </span>

                    <span style={{
                        fontSize: '10px',
                        transition: 'transform 0.3s',
                        transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}>
                        ▼
                    </span>
                </button>

                {isDropdownOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '60px',
                        right: '0',
                        width: '200px',
                        background: 'rgba(15, 15, 15, 0.85)',
                        border: '1px solid rgba(255, 75, 43, 0.2)',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0px 10px 30px rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(16px)',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>

                        <div style={{ padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: '#888' }}>Logged in as</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '14px', fontWeight: 'bold', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                @{user.email.split('@')[0]}
                            </p>
                        </div>

                        <div style={{ padding: '8px' }}>

                            <div style={{
                                padding: '10px 12px', color: '#aaa', fontSize: '14px',
                                cursor: 'pointer', borderRadius: '8px', marginBottom: '4px'
                            }}>
                                👤 My Profile
                            </div>
                            <div style={{
                                padding: '10px 12px', color: '#aaa', fontSize: '14px',
                                cursor: 'pointer', borderRadius: '8px', marginBottom: '4px'
                            }}>
                                ⚙️ Settings
                            </div>

                            {/* LOGOUT BUTTON */}
                            <button
                                onClick={handleLogout}
                                style={{
                                    width: '100%', textAlign: 'left', padding: '10px 12px',
                                    background: 'rgba(255, 75, 43, 0.1)', color: '#ff4b2b',
                                    fontSize: '14px', border: 'none', cursor: 'pointer',
                                    fontWeight: 'bold', borderRadius: '8px', display: 'flex', gap: '10px'
                                }}
                            >
                                <span>🚪</span> Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
