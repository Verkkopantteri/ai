import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidgetDark } from './ChatWidgetDark';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
      <ChatWidgetDark />
    </div>
  </StrictMode>
);
