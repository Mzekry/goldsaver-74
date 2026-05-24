import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LOGO_URL = '/app-icon.png';

export default function Splash() {
  const navigate = useNavigate();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stay = new URLSearchParams(window.location.search).has('stay');
    // Animate progress bar
    const timer = setTimeout(() => {
      if (progressRef.current) progressRef.current.style.width = '100%';
    }, 100);
    // Navigate to home after splash duration (unless ?stay is present)
    const nav = !stay ? setTimeout(() => navigate('/'), 2800) : null;
    return () => { clearTimeout(timer); if (nav) clearTimeout(nav); };
  }, [navigate]);

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0A1F44' }}
    >
      {/* Ambient background glows */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(212,175,55,0.15)' }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ backgroundColor: 'rgba(115,92,0,0.25)' }} />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center" style={{ animation: 'fadeInUp 1.2s cubic-bezier(0.22,1,0.36,1) forwards' }}>
        {/* Logo assembly */}
        <div className="relative mb-10">
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full scale-150 blur-xl"
            style={{ backgroundColor: 'rgba(212,175,55,0.15)', animation: 'pulseRing 4s ease-in-out infinite' }} />
          <div className="absolute inset-0 rounded-full blur-2xl"
            style={{ backgroundColor: 'rgba(212,175,55,0.08)', transform: 'scale(2)', animation: 'pulseRing 4s ease-in-out 1s infinite' }} />

          {/* Gold ring container */}
          <div
            className="relative w-32 h-32 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              border: '1.5px solid rgba(212,175,55,0.4)',
              boxShadow: '0 0 50px rgba(212,175,55,0.25)',
              backgroundColor: '#0A1F44',
              padding: '8px',
            }}
          >
            <div
              className="w-full h-full rounded-full flex items-center justify-center overflow-hidden"
              style={{ border: '1.5px solid #D4AF37' }}
            >
              <img src={LOGO_URL} alt="سجل الذهب" className="w-full h-full object-cover rounded-full" />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div className="text-center space-y-3">
          <h1
            className="font-bold tracking-tight"
            style={{
              fontSize: '2.25rem',
              lineHeight: '2.5rem',
              fontWeight: 800,
              background: 'linear-gradient(to bottom, #F9E29B 0%, #D4AF37 50%, #B38728 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            سجل الذهب
          </h1>
          <h2
            className="tracking-[0.2em] uppercase"
            style={{ fontSize: '1rem', color: '#e9c349', opacity: 0.85, fontWeight: 500 }}
          >
            Gold Wealth
          </h2>
        </div>
      </div>

      {/* Bottom tagline + progress */}
      <div
        className="absolute bottom-16 w-full flex flex-col items-center px-8"
        style={{ animation: 'fadeInUp 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s both' }}
      >
        {/* Divider line */}
        <div
          className="w-32 mb-2"
          style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.5), transparent)' }}
        />
        <p
          className="tracking-widest uppercase text-center mb-10"
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            background: 'linear-gradient(to bottom, #F9E29B 0%, #D4AF37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          تتبع مكسبك من استثماراتك في الذهب
        </p>
        {/* Progress bar */}
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(212,175,55,0.1)' }}>
          <div
            ref={progressRef}
            className="h-full rounded-full w-0"
            style={{
              backgroundColor: '#D4AF37',
              boxShadow: '0 0 10px rgba(212,175,55,0.5)',
              transition: 'width 2600ms ease-out',
            }}
          />
        </div>
      </div>

      {/* Floating gold particles */}
      <Particles />

      <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1.5);  opacity: 0.5; }
          50%  { transform: scale(1.55); opacity: 0.3; }
          100% { transform: scale(1.5);  opacity: 0.5; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatParticle {
          0%,100% { transform: translateY(0) translateX(0); }
          33%     { transform: translateY(-50px) translateX(20px); }
          66%     { transform: translateY(-20px) translateX(-30px); }
        }
      `}</style>
    </div>
  );
}

function Particles() {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    opacity: Math.random() * 0.35 + 0.05,
    duration: Math.random() * 10 + 10,
    delay: -(Math.random() * 5),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: '#D4AF37',
            borderRadius: '50%',
            opacity: p.opacity,
            left: `${p.x}%`,
            top: `${p.y}%`,
            filter: 'blur(1px)',
            animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
