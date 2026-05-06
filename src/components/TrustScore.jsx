import React, { useEffect, useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';

export default function TrustScore({ score = 94, isAnimating = true }) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    if (isAnimating) {
      let start = 0;
      const end = score;
      const duration = 2000;
      const increment = end / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setDisplayScore(end);
          clearInterval(timer);
        } else {
          setDisplayScore(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    } else {
      setDisplayScore(score);
    }
  }, [score, isAnimating]);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;
  
  let statusColor = 'var(--success)';
  if (displayScore < 85) statusColor = 'var(--warning)';
  if (displayScore < 70) statusColor = 'var(--danger)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Background track */}
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <circle 
            cx="80" cy="80" r={radius} 
            fill="none" 
            stroke="rgba(255, 255, 255, 0.05)" 
            strokeWidth="12" 
          />
          {/* Progress stroke */}
          <circle 
            cx="80" cy="80" r={radius} 
            fill="none" 
            stroke={statusColor} 
            strokeWidth="12" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.1s ease', filter: `drop-shadow(0 0 8px ${statusColor})` }}
          />
        </svg>
        
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          {displayScore >= 85 ? (
            <ShieldCheck size={28} color={statusColor} style={{ marginBottom: '0.25rem' }} />
          ) : (
            <ShieldAlert size={28} color={statusColor} style={{ marginBottom: '0.25rem' }} />
          )}
          <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#fff', lineHeight: '1' }}>
            {displayScore}<span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>%</span>
          </span>
        </div>
      </div>
      
      <div style={{ marginTop: '1rem', width: '100%', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#fff' }}>System Trust Level</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
          Based on UBID matching & Signature Verification
        </p>
      </div>

      <div style={{ width: '100%', marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Data Integrity</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>98%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
          <div style={{ width: '98%', height: '100%', background: 'var(--success)', borderRadius: '2px', boxShadow: '0 0 5px var(--success)' }}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Source Verification</span>
          <span style={{ color: '#fff', fontWeight: '600' }}>92%</span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px' }}>
          <div style={{ width: '92%', height: '100%', background: 'var(--success)', borderRadius: '2px', boxShadow: '0 0 5px var(--success)' }}></div>
        </div>
      </div>
    </div>
  );
}
