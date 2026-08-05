import React, { useRef, useState } from 'react';
import GetStartedButton from './GetStartedButton';
import '../../styles/animations.css';
import Navbar from '../Layout/Navbar';

export default function HomeScreen() {
  const panelRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handlePanelMove = (e) => {
    const el = panelRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -5, y: px * 7 });
  };

  const handlePanelLeave = () => setTilt({ x: 0, y: 0 });

  const models = [
    { icon: 'sparkle', name: 'Claude 3.5', color: '#2dd4ee', radius: 58, duration: 15, delay: -3, dir: 'spinCW' },
    { icon: 'bolt', name: 'GPT-4o', color: '#8b5cf6', radius: 58, duration: 15, delay: -11, dir: 'spinCW' },
    { icon: 'brackets', name: 'Cursor Pro', color: '#f5b74e', radius: 94, duration: 24, delay: -6, dir: 'spinCCW' },
    { icon: 'chip', name: 'Copilot', color: '#7dd3fc', radius: 94, duration: 24, delay: -18, dir: 'spinCCW' },
  ];

  const dust = Array.from({ length: 26 }).map((_, i) => ({
    top: `${(i * 37) % 100}%`,
    left: `${(i * 53) % 100}%`,
    delay: `${(i % 10) * 0.4}s`,
    size: i % 6 === 0 ? 2 : 1,
  }));

  const ChipIcon = () => (
    <svg viewBox="0 0 24 24" className="h-6 w-6 md:h-7 md:w-7" fill="none">
      <defs>
        <linearGradient id="chipGrad" x1="0" y1="0" x2="24" y2="24">
          <stop offset="0%" stopColor="#2dd4ee" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#f5b74e" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="18" height="18" rx="4.5" stroke="url(#chipGrad)" strokeWidth="1.3" />
      <path d="M8 3v18M16 3v18M3 8h18M3 16h18" stroke="url(#chipGrad)" strokeWidth="0.8" opacity="0.45" />
      <circle cx="12" cy="12" r="2.2" fill="url(#chipGrad)" />
    </svg>
  );

  const NodeIcon = ({ type, color }) => {
    const common = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none' };
    if (type === 'sparkle') {
      return (
        <svg {...common}>
          <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z" fill={color} />
        </svg>
      );
    }
    if (type === 'bolt') {
      return (
        <svg {...common}>
          <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8z" fill={color} />
        </svg>
      );
    }
    if (type === 'brackets') {
      return (
        <svg {...common} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="8 6 2 12 8 18" />
          <polyline points="16 6 22 12 16 18" />
        </svg>
      );
    }
    return (
      <svg {...common} stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.5 4.5l2 2M17.5 17.5l2 2M19.5 4.5l-2 2M6.5 17.5l-2 2" />
      </svg>
    );
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050508] font-['Inter']">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        @keyframes gridDrift { from { background-position: 0 0; } to { background-position: 0 64px; } }
        @keyframes orbFloatA { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(46px,-34px) scale(1.08); } }
        @keyframes orbFloatB { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-38px,28px) scale(1.06); } }
        @keyframes orbFloatC { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(20px,30px) scale(1.05); } }
        @keyframes laserSweep {
          0% { transform: translateX(-130%) rotate(7deg); opacity: 0; }
          6% { opacity: .5; }
          22% { opacity: 0; }
          100% { transform: translateX(230%) rotate(7deg); opacity: 0; }
        }
        @keyframes corePulse {
          0%, 100% { box-shadow: 0 0 18px 3px rgba(45,212,238,.45), 0 0 54px 18px rgba(139,92,246,.22); }
          50% { box-shadow: 0 0 26px 6px rgba(45,212,238,.7), 0 0 82px 26px rgba(139,92,246,.38); }
        }
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinCCW { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
        @keyframes floatPanel { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes shimmerGrad { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        @keyframes badgeBlink { 0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px rgba(245,183,78,.8); } 50% { opacity: .35; box-shadow: 0 0 2px 0 rgba(245,183,78,.25); } }
        @keyframes rimShine { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        @keyframes twinkleDust { 0%, 100% { opacity: .15; } 50% { opacity: .9; } }

        .shimmer-text {
          background-image: linear-gradient(90deg, #2dd4ee, #8b5cf6 35%, #f5b74e 65%, #2dd4ee);
          background-size: 260% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmerGrad 7s ease-in-out infinite;
          text-shadow: 0 0 36px rgba(139,92,246,.3);
        }
        .rim-border {
          background-image: linear-gradient(115deg, rgba(45,212,238,.55), rgba(139,92,246,.4) 35%, rgba(245,183,78,.4) 70%, rgba(45,212,238,.55));
          background-size: 300% 100%;
          animation: rimShine 11s linear infinite;
        }
        .horizon-grid {
          background-image:
            linear-gradient(rgba(139,148,255,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,148,255,0.14) 1px, transparent 1px);
          background-size: 64px 64px;
          animation: gridDrift 9s linear infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ambient base gradient */}
      <div
        className="absolute inset-0"
        style={{ background: 'radial-gradient(circle at 50% 0%, #10132a 0%, #07070c 55%, #050508 100%)' }}
      />

      {/* drifting nebula glows one per linked model color */}
      <div
        className="pointer-events-none absolute -top-40 -left-32 h-[36rem] w-[36rem] rounded-full opacity-30 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #2dd4ee, transparent 70%)', animation: 'orbFloatA 16s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute top-1/4 -right-32 h-[32rem] w-[32rem] rounded-full opacity-25 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 70%)', animation: 'orbFloatB 19s ease-in-out infinite' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full opacity-20 blur-[130px]"
        style={{ background: 'radial-gradient(circle, #f5b74e, transparent 70%)', animation: 'orbFloatC 22s ease-in-out infinite' }}
      />

      {/* control deck horizon grid */}
      <div
        className="horizon-grid pointer-events-none absolute inset-x-0 bottom-0 h-[45vh] opacity-[0.35] [mask-image:linear-gradient(to_top,black,transparent)]"
        style={{ transform: 'perspective(600px) rotateX(62deg)', transformOrigin: 'bottom' }}
      />

      {/* laser sweep */}
      <div
        className="pointer-events-none absolute top-0 left-0 h-[160%] w-[3px] bg-gradient-to-b from-transparent via-cyan-300/70 to-transparent"
        style={{ animation: 'laserSweep 9s ease-in-out infinite', filter: 'blur(1px)' }}
      />

      {/* fine dust field */}
      <div className="pointer-events-none absolute inset-0">
        {dust.map((d, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ top: d.top, left: d.left, width: d.size, height: d.size, animation: `twinkleDust 3.5s ease-in-out infinite`, animationDelay: d.delay }}
          />
        ))}
      </div>

      <div className="relative z-30">
        <Navbar />
      </div>

      <main className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center md:px-16">
        <div className="relative mx-auto mb-8 h-[190px] w-[190px] md:h-[250px] md:w-[250px]" style={{ animation: 'floatPanel 7s ease-in-out infinite' }}>
          <div className="absolute left-1/2 top-1/2 h-[116px] w-[116px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07] md:h-[122px] md:w-[122px]" />
          <div className="absolute left-1/2 top-1/2 h-[188px] w-[188px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05] md:h-[198px] md:w-[198px]" />

          <div
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.09] to-white/[0.01] backdrop-blur-md md:h-16 md:w-16"
            style={{ animation: 'corePulse 4s ease-in-out infinite' }}
          >
            <ChipIcon />
          </div>

          {models.map((m, i) => {
            const counterDir = m.dir === 'spinCW' ? 'spinCCW' : 'spinCW';
            return (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: m.radius * 2,
                  height: m.radius * 2,
                  animation: `${m.dir} ${m.duration}s linear infinite`,
                  animationDelay: `${m.delay}s`,
                }}
              >
                <div
                  className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                  style={{ animation: `${counterDir} ${m.duration}s linear infinite`, animationDelay: `${m.delay}s` }}
                >
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-md md:h-10 md:w-10"
                    style={{ borderColor: `${m.color}55`, background: 'rgba(8,10,20,0.7)', boxShadow: `0 0 14px 1px ${m.color}66` }}
                  >
                    <NodeIcon type={m.icon} color={m.color} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 font-['JetBrains_Mono'] text-xs tracking-[0.2em] text-slate-400 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5b74e]" style={{ animation: 'badgeBlink 2.4s ease-in-out infinite' }} />
          ONE WALLET · ALL MODELS
        </div>
        <div className="rim-border w-full max-w-3xl rounded-[28px] p-[1.5px] shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
          <div
            ref={panelRef}
            onMouseMove={handlePanelMove}
            onMouseLeave={handlePanelLeave}
            className="rounded-[27px] border border-white/[0.06] bg-[#08090f]/80 px-6 py-12 backdrop-blur-2xl md:px-14 md:py-16"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: 'transform 350ms ease-out',
            }}
          >
            <h1 className="font-['Space_Grotesk'] text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-6xl">
              All Premium Pro AIs
              <br />
              <span className="shimmer-text bg-clip-text text-transparent">One Single Wallet</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl font-['Inter'] text-base leading-relaxed text-slate-400 md:text-lg">
              Experience the apex of artificial intelligence. Access Claude 3.5, GPT-4o, Cursor Pro, and GitHub Copilot
              through a single, unified interface. Unleash seamless power with transparent UPI pricing.
            </p>

            <div className="mt-10 flex justify-center">
              <GetStartedButton />
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 border-t border-white/[0.06] pt-6">
              {models.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 font-['JetBrains_Mono'] text-[11px] uppercase tracking-wider text-slate-500">
                  <span className="h-1 w-1 rounded-full" style={{ background: m.color, boxShadow: `0 0 5px 1px ${m.color}` }} />
                  {m.name}
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="pointer-events-none absolute bottom-6 left-6 hidden items-center gap-2 font-['JetBrains_Mono'] text-[10px] tracking-[0.15em] text-slate-600 md:flex">
          <span className="h-1 w-1 rounded-full bg-[#2dd4ee]" style={{ animation: 'badgeBlink 2.4s ease-in-out infinite' }} />
          SECURE CHANNEL · UPI
        </div>
        <div className="pointer-events-none absolute bottom-6 right-6 hidden font-['JetBrains_Mono'] text-[10px] tracking-[0.15em] text-slate-600 md:flex">
          04 MODELS LINKED
        </div>
      </main>
    </div>
  );
}