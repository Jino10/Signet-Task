import React from 'react';
import './Users.css';
import UsersList from './UsersList';

function Users({ userId }) {
  return (
    <div className="wrapperBase">
      <UsersList userId={userId} />
    </div>
  );
}

export default Users;
