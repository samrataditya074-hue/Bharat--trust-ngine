import React, { useState, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { FileUp, Search } from 'lucide-react';

// Initialize Worker outside to prevent re-definition on render
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export default function PDFViewer({ file, highlight }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.2);

  // Persistent PDF Blob URL management with useMemo
  const pdfSource = useMemo(() => {
    if (file && typeof file === 'object' && file instanceof File) {
      return URL.createObjectURL(file);
    }
    // Fallback if null
    return file || '/sample-judgment.pdf';
  }, [file]);

  // Handle URL Revocation to prevent memory leaks
  useEffect(() => {
    return () => {
      if (typeof pdfSource === 'string' && pdfSource.startsWith('blob:')) {
        URL.revokeObjectURL(pdfSource);
      }
    };
  }, [pdfSource]);

  useEffect(() => {
    if (highlight && highlight.page) {
      setPageNumber(highlight.page);
    }
  }, [highlight]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  // Optimized text renderer for entity grounding
  const textRenderer = (textItem) => {
    if (highlight && highlight.text && textItem.str.toLowerCase().includes(highlight.text.toLowerCase())) {
      return `<mark style="background-color: rgba(212, 175, 55, 0.4); color: white; padding: 2px; border-radius: 2px; box-shadow: 0 0 10px rgba(212, 175, 55, 0.8);">${textItem.str}</mark>`;
    }
    return textItem.str;
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', transform: 'translateZ(0)', background: '#0a0f1a' }}>
      <div style={{ 
        padding: '1rem', background: 'rgba(255,255,255,0.05)', 
        borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>Prev</button>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Page {pageNumber} of {numPages || '--'}</span>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setPageNumber(p => Math.min(numPages || 1, p + 1))} disabled={pageNumber >= (numPages || 1)}>Next</button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setScale(s => s - 0.2)}>-</button>
          <span style={{ display: 'inline-flex', alignItems: 'center', fontSize: '0.9rem' }}>{Math.round(scale * 100)}%</span>
          <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem' }} onClick={() => setScale(s => s + 0.2)}>+</button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '2rem', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        {!file && (
          <div style={{ 
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)'
          }}>
            <FileUp size={48} className="animate-bounce" color="#D4AF37" />
            <p style={{ fontWeight: '600' }}>Select File to Process</p>
          </div>
        )}

        {pdfSource && (
          <Document
            key={pdfSource} // Critical: Force re-render when file URL changes
            file={pdfSource}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="animate-pulse" style={{ color: '#D4AF37', marginTop: '4rem' }}>
                Decrypting Official Record...
              </div>
            }
            error={null} 
          >
            <Page 
              pageNumber={pageNumber} 
              scale={scale} 
              renderTextLayer={true}
              renderAnnotationLayer={true}
              customTextRenderer={textRenderer}
              className="glass-panel"
              style={{ padding: '1rem', transform: 'translateZ(0)' }}
            />
          </Document>
        )}
      </div>
    </div>
  );
}
