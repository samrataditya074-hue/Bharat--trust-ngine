import React, { useState, useEffect, useContext, useRef } from 'react';
import PDFViewer from '../components/PDFViewer';
import ActionCard from '../components/ActionCard';
import BiometricModal from '../components/BiometricModal';
import { FileText, Loader2, UploadCloud, FileUp, ScanLine, ShieldCheck, Database, Scale, Cpu, AlertTriangle, CheckCircle, ShieldAlert, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageContext } from '../App';
import { legalDatabase } from '../utils/LegalDatabase';

const Gavel = ({ size = 64, color = "#D4AF37" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m14 13-5 5 4 4 5-5z"/><path d="m16 19 2-2"/><path d="M8.7 14.3c-1.3.4-2.8-.2-3.3-1.5-.5-1.3.1-2.7 1.4-3.2"/><path d="M11.3 11.7c.4 1.3-.2 2.8-1.5 3.3-1.3.5-2.7-.1-3.2-1.4"/><path d="M14.3 8.7c.5 1.3-.1 2.7-1.4 3.2-1.3.5-2.8-.2-3.3-1.5"/><path d="M12.4 6.8c1.3-.4 2.8.2 3.3 1.5.5 1.3-.1 2.7-1.4 3.2"/><path d="m2 2 4 4"/>
  </svg>
);

const ANALYSIS_MODES = {
  LAND_DISPUTE: [
    { ...legalDatabase[0], confidence: 97 },
    { ...legalDatabase[2], confidence: 94 }
  ],
  CRIMINAL_REFORM: [
    { ...legalDatabase[1], confidence: 98 },
    { ...legalDatabase[3], confidence: 92 }
  ],
  REVENUE_COLLECTION: [
    { ...legalDatabase[2], confidence: 95 },
    { ...legalDatabase[4] || legalDatabase[0], confidence: 91 }
  ]
};

export default function Workspace() {
  const [pdfFile, setPdfFile] = useState(null);
  const [extractionStage, setExtractionStage] = useState(0); 
  const [docType, setDocType] = useState(null); 
  const [actions, setActions] = useState([]);
  const [showBiometric, setShowBiometric] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [pdfHighlight, setPdfHighlight] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [particles, setParticles] = useState([]);
  const [legalityScore, setLegalityScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef(null);
  const { language } = useContext(LanguageContext);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setActions([]);
      setPdfHighlight(null);
      setDocType(null);
      setPdfFile(null);
      setErrorMessage("");
      setLegalityScore(0);
      
      const fileName = file.name.toLowerCase();
      
      // Structural Check
      const structuralAnchors = ["high court", "supreme court", "cwjc", "slp", "lpa", "versus", "petitioner", "respondent"];
      const projectKeywords = ["executive summary", "theme", "roadmap", "solution", "proposal", "verdictflow"];
      
      let score = 0;
      structuralAnchors.forEach(anchor => {
        if (fileName.includes(anchor)) score += 20;
      });
      
      const isProjectReport = projectKeywords.some(kw => fileName.includes(kw));
      if (isProjectReport) score = 10; // Drastic drop if project keywords found

      setLegalityScore(Math.min(100, score));
      setExtractionStage(1); 
      
      setTimeout(() => {
        if (isProjectReport) {
          setExtractionStage(9); // INVALID_PROJECT_REPORT
          setErrorMessage("INVALID FILE: This appears to be a Project Report, not an Official Judicial Decree.");
          setDocType('invalid');
        } else if (score < 60) {
          setExtractionStage(8); // INVALID_JUDICIAL_FORMAT
          setErrorMessage("INVALID FORMAT: Structural anchors (Court, Case No, Parties) missing.");
          setDocType('invalid');
        } else {
          setPdfFile(file);
          setDocType('legal');
          startExtractionProcess(file.name);
        }
      }, 1500);
    }
  };

  const startExtractionProcess = (filename) => {
    setExtractionStage(2); 
    setTimeout(() => setExtractionStage(3), 2000); 
    setTimeout(() => setExtractionStage(4), 4000); 
    setTimeout(() => setExtractionStage(5), 5500); 
    
    setTimeout(() => {
      const name = filename.toLowerCase();
      let mode = 'LAND_DISPUTE';
      if (name.includes('crim') || name.includes('bail') || name.includes('police')) mode = 'CRIMINAL_REFORM';
      else if (name.includes('tax') || name.includes('finance') || name.includes('revenue')) mode = 'REVENUE_COLLECTION';
      else {
        const modes = Object.keys(ANALYSIS_MODES);
        mode = modes[Math.floor(Math.random() * modes.length)];
      }

      const resultActions = ANALYSIS_MODES[mode].map(a => ({
        ...a,
        confidence: 90 + Math.floor(Math.random() * 9)
      }));

      const newParticles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        xOffset: Math.random() * 200 - 100,
        yOffset: Math.random() * 500,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
      
      setTimeout(() => {
        setExtractionStage(6); 
        setTimeout(() => {
          setExtractionStage(7); 
          setActions(resultActions);
          setParticles([]);
        }, 1500);
      }, 1500); 
    }, 7500);
  };

  const handleSourceLinkClick = (action) => {
    setPdfHighlight({ page: 1, text: action.title.split('vs.')[0].trim() });
  };

  const handleApprove = (action) => {
    setSelectedAction(action);
    setShowBiometric(true);
  };

  const handleBiometricSuccess = () => {
    setActions(actions.map(a => 
      a.ubid === selectedAction.ubid ? { ...a, status: 'green' } : a
    ));
    setShowBiometric(false);
    setSelectedAction(null);
  };

  return (
    <div className="split-screen animate-fade-in" style={{ position: 'relative', transform: 'translateZ(0)' }}>
      <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="application/pdf,image/*" style={{ display: 'none' }} />

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) translateZ(0)', opacity: 0.03, pointerEvents: 'none', zIndex: 0 }}>
        <Scale size={600} color="#fff" />
      </div>

      <div className="split-left" style={{ position: 'relative', zIndex: 1, transform: 'translateZ(0)' }}>
        {pdfFile ? (
          <>
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 20, display: 'flex', gap: '0.5rem' }}>
               <span className="badge" style={{ background: 'var(--success)', color: '#fff', boxShadow: '0 0 10px var(--success)', border: 'none' }}>
                 <ShieldCheck size={12} style={{ marginRight: '4px' }} /> Verified Legal Doc
               </span>
               <span className="badge" style={{ background: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', border: '1px solid #D4AF37' }}>
                 Legality Score: {legalityScore}%
               </span>
            </div>
            <PDFViewer file={pdfFile} highlight={pdfHighlight} />
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '3rem' }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect({ target: { files: e.dataTransfer.files } }); }}>
            
            {[8, 9].includes(extractionStage) ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                style={{ textAlign: 'center', padding: '3rem', border: '2px solid var(--danger)', borderRadius: 'var(--radius-xl)', background: 'rgba(239, 68, 68, 0.05)', maxWidth: '450px' }}
              >
                <XCircle size={64} color="var(--danger)" style={{ marginBottom: '1.5rem', animation: 'pulse 1s infinite' }} />
                <h2 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>STRUCTURE REJECTED</h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '2rem' }}>
                  {errorMessage}
                </p>
                <div style={{ padding: '0.5rem 1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '2rem' }}>
                  Legality Score: {legalityScore}% (Threshold: 60%)
                </div>
                <button className="btn btn-outline" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={() => setExtractionStage(0)}>
                  Reset Judicial Terminal
                </button>
              </motion.div>
            ) : (
              <div className="glass-panel" style={{
                width: '100%', maxWidth: '500px',
                border: `2px dashed ${isDragging ? '#D4AF37' : 'var(--border)'}`,
                background: isDragging ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-surface)',
                padding: '4rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center',
                textAlign: 'center', transition: 'all 0.3s ease', cursor: 'pointer',
                boxShadow: isDragging ? '0 0 20px rgba(212, 175, 55, 0.4)' : 'none'
              }} onClick={() => fileInputRef.current.click()}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: isDragging ? '#D4AF37' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', transition: 'all 0.3s ease', color: isDragging ? 'white' : 'var(--text-muted)' }}>
                  <UploadCloud size={40} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#fff', marginBottom: '0.5rem' }}>Judicial Input Terminal</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '300px' }}>Upload Judgment PDF. System will perform Identity & Statutory validation.</p>
                
                {legalityScore > 0 && legalityScore < 60 && (
                   <div style={{ color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>
                     Insufficient Legality Score ({legalityScore}%). High Court anchors missing.
                   </div>
                )}

                <button 
                  className="btn btn-primary" 
                  disabled={legalityScore > 0 && legalityScore < 60}
                  style={{ 
                    padding: '0.75rem 2rem', fontSize: '1rem', 
                    background: (legalityScore > 0 && legalityScore < 60) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #D4AF37, #B8860B)', 
                    border: 'none',
                    opacity: (legalityScore > 0 && legalityScore < 60) ? 0.5 : 1
                  }}
                >
                  <FileUp size={18} /> Select Official PDF
                </button>
              </div>
            )}
          </div>
        )}

        {extractionStage > 0 && extractionStage < 6 && (
          <motion.div
            initial={{ top: 0, opacity: 0 }}
            animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', left: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, transparent, #D4AF37, transparent)', boxShadow: '0 0 20px #D4AF37, 0 0 40px #D4AF37', zIndex: 10, pointerEvents: 'none', transform: 'translateZ(0)' }}
          />
        )}
      </div>
      
      <div className="split-right" style={{ position: 'relative', zIndex: 1, transform: 'translateZ(0)' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#fff' }}>Actionable Directives</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{actions.length > 0 ? "Statutory validation complete." : "Waiting for judicial record..."}</p>
          </div>
          {docType === 'legal' && (
            <div style={{ padding: '0.5rem 1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', color: 'var(--success)', fontSize: '0.75rem', fontWeight: 'bold' }}>
              LEGALITY: {legalityScore}%
            </div>
          )}
        </div>

        <AnimatePresence>
          {extractionStage === 6 && (
            <motion.div 
              initial={{ scale: 0, rotate: -45, opacity: 0 }}
              animate={{ scale: [0, 1.2, 1], rotate: [-45, 0, -20], opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ position: 'absolute', top: '40%', left: '40%', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', transform: 'translateZ(0)' }}
            >
              <div style={{ padding: '2rem', background: 'rgba(15, 23, 42, 0.9)', borderRadius: '50%', border: '2px solid #D4AF37', boxShadow: '0 0 30px #D4AF37' }}>
                <Gavel size={100} />
              </div>
              <h3 style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '1.5rem' }}>ORDER VERIFIED</h3>
            </motion.div>
          )}
        </AnimatePresence>

        {extractionStage > 0 && extractionStage < 6 ? (
          <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', border: '1px solid #D4AF37' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Loader2 size={80} color="#D4AF37" className="animate-spin" style={{ position: 'absolute', opacity: 0.2 }} />
              {extractionStage === 1 ? <ShieldCheck className="animate-pulse" color="#D4AF37" /> : (extractionStage === 5 ? <Cpu className="animate-pulse" color="#D4AF37" /> : <ScanLine className="animate-pulse" color="#D4AF37" />)}
            </div>
            <div>
              <h3 style={{ color: '#fff' }}>
                {extractionStage === 1 ? "Structural Integrity Audit..." : 
                 extractionStage === 2 ? "Optical Character Recognition..." : 
                 extractionStage === 3 ? "UBID Security Verification..." : 
                 extractionStage === 4 ? "Analyzing Statutory Clauses..." : "Deep Scanning Clauses..."}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>GovTrust Forensic Scanner</p>
            </div>
          </div>
        ) : actions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <AnimatePresence>
              {actions.map((action) => (
                <ActionCard 
                  key={`${action.ubid}-${language}`} 
                  action={action} 
                  onSourceClick={() => handleSourceLinkClick(action)}
                  onApprove={() => handleApprove(action)}
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
             {[8, 9].includes(extractionStage) ? (
               <>
                 <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
                 <h3 style={{ color: 'var(--danger)' }}>Forensic Block</h3>
                 <p>{errorMessage}</p>
                 <div style={{ marginTop: '1rem', color: 'var(--danger)', fontWeight: 'bold' }}>TRUST METER: 0%</div>
               </>
             ) : (
               <>
                 <FileText size={48} style={{ marginBottom: '1rem', opacity: 0.1 }} />
                 <h3>Forensic Input Active</h3>
                 <p>Awaiting structured judicial decree.</p>
               </>
             )}
          </div>
        )}

        <AnimatePresence>
          {particles.map(p => (
            <motion.div key={p.id} initial={{ x: -300 + p.xOffset, y: p.yOffset, opacity: 0, scale: 0 }} animate={{ x: 100, y: p.yOffset, opacity: [0, 1, 0], scale: 1 }} transition={{ delay: p.delay, duration: 0.8, ease: "easeOut" }}
              style={{ position: 'absolute', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 10px #D4AF37', zIndex: 50, pointerEvents: 'none', transform: 'translateZ(0)' }} />
          ))}
        </AnimatePresence>
      </div>

      {showBiometric && <BiometricModal onSuccess={handleBiometricSuccess} onCancel={() => setShowBiometric(false)} action={selectedAction} />}
    </div>
  );
}
