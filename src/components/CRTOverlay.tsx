import React from 'react';
import { useApp } from '../context/AppContext';

export const CRTOverlay: React.FC = () => {
  const { crtEnabled } = useApp();

  if (!crtEnabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden crt-scanlines opacity-40 mix-blend-overlay">
      {/* Subtle vignette border around screen */}
      <div 
        className="absolute inset-0" 
        style={{
          boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.7), inset 0 0 40px rgba(0, 0, 0, 0.9)'
        }}
      />
    </div>
  );
};
