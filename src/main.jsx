import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { IdentityProvider } from './context/IdentityContext';
import { ProgressProvider } from './context/ProgressContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <IdentityProvider>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </IdentityProvider>
    </BrowserRouter>
  </React.StrictMode>
);
