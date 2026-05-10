import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ValidationProvider } from './context/ValidationContext.jsx';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ValidationProvider>
        <App />
      </ValidationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
