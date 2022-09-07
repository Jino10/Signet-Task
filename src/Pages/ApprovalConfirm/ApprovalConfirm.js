import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Users from '../Users/Users';
import Login from '../Authentication/Login';
import LayoutWithHeader from '../../Common/LayoutWithHeader';
import { userRoleId } from '../../Utilities/AppUtilities';

function ApprovalConfirm() {
  const { pathname } = useLocation();
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const { userId } = useParams();

  useEffect(() => {
    localStorage.setItem('approveLink', pathname);
    const token = localStorage.getItem('token');
    localStorage.setItem('userId', userId);
    if (token) {
      const roleId = localStorage.getItem('roleId');
      if (roleId === userRoleId.signetAdmin) {
        setAdminLoggedIn(true);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('roleId');
      }
    }
  }, [userId]); // eslint-disable-line

  return adminLoggedIn ? LayoutWithHeader(<Users userId={userId} />) : <Login userId={userId} />;
}

export default ApprovalConfirm;
