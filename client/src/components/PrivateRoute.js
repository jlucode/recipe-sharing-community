import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, isAuthenticated, ...props }) => {
  return isAuthenticated ? <Component {...props} /> : <Navigate to="/login" />;
};

export default PrivateRoute;