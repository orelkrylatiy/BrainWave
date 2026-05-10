import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.tsx';

const element = document.getElementById('root');

if (!element) throw Error('No element!');

createRoot(element).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
