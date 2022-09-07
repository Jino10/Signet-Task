import React, { useCallback, useEffect, useState } from 'react';
import './Success.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { makeRequest } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { httpStatusCode } from '../../Constants/TextConstants';

export default function Success() {
  const navigate = useNavigate();
  const [stateData, setStateData] = useState({
    statusCode: null,
    successMessage: 'Please wait...',
    successSubMessage: 'We will be contacting soon',
    showSuccessIcon: false,
  });
  const [searchParams] = useSearchParams();
  const name = searchParams.get('name');

  const fetchPost = useCallback(async () => {
    const response = await makeRequest(
      `${APIUrlConstants.APPROVAL_REQUEST_API}/${localStorage.getItem('verifyUserId')}?name=${name}`,
      {},
    );
    localStorage.removeItem('verifyUserId');
    if (response[0] === httpStatusCode.SUCCESS) {
      setStateData((prevState) => ({
        ...prevState,
        statusCode: 200,
        showSuccessIcon: true,
        successMessage: 'Thank you for signing up!',
      }));
    } else {
      setStateData((prevState) => ({
        ...prevState,
        statusCode: 400,
        successMessage: response[1].message,
        showSuccessIcon: false,
      }));
    }
  }, [name]);

  useEffect(() => {
    const pathname = window.location.pathname.split('/email/verifyemail/');
    const userId = pathname[1];
    if (userId) {
      localStorage.setItem('verifyUserId', userId);
      fetchPost();
    } else if (!localStorage.getItem('verifyFirstName')) {
      navigate('/');
    } else {
      fetchPost();
    }
  }, [fetchPost, navigate]);
  return (
    <div className="succesWrap d-flex align-items-center justify-content-center">
      <div className="successBox d-flex align-items-center justify-content-center flex-column">
        <img src={process.env.REACT_APP_PUBLIC_URL + 'images/header/logo.png'} alt="" className="mb-5 successLogo" />
        {stateData.showSuccessIcon && (
          <div className="blastImg">
            <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/success.png'} alt="" />
          </div>
        )}

        <div className="greetWrap text-center">
          <p className="infoTxt">{stateData.successMessage}</p>
          {stateData.showSuccessIcon && <p className="subTxt">{stateData.successSubMessage}</p>}
        </div>
      </div>
    </div>
  );
}
