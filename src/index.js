////////////////////////////////////////////////////////////////////////////////
//
// index.js
//
// This component is the main entry point to the test prep app. It creates the
// SPA by instantiating the App.jsx component.
//
////////////////////////////////////////////////////////////////////////////////


import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';

import App from './components/App/App';
import { HashRouter } from 'react-router-dom';




const appJsx = (
  <HashRouter>
    <App />
  </HashRouter>
);

ReactDOM.render(appJsx, document.getElementById('root'));
