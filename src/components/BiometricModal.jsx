import React, { useState, useEffect } from 'react';
import { Fingerprint, CheckCircle, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BiometricModal({ onSuccess, onCancel, action }) {
  const [status, setStatus] = useState('idle'); // idle, scanning, verified
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (status === 'scanning') {
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(interval);
            setStatus('verified');
            return 100;
          }
          return p + 2; // Roughly 5 seconds total at 100ms interval
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [status]);

  const handleStartScan = () => {
    setStatus('scanning');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-panel animate-fade-in" style={{
        padding: '2.5rem', borderRadius: 'var(--radius-xl)',
        width: '100%', maxWidth: '420px', position: 'relative',
        textAlign: 'center', border: `1px solid ${status === 'verified' ? 'var(--success)' : 'rgba(212, 175, 55, 0.4)'}`,
        boxShadow: status === 'verified' ? '0 0 40px rgba(16, 185, 129, 0.2)' : '0 0 40px rgba(212, 175, 55, 0.2)'
      }}>
        <button 
          onClick={onCancel}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
        >
          <X size={20} />
        </button>

        <ShieldCheck size={40} color="#D4AF37" style={{ marginBottom: '1rem' }} />
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#fff' }}>
          Biometric Authorization
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2.5rem' }}>
          Officer Identity Verification for Action #{action?.ubid?.split('-').pop()}
        </p>

        {/* Biometric Scanner */}
        <div 
          onClick={status === 'idle' ? handleStartScan : undefined}
          style={{
            width: '120px', height: '120px', margin: '0 auto 2rem',
            borderRadius: '24px', 
            border: `2px solid ${status === 'verified' ? 'var(--success)' : (status === 'scanning' ? '#D4AF37' : 'rgba(255,255,255,0.1)')}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: status === 'idle' ? 'pointer' : 'default',
            position: 'relative', transition: 'all 0.3s',
            background: 'rgba(15, 23, 42, 0.5)',
            boxShadow: status === 'scanning' ? '0 0 20px rgba(212, 175, 55, 0.3)' : 'none'
          }}
        >
          <AnimatePresence mode="wait">
            {status === 'verified' ? (
              <motion.div key="success" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <CheckCircle size={60} color="var(--success)" />
              </motion.div>
            ) : (
              <motion.div key="fingerprint" initial={{ opacity: 0.5 }} animate={{ opacity: status === 'scanning' ? [0.4, 1, 0.4] : 1 }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Fingerprint size={64} color={status === 'scanning' ? "#D4AF37" : "rgba(255,255,255,0.3)"} />
              </motion.div>
            )}
          </AnimatePresence>

          {status === 'scanning' && (
            <motion.div 
              style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: '2px',
                background: '#D4AF37', boxShadow: '0 0 15px #D4AF37'
              }}
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            />
          )}
        </div>

        <div style={{ marginBottom: '2.5rem' }}>
          {status === 'idle' && (
            <p style={{ color: '#D4AF37', fontWeight: '600', animation: 'pulse 2s infinite' }}>TAP SENSOR TO SCAN</p>
          )}
          {status === 'scanning' && (
            <>
              <p style={{ color: '#fff', fontWeight: '700', fontSize: '1.1rem' }}>Scanning Fingerprint...</p>
              <div style={{ width: '60%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', margin: '0.75rem auto', overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: '#D4AF37', transition: 'width 0.1s linear' }} />
              </div>
            </>
          )}
          {status === 'verified' && (
            <p style={{ color: 'var(--success)', fontWeight: '700', fontSize: '1.1rem' }}>Identity Verified</p>
          )}
        </div>

        <button 
          className="btn btn-primary"
          disabled={status !== 'verified'}
          onClick={onSuccess}
          style={{ 
            width: '100%', justifyContent: 'center', padding: '1rem',
            background: status === 'verified' ? 'var(--success)' : 'rgba(255,255,255,0.05)',
            border: 'none', color: status === 'verified' ? '#fff' : 'rgba(255,255,255,0.2)',
            opacity: status === 'verified' ? 1 : 0.5,
            cursor: status === 'verified' ? 'pointer' : 'not-allowed'
          }}
        >
          Confirm Authorization
        </button>
      </div>
    </div>
  );
}
