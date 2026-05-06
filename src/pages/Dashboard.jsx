import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Clock, ShieldAlert, Activity, FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import TrustScore from '../components/TrustScore';
import { legalDatabase } from '../utils/LegalDatabase';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: legalDatabase.length,
    pending: 12,
    critical: 4,
    verified: 68
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      style={{ padding: '2.5rem', maxWidth: '1400px', margin: '0 auto' }}
    >
      <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em' }}>
            GovTrust Intelligence <span style={{ color: 'var(--primary)', fontWeight: '400' }}>Dashboard</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.1rem' }}>
            Real-time monitoring of Bharat's judicial directives and department execution.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Activity size={18} color="var(--success)" className="animate-pulse" />
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>System Status: Operational</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Judgments Logged" value={stats.total} icon={<FileText size={24} color="var(--primary)" />} delay={0} />
        <StatCard title="Pending Actions" value={stats.pending} icon={<Clock size={24} color="var(--warning)" />} delay={0.1} />
        <StatCard title="Critical Alerts" value={stats.critical} icon={<ShieldAlert size={24} color="var(--danger)" />} delay={0.2} />
        <StatCard title="Department Verified" value={`${stats.verified}%`} icon={<CheckCircle2 size={24} color="var(--success)" />} delay={0.3} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Left Side: Trust Engine & Dept Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="var(--primary)" />
              AI Trust & Integrity Engine
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <TrustScore />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
                <ProgressBar label="Police Verification Accuracy" progress={92} color="var(--primary)" />
                <ProgressBar label="Revenue Dept Compliance" progress={78} color="var(--success)" />
                <ProgressBar label="Financial Registry Integrity" progress={95} color="var(--warning)" />
              </div>
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Recent Judiciary Directives</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {legalDatabase.slice(0, 3).map((item, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.5rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '8px' }}>
                       <FileText size={18} color="var(--primary)" />
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>{item.caseId}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.title}</p>
                    </div>
                  </div>
                  <span className="badge badge-police" style={{ fontSize: '0.7rem' }}>{item.tags[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Live Alerts */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Live Fraud Alerts</h3>
            <span className="status-pill red animate-pulse">LIVE</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <UrgentItem title="UBID Mismatch Detected" time="2 mins ago" type="danger" caseId="CWJC-1024" />
            <UrgentItem title="Duplicate Registry Entry" time="15 mins ago" type="warning" caseId="LPA-3088" />
            <UrgentItem title="Signature Verification Failed" time="45 mins ago" type="danger" caseId="SLP-4100" />
            <UrgentItem title="High Court Stay Overridden" time="1h ago" type="warning" caseId="CWJC-5001" />
          </div>
          
          <button className="btn btn-outline" style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}>
            View Full Security Log
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ title, value, icon, delay }) {
  return (
    <motion.div 
      className="glass-panel" 
      style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}
      animate={{ y: [-5, 5, -5] }}
      transition={{ 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut",
        delay: delay 
      }}
      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(99, 102, 241, 0.4)" }}
    >
      <div style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.1)' }}>
        {icon}
      </div>
      <div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: '500' }}>{title}</p>
        <p style={{ fontSize: '1.75rem', fontWeight: 'bold', marginTop: '0.25rem', color: '#fff' }}>{value}</p>
      </div>
    </motion.div>
  );
}

function ProgressBar({ label, progress, color }) {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
        <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{progress}%</span>
      </div>
      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ height: '100%', background: color, boxShadow: `0 0 10px ${color}` }} 
        />
      </div>
    </div>
  );
}

function UrgentItem({ title, time, type, caseId }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ marginTop: '0.25rem' }}>
        <AlertCircle size={16} color={type === 'danger' ? 'var(--danger)' : 'var(--warning)'} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>{title}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Case: {caseId}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{time}</span>
        </div>
      </div>
    </div>
  );
}
