import React from 'react';
import Users from '../Users/Users';

export default function Dashboard() {
  return <Users userId={localStorage.getItem('userId')} />;
}
