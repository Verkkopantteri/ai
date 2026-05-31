import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidgetLight } from './ChatWidgetLight';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f4f5' }}>
      <ChatWidgetLight />
    </div>
  </StrictMode>
);
