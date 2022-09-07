import React, { useEffect, useState } from 'react';
import './Login.css';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loading from '../Widgets/Loading';
import { aboutSignet, apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { fetchCall } from '../../Services/APIService';
import Alerts from '../Widgets/Alerts';
import { BRANCHIO } from '../../Config/Environment';
import { isMobile } from 'react-device-detect';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

function ResetPassword() {
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [passwordHint, setPasswordHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertShow, setIsAlertShow] = useState(false);
  const [alertData, setAlertData] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('userId')) {
      localStorage.setItem('restPasswordUserId', queryParams.get('userId'));
      window.location.href = '/resetpassword';
    } else if (!localStorage.getItem('restPasswordUserId')) {
      navigate('/');
    }
  }, [navigate]);

  const handleClose = () => {
    setShowModal(false);
    window.location = '/';
  };

  const passwordChange = (e) => {
    const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()\-_+={}[\]<>,.?\\/~`]).{8,}$/;
    setPasswordValue(e.target.value);
    if (!e.target.value.match(pattern)) {
      setPasswordHint(true);
    } else {
      setPasswordHint(false);
    }
  };

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    buttonTracker(gaEvents.RESET_PASSWORD);
    if (form.checkValidity() === true) {
      event.stopPropagation();
      setIsLoading(true);

      const data = {
        password: confirmPasswordValue,
        userId: localStorage.getItem('restPasswordUserId'),
      };
      const { 0: statusCode, 1: responseData } = await fetchCall(APIUrlConstants.RESET_PASSWORD_API, apiMethods.POST, data);

      setIsAlertShow(true);
      setIsLoading(false);
      if (statusCode === httpStatusCode.SUCCESS) {
        if (isMobile) {
          setShowModal(true);
          localStorage.removeItem('restPasswordUserId');
        } else {
          setAlertVariant('success');
          setAlertData('Your password has been changed successfully');
          setTimeout(() => {
            localStorage.removeItem('restPasswordUserId');
            window.location = BRANCHIO;
          }, 5000);
        }
      } else {
        setAlertVariant('danger');
        setAlertData(responseData.message);
      }
    }
    setValidated(true);
  };

  return (
    <Container fluid className="lognWrapper">
      {isAlertShow && (
        <Alerts
          variant={alertVariant}
          onClose={() => {
            setIsAlertShow(false);
            setAlertData('');
          }}
          alertshow={alertData}
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
                <h1>Reset </h1>
                <h2>Your Password</h2>
                <h5 className="infoTxt">Please enter your new password below</h5>
              </div>

              <Form noValidate validated={validated} className="fromWrap" onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicPassword" className="inputWrapper mb-2">
                  <Form.Control
                    required
                    className="email-input"
                    type="password"
                    isInvalid={passwordHint}
                    value={passwordValue}
                    autoComplete="off"
                    onChange={passwordChange}
                    placeholder="New password"
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/key.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">
                    The password entered is not strong, Please enter a strong password with minimum 8 characters, a capital letter
                    and a special character
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPassword" className="inputWrapper">
                  <Form.Control
                    required
                    className="email-input"
                    type="password"
                    isInvalid={confirmPasswordValue.length > 0 && passwordValue !== confirmPasswordValue}
                    value={confirmPasswordValue}
                    autoComplete="off"
                    onChange={(e) => setConfirmPasswordValue(e.target.value)}
                    placeholder="Confirm password"
                  />
                  <img className="inputIcon" src={process.env.REACT_APP_PUBLIC_URL + 'images/login/key.svg'} alt="" />
                  <Form.Control.Feedback type="invalid">Password did not match </Form.Control.Feedback>
                </Form.Group>
                <div className="formFooter d-flex align-items-center justify-content-center flex-column">
                  <Button
                    variant="primary"
                    type="submit"
                    className="d-flex align-items-center justify-content-center"
                    disabled={
                      !passwordValue ||
                      !confirmPasswordValue ||
                      passwordValue !== confirmPasswordValue ||
                      passwordValue.length < 8 ||
                      confirmPasswordValue.length < 8
                    }
                  >
                    Submit{' '}
                  </Button>
                  <div className="optionRoot d-flex align-items-center">
                    <span>
                      Click here to{' '}
                      <a href={BRANCHIO} onClick={() => linkTracker(gaEvents.NAVIGATE_LOGIN)}>
                        Login
                      </a>
                    </span>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Col>
      </Row>
      <Modal show={showModal} onHide={handleClose} centered className="sucessModal">
        <Modal.Header closeButton />
        <Modal.Body className="modal-body d-flex align-items-center justify-content-center flex-column">
          <div className="blastImg">
            <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/success.png'} alt="" />
          </div>
          <div className="greetWrap text-center">
            <p className="infoTxt">Your password has been changed successfully</p>
            <br />
            <p>Open this site in Signet App</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="p-3">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <a href={BRANCHIO}>
            <Button variant="primary">Ok</Button>
          </a>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ResetPassword;
