import React from 'react';
import './Success.css';

export default function Success() {
  return (
    <div className="succesWrap d-flex align-items-center justify-content-center">
      <div className="successBox d-flex align-items-center justify-content-center flex-column">
        <img src={process.env.REACT_APP_PUBLIC_URL + 'images/header/logo.png'} alt="" className="mb-5 successLogo" />
        <div className="blastImg">
          <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/success.png'} alt="" />
        </div>

        <div className="greetWrap text-center">
          <p className="infoTxt">Thank you for signing up!</p>
          <p className="subTxt">We will be contacting soon</p>
        </div>
      </div>
    </div>
  );
}
