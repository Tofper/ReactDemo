import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { BrowserRouter } from 'react-router-dom';
import { MediaProvider } from './context/MediaContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MediaProvider>
        <App />
      </MediaProvider>
    </BrowserRouter>
  </React.StrictMode>
)