import React, { useState, useContext, useEffect } from 'react';
import { ExternalLink, ShieldCheck, AlertTriangle, ChevronRight, Cpu, ChevronDown, Clock } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence, LayoutGroup } from 'framer-motion';
import { LanguageContext } from '../App';
import { calculateLimitationDate } from '../utils/legalLogic';

// Mini Radial Gauge for Trust Meter
function MiniConfidenceGauge({ score }) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  
  let color = 'var(--success)';
  if (score < 90) color = 'var(--warning)';
  if (score < 70) color = 'var(--danger)';

  return (
    <div style={{ position: 'relative', width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="28" height="28" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="14" cy="14" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
        <circle 
          cx="14" cy="14" r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
        />
      </svg>
      <span style={{ position: 'absolute', fontSize: '0.6rem', fontWeight: 'bold', color: '#fff' }}>{score}</span>
    </div>
  );
}

export default function ActionCard({ action, onSourceClick, onApprove }) {
  const [showExplanation, setShowExplanation] = useState(false);
  const { language } = useContext(LanguageContext);

  // Limitation Act Logic
  const orderDate = new Date(new Date().setDate(new Date().getDate() - 2)).toISOString();
  // Using caseId or a mock for caseType
  const caseType = action.caseId ? action.caseId : (action.id === 1 ? 'High Court Appeal' : 'Civil Suit');
  const limitationInfo = calculateLimitationDate(orderDate, caseType);

  // 3D Tilt Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 200, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 200, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    // Wrap in requestAnimationFrame to ensure 60fps
    requestAnimationFrame(() => {
      const rect = e.currentTarget.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;
      x.set(xPct);
      y.set(yPct);
    });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getBadgeClass = (dept) => {
    switch (dept) {
      case 'Police': return 'badge-police';
      case 'Revenue': return 'badge-revenue';
      case 'Finance': return 'badge-finance';
      case 'Health': return 'badge-revenue'; // fallback
      default: return 'badge-revenue';
    }
  };

  const isVerified = action.status === 'green';
  const confidenceScore = action.confidence || 95; // default for DB cases
  const needsReview = confidenceScore < 85;
  const isHighRisk = confidenceScore < 70;

  // Deep-Sync Bhashini Translation
  // Check if it's from the new DB or old mock
  let translatedText = action.directive;
  let translatedDept = action.department;
  
  if (action.actionPlan && action.actionPlan[language]) {
    translatedText = action.actionPlan[language].directive;
    translatedDept = action.actionPlan[language].department;
  } else if (language === 'Hindi') {
    translatedText = `[हिंदी]: ${action.directive}`;
  } else if (language === 'Marathi') {
    translatedText = `[मराठी]: ${action.directive}`;
  }

  return (
    <LayoutGroup>
      <motion.div
        layout
        style={{
          perspective: 1200,
          transformStyle: "preserve-3d",
          marginBottom: '1.5rem'
        }}
      >
        <motion.div 
          layout
          className={`glass-panel ${isHighRisk ? 'haptic-pulse' : ''}`}
          style={{
            padding: '1.5rem',
            position: 'relative',
            borderColor: showExplanation ? 'var(--primary)' : 'rgba(255, 255, 255, 0.1)',
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            boxShadow: isHighRisk ? 'none' : 'var(--shadow-lg)'
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.02, boxShadow: isHighRisk ? 'none' : 'var(--primary-glow)' }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {/* Decorative side accent line */}
          <div style={{
            position: 'absolute', top: 0, left: 0, width: '4px', height: '100%',
            background: isVerified ? 'var(--success)' : (action.status === 'red' ? 'var(--danger)' : 'var(--warning)'),
            boxShadow: `0 0 10px ${isVerified ? 'var(--success)' : (action.status === 'red' ? 'var(--danger)' : 'var(--warning)')}`
          }} />

          <motion.div layout style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', transform: "translateZ(30px)" }}>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span className={`badge ${getBadgeClass(action.department || 'Revenue')}`}>{translatedDept || action.department}</span>
              
              {/* Limitation Act Deadline logic */}
              {limitationInfo.daysRemaining <= 90 && (
                <div style={{ 
                  display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600',
                  color: limitationInfo.isUrgent ? 'var(--danger)' : 'var(--warning)',
                  background: limitationInfo.isUrgent ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  padding: '0.2rem 0.5rem', borderRadius: '4px', border: `1px solid ${limitationInfo.isUrgent ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}`
                }}>
                  <Clock size={12} className={limitationInfo.isUrgent ? "animate-pulse" : ""} />
                  {limitationInfo.isExpired ? 'Expired' : `${limitationInfo.daysRemaining} days to Appeal`}
                </div>
              )}
            </div>
            
            <div className={`status-pill ${action.status || 'yellow'}`} title={isVerified ? 'Verified' : 'Pending Review'}>
              <span className="status-dot"></span>
              {isVerified ? 'Verified' : (action.status === 'red' ? 'Critical' : 'Pending Review')}
            </div>
          </motion.div>

          {/* This is the Bhashini 90-degree swap */}
          <AnimatePresence mode="wait">
            <motion.div 
              layout
              key={language}
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{ transform: "translateZ(20px)" }}
            >
              <h3 style={{ 
                fontSize: '1.15rem', lineHeight: '1.5', fontWeight: '600', 
                color: '#fff', marginBottom: '1.5rem', letterSpacing: '-0.01em',
                display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {translatedText}
              </h3>
            </motion.div>
          </AnimatePresence>

          <motion.div layout style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', 
            borderRadius: 'var(--radius-lg)', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.05)',
            transform: "translateZ(20px)"
          }}>
            <button 
              onClick={onSourceClick}
              style={{ 
                background: 'transparent', border: 'none', color: 'var(--primary)', 
                display: 'flex', alignItems: 'center', gap: '0.35rem', 
                fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer',
                transition: 'color 0.2s ease', textShadow: '0 0 5px rgba(99,102,241,0.5)'
              }}
              title="View Source in Document"
            >
              <ExternalLink size={16} />
              Ground to Source
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {isHighRisk && (
                <div className="animate-pulse" style={{ color: 'var(--danger)', fontSize: '0.75rem', fontWeight: 'bold' }} title="Human Verification Required: High Risk of Hallucination.">
                  Verify Required!
                </div>
              )}
              <div style={{ 
                fontSize: '0.8rem', fontWeight: '500', 
                color: needsReview ? (isHighRisk ? 'var(--danger)' : '#fcd34d') : 'var(--success)', 
                display: 'flex', alignItems: 'center', gap: '0.5rem' 
              }}>
                Trust Meter
                <MiniConfidenceGauge score={confidenceScore} />
              </div>
            </div>
          </motion.div>

          {/* Explainability Section Toggle */}
          <motion.button 
            layout
            onClick={() => setShowExplanation(!showExplanation)}
            style={{
              width: '100%', background: 'transparent', border: '1px dashed var(--border)',
              color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              fontSize: '0.85rem', cursor: 'pointer', marginBottom: isVerified ? '0' : '1.25rem',
              transition: 'all 0.3s', transform: "translateZ(10px)"
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = showExplanation ? 'var(--primary)' : 'var(--border)'}
          >
            <Cpu size={14} color="var(--primary)" />
            {showExplanation ? 'Hide Grounding & Explanations' : 'View AI Explanation & Entities'}
            <ChevronDown size={14} style={{ transform: showExplanation ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
          </motion.button>

          {/* Explainability Drawer */}
          <AnimatePresence>
            {showExplanation && (action.explanation || action.tags) && (
              <motion.div 
                layout
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                style={{
                  background: 'rgba(15, 23, 42, 0.6)', padding: '1rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(99, 102, 241, 0.3)', marginBottom: isVerified ? '0' : '1.25rem',
                  transform: "translateZ(15px)", overflow: 'hidden'
                }}
              >
                {action.explanation && (
                  <>
                    <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.75rem', fontWeight: '600' }}>Extracted Entities</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                      {Object.entries(action.explanation.entities).map(([key, val]) => (
                        <div 
                          key={key} 
                          onClick={onSourceClick}
                          style={{ 
                            fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', 
                            borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.5rem',
                            cursor: 'pointer', transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                          title="Click to ground in PDF"
                        >
                          <span style={{ color: 'var(--text-secondary)' }}>{key}:</span> 
                          <span style={{ color: '#fff', fontWeight: '500' }}>{val}</span>
                          <MiniConfidenceGauge score={Math.max(60, confidenceScore - Math.floor(Math.random()*10))} />
                        </div>
                      ))}
                    </div>

                    <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.75rem', fontWeight: '600' }}>Confidence Breakdown</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {Object.entries(action.explanation.confidenceBreakdown).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span style={{ color: parseInt(val) < 75 ? 'var(--warning)' : 'var(--success)' }}>{val}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                
                {action.tags && !action.explanation && (
                  <>
                     <h4 style={{ fontSize: '0.85rem', color: '#fff', marginBottom: '0.75rem', fontWeight: '600' }}>Case Tags</h4>
                     <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {action.tags.map((tag) => (
                         <span key={tag} style={{ fontSize: '0.75rem', background: 'rgba(99,102,241,0.15)', color: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                           {tag}
                         </span>
                      ))}
                     </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!isVerified && (
            <motion.button 
              layout
              className="btn btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', transform: "translateZ(20px)" }} 
              onClick={onApprove}
              whileTap={{ scale: 0.95 }}
            >
              Approve Action
              <ChevronRight size={16} />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
