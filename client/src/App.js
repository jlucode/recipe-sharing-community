import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/navbar';
import Home from './components/home';
import RecordList from './components/recordList';
import Edit from './components/edit';
import Create from './components/create';
import Login from './components/login'; 
import Register from './components/register';
import jwt_decode from "jwt-decode";
import ScrollToTop from './components/ScrollToTop';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token); // Decode the token to get its expiration time
      const currentTime = Date.now() / 1000; // Convert to seconds
  
      if (decodedToken.exp < currentTime) {
        // Token is expired, log the user out
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } else {
        // Set a timeout to automatically log out after token expiration
        const expiresIn = decodedToken.exp - currentTime;
        setTimeout(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }, expiresIn * 1000); // Convert to milliseconds
      }
    }
  }, []);

  const styles = {
    backgroundColor: 'White',
    minHeight: '100vh',
  };

  return (
    <div style={styles}>
      <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <ScrollToTop /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route
          path="/recipe/:id"
          element={<RecordList />}
        />
        <Route
          path="/edit/:id"
          element={<PrivateRoute element={Edit} isAuthenticated={isAuthenticated} />}
        />
        <Route
          path="/create"
          element={<PrivateRoute element={Create} isAuthenticated={isAuthenticated} />}
        />
        <Route path="/register" element={<Register setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </div>
  );
};

export default App;