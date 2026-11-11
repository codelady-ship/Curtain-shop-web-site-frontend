import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter
      basename={import.meta.env.BASE_URL}
      future={{
      v7_startTransition: true, 
      v7_relativeSplatPath: true 
    }}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);