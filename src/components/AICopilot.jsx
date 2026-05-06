import React, { useState, useRef, useEffect, useContext } from 'react';
import { MessageSquare, X, Send, Bot, User, CheckCircle2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLegalDatabase } from '../utils/LegalDatabase';
import { LanguageContext } from '../App';

export default function AICopilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Namaste! I am your GovTrust AI Copilot. I have been isolated for the Bharat Hackathon and am strictly referencing official records.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef(null);
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      const results = searchLegalDatabase(userMessage);

      if (results.length > 0) {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: `Verified: I found ${results.length} record(s) matching your request. Accessing official Action Plans now.`,
          cases: results.slice(0, 2) 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          type: 'bot', 
          text: "STRICT SEARCH: No Records Found in the official GovTrust database for this query. Hallucination Guardrail active." 
        }]);
      }
    }, 1200);
  };

  return (
    <>
      <motion.button 
        className="glass-panel"
        style={{
          position: 'fixed', bottom: '2rem', right: '2rem', width: '60px', height: '60px',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, border: '1px solid #D4AF37', transform: 'translateZ(0)',
          boxShadow: '0 0 20px rgba(212, 175, 55, 0.4)'
        }}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
      >
        {isOpen ? <X size={24} color="#fff" /> : <MessageSquare size={24} color="#D4AF37" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="glass-panel"
            style={{
              position: 'fixed', bottom: '6.5rem', right: '2rem', width: '380px', height: '500px',
              zIndex: 99, display: 'flex', flexDirection: 'column', overflow: 'hidden', transform: 'translateZ(0)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.2)'
            }}
          >
            <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)', background: 'rgba(212, 175, 55, 0.1)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#D4AF37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={18} color="#fff" />
              </div>
              <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>Ministry Intelligence AI</h4>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.map((msg, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.type === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{ 
                    maxWidth: '85%', padding: '0.75rem 1rem', 
                    background: msg.type === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    borderRadius: msg.type === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                    border: msg.type === 'bot' ? '1px solid var(--border)' : 'none',
                    color: '#fff', fontSize: '0.85rem'
                  }}>
                    {msg.text}
                  </div>
                  
                  {msg.cases && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', width: '100%' }}>
                      {msg.cases.map(c => (
                        <div key={c.caseId} className="glass-panel" style={{ padding: '0.75rem', border: '1px solid rgba(212, 175, 55, 0.3)', cursor: 'default' }}>
                          <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 'bold' }}>{c.caseId}</span>
                          <p style={{ fontSize: '0.8rem', color: '#fff', margin: '4px 0' }}>{c.title}</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.actionPlan[language]?.directive || c.actionPlan['English'].directive}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', padding: '0.5rem' }}>AI analyzing records...</div>}
              <div ref={endOfMessagesRef} />
            </div>

            <div style={{ padding: '1rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
              <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Strict Record Search..." 
                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '99px', padding: '0.5rem 1rem', color: '#fff', outline: 'none' }} />
              <button onClick={handleSend} className="btn-primary" style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#D4AF37', border: 'none' }}><Send size={16} color="#fff" /></button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
