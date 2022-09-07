import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { userRoleId } from '../../Utilities/AppUtilities';

function PrivateRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    const roledId = localStorage.getItem('roleId');
    if (roledId === userRoleId.signetAdmin && window.location.pathname === '/users') {
      navigate('/users');
    }
  }, [navigate]);

  return localStorage.getItem('token') ? <Outlet /> : <Navigate to="/" replace />;
}

export default PrivateRoute;
