import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App'


document.title = "科隆仓库(beta)";
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>
);
