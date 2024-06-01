import React, { useEffect, useState } from 'react';
import './Spinner.css'; // Ensure this CSS file contains necessary styles

export default function SPLoader() {
  return (
    <div className="spinner-overlay">
      <img src={require('./SpinnerGIF.gif')} alt="Loading..." className="spinner-img" />
    </div>
  );
}
