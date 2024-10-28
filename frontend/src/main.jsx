import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// makes the app a multi-page app
import { BrowserRouter as Router } from 'react-router-dom';

// @learning createRoot is part of the new React 18 API, which replaces the older ReactDOM.render method.
createRoot(document.getElementById('root')).render(
  // @learning @crucial StrictMode is a tool provided by React for highlighting potential problems in an application. It's a wrapper component that doesn't render any visible UI but activates additional checks and warnings for its descendants
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
