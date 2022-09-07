import React, { useCallback, useEffect, useState } from 'react';
import './Login.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { aboutSignet, apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import { failedlogin, startlogin, successlogin } from '../../Redux/Actions/Actions';
import { fetchCall } from '../../Services/APIService';
import Alerts from '../Widgets/Alerts';
import Loading from '../Widgets/Loading';
import { GOOGLE_LOGIN_URL, MICROSOFT_LOGIN_URL } from '../../Config/Environment';
import { getFCRestoreId } from '../Chats/FreshChat';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

function Login() {
  const navigate = useNavigate();
  const state = useSelector((stateR) => stateR.UserReducer);
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);
  const [validity, setValidity] = useState(false);
  const [alertShow, setAlertShow] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();

  const path = useLocation();

  const ssoLogin = useCallback(() => {
    if (path.hash.includes('#access_token=')) {
      setIsLoading(true);
      const res = path.hash.split('&');
      const tempToken = res[0].split('#access_token=');
      localStorage.setItem('temp_token', tempToken[1]);
      navigate('/getuserdetails');
    } else if (path.hash.includes('#state=')) {
      setAlertShow('Your account is not active. Contact support at appsupport@signetgroup.net');
      setIsLoading(false);
    }
  }, [navigate, path.hash]);

  useEffect(() => {
    if (!state.isFetching) {
      setAlertShow(state.isError);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
    ssoLogin();
  }, [ssoLogin, state]);

  useEffect(() => {
    setIsLoading(false);
    if (localStorage.getItem('personalEmailLogin')) {
      setAlertShow(localStorage.getItem('personalEmailLogin'));
      localStorage.removeItem('personalEmailLogin');
      setTimeout(() => {
        setAlertShow(false);
      }, 5000);
    }
    return () => {
      setEmail('');
      setPassword('');
      setIsLoading(false);
    };
  }, []);

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    setValidity(form.checkValidity());
    if (form.checkValidity() === true) {
      event.stopPropagation();
      dispatch(startlogin());

      const urlencoded = new URLSearchParams();
      urlencoded.append('username', email);
      urlencoded.append('password', password);

      const { 0: statuscode, 1: data } = await fetchCall(APIUrlConstants.LOGIN_API, apiMethods.POST, urlencoded);
      const responseData = data;
      if (statuscode === httpStatusCode.SUCCESS) {
        const isMobileVerifydata = responseData.data.isMobileVerify;
        localStorage.setItem('id', responseData.data.userId);
        getFCRestoreId().then();
        buttonTracker(gaEvents.LOGIN_VIA_EMAIL);
        if (isMobileVerifydata === false) {
          const datas = responseData.data;
          dispatch(successlogin(responseData.data));
          navigate('/otpverify', { state: { datas } });
        } else {
          localStorage.setItem('id', responseData.data.userId);
          localStorage.setItem('email', email);
          localStorage.setItem('orgName', responseData.data.orgName);
          localStorage.setItem('orgNo', responseData.data.orgNo);
          localStorage.setItem('probe', responseData.data.probe);
          localStorage.setItem('isSocial', responseData.data.isSocial);
          localStorage.setItem('firstName', `  ${responseData.data.firstName}`);
          localStorage.setItem('lastName', `${responseData.data.lastName}`);
          localStorage.setItem('id', responseData.data.userId);
          dispatch(successlogin(responseData.data));
          navigate('/twofactor');
        }
      } else if (localStorage.getItem('id')) {
        window.location = '/';
      } else {
        dispatch(failedlogin(responseData.message));
      }
    }
    setValidated(true);
  };

  return (
    <Container fluid className="lognWrapper">
      {alertShow && (
        <Alerts
          variant="danger"
          onClose={() => {
            setAlertShow('');
          }}
          alertshow={alertShow}
        />
      )}
      {isLoading && <Loading />}
      <Row>
        <Col lg={6} md={12} sm={12} className="d-none d-lg-block p-0">
          <div className="boxLeft d-flex align-items-center justify-content-center">
            <div className="boxWrap d-flex align-items-center justify-content-center flex-column text-center">
              <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/rafiki.png'} alt="" />
              <p>{aboutSignet}</p>
            </div>
          </div>
        </Col>
        <Col lg={6} md={12} sm={12} xs={12}>
          <div className="boxRight d-flex align-items-center">
            <div className="mainWrap d-flex align-items-flex-start flex-column justify-content-center">
              <div className="regTxt d-flex align-items-start flex-column">
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/logo.png'} alt="" />
              </div>
              <Form noValidate validated={validated} className="fromWrap" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="inputWrapper emailInput">
                  <Form.Control
                    required
                    className="email-input"
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={email}
                    onChange={emailChange}
                    data-validity={validity}
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/envelop.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">Please provide a valid email</Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="formBasicPassword"
                  className={`inputWrapper passwordInput${password.length > 8 ? 'formValid' : 'formInvalid'}`}
                >
                  <Form.Control
                    required
                    className="password-input"
                    type="password"
                    placeholder="Password"
                    autoComplete="off"
                    value={password}
                    onChange={passwordChange}
                    data-validity={validity}
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/key.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">Please provide a valid password</Form.Control.Feedback>
                </Form.Group>
                <div className="forgotBox d-flex align-items-center justify-content-between mt-3">
                  <Form.Group controlId="formBasicCheckbox" className="customCheck" />
                  <Link
                    to="/forgotpassword"
                    onClick={() => {
                      linkTracker(gaEvents.NAVIGATE_FORGOT_PASSWORD);
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="formFooter d-flex align-items-center justify-content-center flex-column">
                  <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                    Login{' '}
                  </Button>
                  <span className="orTxt">Or</span>
                  <div className="signBox d-flex align-items-center justify-content-center">
                    <a
                      data-testid="googleURL"
                      href={GOOGLE_LOGIN_URL}
                      onClick={() => {
                        linkTracker(gaEvents.LOGIN_VIA_GOOGLE);
                      }}
                    >
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/google.png'} alt="Google" />
                    </a>
                    <a
                      data-testid="microsoftURL"
                      href={MICROSOFT_LOGIN_URL}
                      onClick={() => {
                        linkTracker(gaEvents.LOGIN_VIA_MICROSOFT);
                      }}
                    >
                      <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/microsoft.png'} alt="Microsoft" />
                    </a>
                  </div>
                  <span>
                    Not a user?{' '}
                    <Link to="/signup" onClick={() => linkTracker(gaEvents.NAVIGATE_SIGNUP)}>
                      Create an account
                    </Link>
                  </span>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
