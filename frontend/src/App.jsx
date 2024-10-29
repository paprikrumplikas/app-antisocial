import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import Login from './components/Login.jsx';
import { Home } from './container_ie_pages/Home.jsx';

// @learning @crucial enable google login / identification services in our app
import { GoogleOAuthProvider } from "@react-oauth/google";

const App = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_GOOGLE_API_TOKEN}>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/** @learning catch-all route to handle nested routes within a layout component. I.e. more routes in Home */}
        {/** The * is a wildcard character that matches any path that hasn't been matched by other routes */}
        {/** Each /* passes unmatched routes down to the next level of routing. */}
        {/** @note there are routes defined in Home and in Pins */}
        <Route path="/*" element={<Home />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App