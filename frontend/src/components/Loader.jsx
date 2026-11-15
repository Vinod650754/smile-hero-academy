import React from 'react';

export default function Loader({ label = 'LOADING BRUSHBUDDY...' }) {
  return (
    <div className="bb-loader-overlay">
      <div className="bb-loader-box">
        <div className="loader" aria-label="Loading"></div>
        <div className="bb-loader-text">{label}</div>
      </div>
    </div>
  );
}