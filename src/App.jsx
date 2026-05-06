import React, { createContext, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Search, Upload, LayoutDashboard, FileText, Globe, Scale, Languages, X } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import LegalResearch from './pages/LegalResearch';
import AICopilot from './components/AICopilot';
import { motion, AnimatePresence } from 'framer-motion';
import { searchLegalDatabase } from './utils/LegalDatabase';

// Bhashini Language Context
export const LanguageContext = createContext({
  language: 'English',
  setLanguage: () => {}
});

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="nav-links">
      <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
        <LayoutDashboard size={16} />
        Dashboard
      </Link>
      <Link to="/workspace" className={`nav-link ${location.pathname === '/workspace' ? 'active' : ''}`}>
        <FileText size={16} />
        OCR Workspace
      </Link>
      <Link to="/research" className={`nav-link ${location.pathname === '/research' ? 'active' : ''}`}>
        <Globe size={16} />
        Case Search
      </Link>
    </nav>
  );
}

function BhashiniToggle() {
  const { language, setLanguage } = useContext(LanguageContext);
  
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem 0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
      <Languages size={16} color="var(--primary)" />
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none', cursor: 'pointer', fontSize: '0.85rem' }}
      >
        <option value="English" style={{ background: 'var(--bg-primary)' }}>English</option>
        <option value="Hindi" style={{ background: 'var(--bg-primary)' }}>हिंदी (Hindi)</option>
        <option value="Marathi" style={{ background: 'var(--bg-primary)' }}>मराठी (Marathi)</option>
      </select>
    </div>
  );
}

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 2) {
      const filtered = searchLegalDatabase(val);
      setResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <div className="search-bar">
        <Search size={16} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search Case, Land, Bail..." 
          value={query}
          onChange={handleSearch}
          onFocus={() => query.trim().length > 2 && setShowResults(true)}
        />
        {query && <X size={14} style={{ cursor: 'pointer' }} onClick={() => { setQuery(''); setShowResults(false); }} />}
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="glass-panel"
            style={{ 
              position: 'absolute', top: '120%', left: 0, width: '400px', 
              maxHeight: '300px', overflowY: 'auto', zIndex: 1000, padding: '0.5rem',
              transform: 'translateZ(0)'
            }}
          >
            {results.length > 0 ? results.map(res => (
              <div 
                key={res.ubid}
                style={{ 
                  padding: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', 
                  cursor: 'pointer', transition: 'all 0.2s' 
                }}
                className="search-result-item"
                onClick={() => {
                  alert(`Navigating to Case record: ${res.ubid}`);
                  setShowResults(false);
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 'bold' }}>{res.caseId}</span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{res.ubid}</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '500' }}>{res.title}</div>
              </div>
            )) : (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                STRICT SEARCH: No Records Found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [language, setLanguage] = useState('English');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <Router>
        <div className="app-container">
          <header className="header">
            <div className="header-left" style={{ display: 'flex', alignItems: 'center' }}>
              <Link to="/" className="logo">
                <div style={{ 
                  background: 'linear-gradient(135deg, var(--primary), #818cf8)', 
                  color: 'white', padding: '6px', borderRadius: '8px',
                  boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
                }}>
                  <Scale size={24} />
                </div>
                GovTrust AI
              </Link>
              <Navigation />
            </div>
            
            <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <BhashiniToggle />
              <GlobalSearch />
              <Link to="/workspace" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                <Upload size={16} />
                Process Judgment
              </Link>
            </div>
          </header>

          <main className="main-content" style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/research" element={<LegalResearch />} />
              </Routes>
            </AnimatePresence>
          </main>

          <AICopilot />
        </div>
      </Router>
      <style>{`
        .search-result-item:hover {
          background: rgba(99, 102, 241, 0.1);
        }
      `}</style>
    </LanguageContext.Provider>
  );
}

export default App;
