import React, { useState } from 'react';
import './Login.css';
import './SignUp.css';
import { Alert, Button, Col, Container, Form, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { fetchCall } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { aboutSignet, apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import Loading from '../Widgets/Loading';


function ForgetPassword() {
  const [stateData, setStateData] = useState({
    email: '',
    validated: false,
    emailLength: '',
    validEmail: false,
    emailInput: false,
    alerMessage: '',
    alertVarient: '',
    showAlert: false,
    emailRegex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
  });
  const navigate = useNavigate();
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const validation = stateData.email.length === 0 || !stateData.emailRegex.test(stateData.email);

    setStateData((prevState) => ({
      ...prevState,
      emailLength: validation ? 'Please provide a valid email' : 'error',
      emailInput: validation,
    }));
  };

  const emailChange = (event) => {
    setStateData((prevState) => ({ ...prevState, email: event.target.value }));

    validateEmail();
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    validateEmail();
    buttonTracker(gaEvents.SEND_RESET_PASSWORD_LINK);
    if (form.checkValidity() === true) {
      event.stopPropagation();
      const { 0: statusCode, 1: responseData } = await fetchCall(
        APIUrlConstants.FORGET_PASSWORD_API + stateData.email,
        apiMethods.POST,
      );

      if (statusCode === httpStatusCode.SUCCESS) {
        setStateData((prevState) => ({
          ...prevState,
          showAlert: true,
          alertVarient: 'success',
          alertMessage: 'Please check the reset password link sent to your registered email.',
          validated: true,
          validEmail: true,
        }));
        setTimeout(() => {
          setStateData((prevState) => ({
            ...prevState,
            showAlert: false,
          }));
          setIsLoading(true);
          setTimeout(() => {
            navigate('/');
          }, 500);
        }, 4500);
      } else {
        setStateData((prevState) => ({
          ...prevState,
          showAlert: true,
          alertVarient: 'danger',
          alertMessage: responseData.message,
          validated: false,
          validEmail: false,
        }));
        setTimeout(() => {
          setStateData((prevState) => ({
            ...prevState,
            showAlert: false,
          }));
        }, 5000);
      }
    }
  };

  return (
    <Container fluid className="lognWrapper">
      {isLoading && <Loading />}
      {stateData.showAlert && (
        <Alert
          variant={stateData.alertVarient}
          className="alertWrapper"
          onClose={() => {
            setStateData((prevState) => ({ ...prevState, showAlert: false, alertMessage: '' }));
          }}
          dismissible
        >
          <Alert.Heading>{stateData.alertMessage}</Alert.Heading>
        </Alert>
      )}
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
                <h1>Forgot </h1>
                <h2>Your Password ?</h2>
                <h5 className="infoTxt">Please enter your email address below</h5>
              </div>
              <Form noValidate validated={stateData.validated} className="fromWrap" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail" className="inputWrapper">
                  <Form.Control
                    required
                    className="email-input"
                    type="email"
                    isInvalid={stateData.emailInput}
                    isValid={!stateData.emailInput && stateData.email.length > 0}
                    placeholder="Email"
                    autoComplete="off"
                    onChange={emailChange}
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/envelop.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">{stateData.emailLength}</Form.Control.Feedback>
                </Form.Group>
                <div className="formFooter d-flex align-items-center justify-content-center flex-column">
                  <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center emailBtn">
                    Submit
                  </Button>
                  <div className="optionRoot d-flex align-items-center">
                    <span>
                      Click here to{' '}
                      <Link to="/" onClick={() => linkTracker(gaEvents.NAVIGATE_LOGIN)}>
                        Login
                      </Link>
                    </span>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default ForgetPassword;
