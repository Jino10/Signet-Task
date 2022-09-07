import React from 'react';
import { useSelector } from 'react-redux';

function Home() {
  const state = useSelector((stateR) => stateR.UserReducers);
  return <div>{state.user.email}</div>;
}

export default Home;
