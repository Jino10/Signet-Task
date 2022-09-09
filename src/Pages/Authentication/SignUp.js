import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SignUp.css';
import emailValidator from '../../EmailValidator';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { aboutSignet, apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Alerts from '../Widgets/Alerts';
import { fetchCall } from '../../Services/APIService';
import Loading from '../Widgets/Loading';
import { authentication } from '../../Config/FirebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [orgEmail, setOrgEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [otpAlertShow, setOtpAlertShow] = useState(false);
  const [variant, setVarient] = useState('');
  const target = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [validated, setValidated] = useState(false);
  const [validity, setValidity] = useState(false);
  const [validEmail, setEmailValid] = useState(false);
  const [validPhone, setPhoneValid] = useState(false);
  const [validOtp, setValidOtp] = useState(false);
  const [phoneVer, setPhoneVer] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [alertShow, setAlertShow] = useState(false);
  const [sucShow, setSucShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [toogle, setToogle] = useState(false);
  const [otpVer, setOtpVer] = useState(false);
  const [appVerifier, setAppVerifier] = useState(null);
  const [phoneUi, setPhoneUi] = useState('');
  const [otp, setOtp] = useState('');
  const [wrongOtp, setWrongOtp] = useState(false);
  const phoneNumber = '+91' + phone;
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();

  useEffect(() => {
    const timeId = setTimeout(() => {
      setAlertShow(false);
      setSucShow(false);
      setOtpAlertShow(false);
    }, 5000);
    const { search } = window.location;
    const params = new URLSearchParams(search);
    if (params.get('status') === 'success') {
      params.delete('status');
      setShowModal(true);
    }
    return () => {
      clearTimeout(timeId);
    };
  }, []);

  const handleClose = () => {
    setShowModal(false);
    window.location = '/signup';
  };

  const firstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const lastNameChange = (event) => {
    setLastName(event.target.value);
  };
  function formatPhoneNumber(x) {
    const formated = x.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    return formated;
  }
  const phoneChange = (event) => {
    setPhoneValid(event.target.value.length !== 10);
    const formattedPhoneNumber = formatPhoneNumber(event.target.value);
    setPhoneUi(formattedPhoneNumber);
    setPhone(event.target.value);
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: () => { },
      },
      authentication,
    );
  };

  const requestotp = () => {
    if (phone.length === 10) {
      // e.preventDefault();
      setToogle(true);
      !appVerifier && generateRecaptcha();
      const appRecaptchaVerifier = window.recaptchaVerifier;
      setAppVerifier(appRecaptchaVerifier);
      signInWithPhoneNumber(authentication, phoneNumber, appRecaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setVarient('success');
          setOtpAlertShow(true);
        })
        .catch(() => {
          setVarient('danger');
          setOtpAlertShow(true);
        });
    } else {
      setPhoneValid(true);
    }
  };

  const verifyotp = (e) => {
    const userOtp = e.target.value;
    setOtp(userOtp);
    if (userOtp.length === 6) {
      setValidOtp(false);
      const { confirmationResult } = window;
      confirmationResult
        .confirm(userOtp)
        .then(() => {
          setWrongOtp(false);
          setSucShow(true);
          setTimeout(() => {
            setSucShow(false);
          }, 5000);
          setOtpVer(true);
        })
        .catch(() => {
          setWrongOtp(true);
          setAlertShow('Invalid OTP');
          setTimeout(() => {
            setAlertShow(false);
          }, 5000);
        });
    } else {
      setValidOtp(true);
    }
  };
  function userEmailValidator(mail) {
    const ogEmail = emailValidator(mail);
    setEmailValid(ogEmail);
  }
  const orgEmailChange = (e) => {
    setOrgEmail(e.target.value);
    userEmailValidator(e.target.value);
  };

  const passwordChange = (event) => {
    const pattern = /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()\-_+={}[\]<>,.?\\/~`]).{8,}$/;
    setValidPassword(!event.target.value.match(pattern));
    setPassword(event.target.value);
    setConfirmPassword('');
  };

  const confirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setShow(password !== event.target.value);
  };

  const Organization = (event) => {
    setOrganization(event.target.value);
  };

  // Closing pop-up window
  const handlePopClose = () => setShow(false);

  // To accepting terms and conditions
  const onAgreeTermsChanage = () => {
    setAgreeTerms(true);
    handlePopClose();
  };

  // To decline terms and conditions
  const onDeclinedTerms = () => {
    setAgreeTerms(false);
    handlePopClose();
  };

  const handleSubmit = async (event) => {
    buttonTracker(gaEvents.CREATE_ACCOUNT_SIGNUP);
    event.preventDefault();
    setValidity(event.currentTarget.checkValidity());
    if (
      firstName.length > 0 &&
      lastName.length > 0 &&
      organization.length > 0 &&
      password.length > 0 &&
      password === confirmPassword &&
      agreeTerms &&
      !validEmail
    ) {
      if (otpVer === true) {
        event.stopPropagation();
        setIsLoading(true);
        const { 0: statusCode, 1: responseData } = await fetchCall(APIUrlConstants.REGISTRATION, apiMethods.POST, {
          firstName,
          lastName,
          orgName: organization,
          orgEmail,
          password,
          primaryPhone: phone,
          isMobileVerify: true,
        });

        if (statusCode === httpStatusCode.SUCCESS) {
          setShowModal(true);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          setAlertShow(responseData.message);
        }
      } else {
        setPhoneVer(true);
      }
    } else if (password !== confirmPassword) {
      setShow(true);
    }
    setValidated(true);
  };

  // Showing pop-up window
  const handleShow = () => {
      setShow(true);
    }

  return (
    <Container fluid className="signUpWrapper">
      {alertShow && (
        <Alerts
          variant="danger"
          onClose={() => {
            setAlertShow(false);
          }}
          alertshow={alertShow}
        />
      )}

      {sucShow && (
        <Alerts
          variant="success"
          onClose={() => {
            setSucShow(false);
          }}
          alertshow="OTP Verified"
        />
      )}
      {otpAlertShow && (
        <Alerts
          variant={variant}
          onClose={() => {
            setOtpAlertShow(false);
          }}
          alertshow={variant === 'success' ? 'OTP sent to your phone number' : 'something went worng '}
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
          <div className="boxRight d-flex flex-column align-items-center">
            <div className="mainWrap d-flex flex-column justify-content-center">
              <div className="regTxt d-flex align-items-start flex-column">
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/logo.png'} alt="" className="logoImg" />
              </div>
              <Form noValidate validated={validated} className="fromWrap" onSubmit={handleSubmit}>
                <Form.Group controlId="formFirstName" className="inputHolder">
                  <Form.Control
                    required
                    pattern="^[a-zA-Z0-9]+$"
                    type="text"
                    placeholder="First Name"
                    autoComplete="off"
                    value={firstName}
                    onChange={firstNameChange}
                    data-validity={validity}
                  />
                  <Form.Control.Feedback type="invalid">Enter a valid First Name</Form.Control.Feedback>
                </Form.Group>
                <Form.Group controlId="formLastName" className="inputHolder">
                  <Form.Control
                    required
                    pattern="^[a-zA-Z0-9]+$"
                    type="text"
                    placeholder="Last Name"
                    autoComplete="off"
                    value={lastName}
                    onChange={lastNameChange}
                    data-validity={validity}
                  />
                  <Form.Control.Feedback type="invalid">Enter a valid Last Name</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="inputHolder">
                  <Form.Control
                    required
                    type="email"
                    placeholder="Organization Email"
                    autoComplete="off"
                    value={orgEmail}
                    onChange={orgEmailChange}
                    isInvalid={validEmail}
                    data-validity={validEmail}
                  />

                  <Form.Control.Feedback type="invalid">Organization Email is required</Form.Control.Feedback>
                </Form.Group>
                {toogle === true ? (
                  <Row>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formPhone">
                        <Form.Control
                          required
                          type="text"
                          placeholder="Phone Number"
                          autoComplete="off"
                          value={phoneUi}
                          onChange={phoneChange}
                          data-validity={validity}
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} md={6}>
                      <Form.Group controlId="formOtp" className="inputHolder">
                        <Form.Control
                          required
                          type="text"
                          placeholder="OTP"
                          autoComplete="off"
                          value={otp}
                          onChange={verifyotp}
                          isInvalid={validOtp || wrongOtp}
                          data-testid="OTP"
                          data-validity={validity}
                        />
                        <div className="d-flex flex-row-reverse align-items-center widthFull">
                          <Button
                            data-testid="resendOTP"
                            className="resendText"
                            onClick={() => {
                              requestotp();
                              buttonTracker(gaEvents.RESEND_OTP);
                            }}
                          >
                            Resend OTP
                          </Button>
                          {validOtp === true ? <p className="otpError">Enter a valid OTP</p> : null}
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                ) : null}
                {toogle === false ? (
                  <Row>
                    <Col xs={12} md={12}>
                      <div className="d-flex  align-items-start w-100 customVerifyBox">
                        <Form.Group controlId="formPhone" className="inputHolder w-100">
                          <Form.Control
                            required
                            pattern="^\(\d{3}\)\s\d{3}-\d{4}"
                            type="text"
                            placeholder="Phone Number"
                            autoComplete="off"
                            value={phoneUi}
                            onChange={phoneChange}
                            isInvalid={validPhone}
                            data-validity={validity}
                          />
                          {validPhone === true ? (
                            <Form.Control.Feedback type="invalid" data-testid="phonerr">
                              Enter a valid Phone Number
                            </Form.Control.Feedback>
                          ) : null}
                          {phoneVer === true ? (
                            <Form.Control.Feedback className="errorColor">Verify Phone Number</Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                        <Button
                          className="verifyBtn"
                          variant="primary"
                          type="submit"
                          onClick={() => {
                            requestotp();
                            buttonTracker(gaEvents.SEND_OTP);
                          }}
                          data-testid="verifybtn"
                        >
                          <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/verify.svg'} alt="" /> Verify
                        </Button>
                      </div>
                    </Col>
                  </Row>
                ) : null}
                <div id="sign-in-button" />
                <Row>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formPassword" className="inputHolder">
                      <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={passwordChange}
                        isInvalid={validPassword}
                        data-validity={validPassword}
                      />
                      <Form.Control.Feedback type="invalid">
                        The password entered is not strong, Please enter a strong password with minimum 8 characters, a capital
                        letter and a special character
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formConfirmPassword" ref={target} className="inputHolder">
                      <Form.Control
                        required
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={confirmPasswordChange}
                        isInvalid={show}
                        isValid={!show && confirmPassword.length > 0}
                        data-validity={show}
                      />
                      <Form.Control.Feedback type="invalid">Password did not match</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formOrganization">
                      <Form.Control
                        required
                        type="text"
                        placeholder="Organization"
                        value={organization}
                        autoComplete="off"
                        onChange={Organization}
                        data-validity={validity}
                      />
                      <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formBasicCheckbox" className="customCheck mb-2 mt-2">
                  <Form.Check.Input
                    data-validity={validity}
                    data-testid="termsCheckbox"
                    required
                    checked={agreeTerms && true}
                  />
                  <Form.Check.Label className="p-2">Agree to <Link to="/signup" onClick={handleShow}>terms and conditions</Link></Form.Check.Label>
                  <Form.Control.Feedback type="invalid">Please agree to terms and conditions</Form.Control.Feedback>
                </Form.Group>
                <div className="formFooter d-flex align-items-center justify-content-center flex-column mb-1">
                  <Button variant="primary" type="submit" className="d-flex align-items-center justify-content-center">
                    Create Account{' '}
                  </Button>
                  <div className="optionRoot d-flex align-items-center">
                    <span>
                      Already have an account?{' '}
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
      <Modal show={showModal} onHide={handleClose} centered className="sucessModal">
        <Modal.Header closeButton />
        <Modal.Body className="modal-body d-flex align-items-center justify-content-center flex-column">
          <div className="blastImg">
            <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/success.png'} alt="" />
          </div>
          <div className="greetWrap text-center">
            <p className="infoTxt">Thank you for signing up!</p>
            <p>Please click the verification link sent to your organization email</p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Modal for terms and conditions */}
      <Modal show={show} onHide={handlePopClose} aria-labelledby="contained-modal-title-vcenter"
        centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>By Agreeing to Terms and Conditions...!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Please read the following terms and conditions as these terms of use (Terms) constitute a legally binding agreement between you and the Company regarding your use of the Site and/or the services provided by the Company which include but not limited to aggregation of important news, newsletters, analysis focusing on IT industry or availability of various types of content through the Site or any mobile or internet connected device or otherwise (the Services).</Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={onAgreeTermsChanage}>
            Accept
          </Button>
          <Button variant="danger" onClick={onDeclinedTerms}>
            Declined
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}
export default SignUp;
