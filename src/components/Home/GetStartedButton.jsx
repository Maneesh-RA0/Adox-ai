import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function GetStartedButton({ children = "Get Started" }) {
    const navigate = useNavigate();
    const [isPressed, setIsPressed] = useState(false);

    const embers = [
        { left: '10%', delay: '0s', drift: '-10px', size: 'w-1 h-1' },
        { left: '25%', delay: '0.3s', drift: '8px', size: 'w-1.5 h-1.5' },
        { left: '42%', delay: '0.6s', drift: '-6px', size: 'w-1 h-1' },
        { left: '58%', delay: '0.15s', drift: '10px', size: 'w-1.5 h-1.5' },
        { left: '74%', delay: '0.5s', drift: '-8px', size: 'w-1 h-1' },
        { left: '90%', delay: '0.8s', drift: '6px', size: 'w-1.5 h-1.5' },
    ];

    return (
        <button
            onClick={() => navigate('/Select-ai')}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            onMouseLeave={() => setIsPressed(false)}
            className={
                "group rock-shake-hover relative inline-flex items-center justify-center px-10 py-5 md:px-14 md:py-6 " +
                "font-display font-bold text-lg md:text-xl tracking-wide text-white " +
                "rock-button transition-all duration-150 ease-out border border-black/40 " +
                (isPressed ? "translate-y-[10px] scale-[0.97]" : "translate-y-0 hover:brightness-110")
            }
            style={{
                borderRadius: '58% 42% 51% 49% / 45% 55% 40% 60%',
                backgroundImage: `
          radial-gradient(circle at 30% 20%, rgba(255,200,80,0.35), transparent 35%),
          radial-gradient(circle at 70% 75%, rgba(255,100,0,0.3), transparent 40%),
          linear-gradient(155deg, #2b2320 0%, #1a1512 40%, #100c0a 100%)
        `,
                boxShadow: isPressed
                    ? '0 0 18px 3px rgba(255,106,0,0.5), 0 4px 0 0 #2a0d02, 0 8px 12px rgba(0,0,0,0.5)'
                    : undefined,
            }}
        >
            <span
                className="rock-cracks pointer-events-none absolute inset-0"
                style={{
                    borderRadius: '58% 42% 51% 49% / 45% 55% 40% 60%',
                    backgroundImage: `
            linear-gradient(115deg, transparent 46%, rgba(255,180,50,0.9) 47%, rgba(255,90,0,0.9) 48%, transparent 49%),
            linear-gradient(25deg, transparent 62%, rgba(255,140,20,0.85) 63%, rgba(255,40,40,0.85) 64%, transparent 65%),
            linear-gradient(75deg, transparent 20%, rgba(255,200,80,0.7) 21%, transparent 22%)
          `,
                    mixBlendMode: 'screen',
                }}
            />
            <span
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                    borderRadius: '58% 42% 51% 49% / 45% 55% 40% 60%',
                    backgroundImage:
                        'radial-gradient(circle, rgba(0,0,0,0.5) 1px, transparent 1.5px)',
                    backgroundSize: '6px 6px',
                }}
            />
            <span className="pointer-events-none absolute inset-x-0 -top-3 h-6 overflow-visible opacity-60 group-hover:opacity-100 transition-opacity duration-200">
                {embers.map((e, i) => (
                    <span
                        key={i}
                        className={`ember absolute bottom-0 ${e.size} rounded-full bg-gradient-to-t from-yellow-300 to-orange-500 blur-[0.5px]`}
                        style={{ left: e.left, animationDelay: e.delay, '--drift': e.drift }}
                    />
                ))}
            </span>

            <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]">
                {children}
                <svg
                    className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </span>
        </button>
    );
}