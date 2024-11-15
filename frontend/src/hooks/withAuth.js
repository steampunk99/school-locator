// withAuth.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import Loader from '../lib/loader';
import { FaSpinner } from 'react-icons/fa';

export const withAuth = (WrappedComponent, allowedRoles = null) => {
  return (props) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <Loader />;
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/dashboard" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};