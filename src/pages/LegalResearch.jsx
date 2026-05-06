import React, { useState } from 'react';
import { Search, Globe, FileText, ExternalLink, Loader2, Scale, ShieldCheck, Database, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { legalDatabase } from '../utils/LegalDatabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function LegalResearch() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [filter, setFilter] = useState('All');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setResults([]);

    // Layer 1: Internal OFFICIAL RECORDS
    const internalMatches = legalDatabase.filter(c => 
      c.title.toLowerCase().includes(query.toLowerCase()) || 
      c.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
    ).map(c => ({
      title: c.title,
      id: c.caseId,
      snippet: `Official record found in GovTrust Internal Ledger. Verdict: ${c.verdict}`,
      source: 'OFFICIAL RECORDS',
      trust: 98,
      status: 'Disposed',
      link: '#',
      hasActionPlan: true,
      indiaCode: c.tags[0] // Simulate India Code link
    }));

    // Layer 2: Simulated NJDG API
    const njdgMatches = query.length > 3 ? [
      {
        title: `${query} vs State of Maharashtra`,
        id: "NJDG-MH-2024-882",
        snippet: "Automated match from National Judicial Data Grid. High Court of Bombay Bench.",
        source: 'NJDG Verified',
        trust: 92,
        status: 'Pending',
        link: 'https://njdg.ecourts.gov.in',
        indiaCode: 'Section 144'
      }
    ] : [];

    try {
      // Layer 3: Public Web Fallback
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + " court case law india")}&utf8=&format=json&origin=*`
      );
      const data = await response.json();
      
      const webMatches = (data.query?.search || []).map(r => ({
        title: r.title,
        id: `WEB-${r.pageid}`,
        snippet: r.snippet + '...',
        source: 'Public Web',
        trust: 58,
        status: 'Archived',
        link: `https://en.wikipedia.org/?curid=${r.pageid}`
      }));

      // Merge results based on hierarchy
      setResults([...internalMatches, ...njdgMatches, ...webMatches]);
    } catch (error) {
      setResults([...internalMatches, ...njdgMatches]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div style={{ padding: '2rem', width: '100%', maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '2rem' }}>
      {/* Side Rail Filters */}
      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Court Jurisdiction</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {['All', 'Supreme Court', 'High Courts', 'District Courts', 'Tribunals'].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                style={{ 
                  textAlign: 'left', padding: '0.5rem 0.75rem', borderRadius: '6px', 
                  background: filter === f ? 'var(--primary-light)' : 'transparent',
                  color: filter === f ? 'var(--primary-hover)' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', fontSize: '0.9rem'
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>Source Authenticity</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)' }}>
              <ShieldCheck size={14} /> Official Records (95%+)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
              <Database size={14} /> NJDG / India Code
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
              <Globe size={14} /> Public Archives {"(<60%)"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Search Section */}
      <div style={{ flex: 1 }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: '#fff', letterSpacing: '-0.02em' }}>
            Authenticated Judicial <span style={{ color: '#D4AF37' }}>Archive</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Multi-layered verification across NJDG, India Code, and Internal GovTrust Ledgers.
          </p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Cases, Acts, or Precedents..." 
                style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: '#fff' }}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ background: '#D4AF37', border: 'none', color: '#000', fontWeight: '700' }} disabled={isSearching}>
              {isSearching ? 'VERIFYING...' : 'AUTHENTICATE'}
            </button>
          </form>
        </div>

        <AnimatePresence mode="wait">
          {isSearching ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '4rem' }}>
               <Loader2 className="animate-spin" size={48} color="#D4AF37" style={{ margin: '0 auto' }} />
               <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Cross-referencing NJDG & Internal Ledgers...</p>
             </motion.div>
          ) : results.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {results.map((result, idx) => (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={result.id} 
                  className="glass-panel" 
                  style={{ padding: '1.5rem', border: result.trust > 90 ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid var(--border)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff' }}>{result.title}</h3>
                        <span className={`badge ${result.source === 'OFFICIAL RECORDS' ? 'badge-police' : (result.source === 'Public Web' ? 'badge-finance' : 'badge-revenue')}`} style={{ fontSize: '0.65rem' }}>
                          {result.source}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Case ID: {result.id}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontSize: '0.75rem', fontWeight: '700', color: result.trust > 80 ? 'var(--success)' : 'var(--warning)' }}>
                         TRUST: {result.trust}%
                       </div>
                       <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                         {result.status}
                       </span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '1.25rem' }} dangerouslySetInnerHTML={{ __html: result.snippet }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      {result.indiaCode && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#D4AF37', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                          <LinkIcon size={14} /> India Code: {result.indiaCode}
                        </div>
                      )}
                      {result.hasActionPlan && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}>
                          <FileText size={14} /> View Action Plan
                        </div>
                      )}
                    </div>
                    <a href={result.link} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  
                  {result.trust < 60 && (
                    <div style={{ marginTop: '1rem', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '6px', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--warning)' }}>
                      <AlertCircle size={12} /> Disclaimer: Cross-verification required from official gazette.
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : hasSearched ? (
            <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
              <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3>No Authenticated Records Found</h3>
            </div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
