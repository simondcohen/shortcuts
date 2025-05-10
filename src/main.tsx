import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Update document title
document.title = 'Shortcuts - Personal Launch Pad';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);