import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row, Modal } from 'react-bootstrap';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { aboutSignet, apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import Loading from '../Widgets/Loading';
import './Login.css';
import './SignUp.css';
import { fetchCall } from '../../Services/APIService';
import { useNavigate } from 'react-router-dom';
import Alerts from '../Widgets/Alerts';
import { useForm } from 'react-hook-form';
import { authentication } from '../../Config/FirebaseConfig';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { userRoleId } from '../../Utilities/AppUtilities';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { getFCRestoreId } from '../Chats/FreshChat';

function GetSSOUserdetails() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [isOrgName, setIsOrgName] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVarient, setAlertVarient] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [validPhone, setPhoneValid] = useState(false);
  const [phoneUi, setPhoneUi] = useState('');
  const [toogle, setToogle] = useState(false);
  const [appVerifier, setAppVerifier] = useState(null);
  const [validOtp, setValidOtp] = useState(false);
  const [otpVer, setOtpVer] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLastName, setIsLastName] = useState(true);
  const [otp, setOtp] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [wrongOtp, setWrongOtp] = useState(false);
  const { buttonTracker } = useAnalyticsEventTracker();

  const [user, setUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    orgEmail: '',
    orgName: '',
    roleId: '',
    status: '',
    userId: '',
    primaryPhone: '',
    isMobileVerify: false,
  });
  const navigate = useNavigate();

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  const getUserDetails = useCallback(async () => {
    setIsLoading(true);
    const { 0: status, 1: responseData } = await fetchCall(APIUrlConstants.GET_SSO_USER_DETAILS, apiMethods.POST);
    const res = responseData.data;
    if (status === httpStatusCode.SUCCESS) {
      setUser({
        email: res.email,
        firstName: res?.firstName ?? '',
        lastName: res?.lastName ?? '',
        orgEmail: res?.orgEmail ?? '',
        orgName: res?.orgName ?? '',
        roleId: res?.roleId ?? '',
        status: res?.status ?? '',
        primaryPhone: res?.mobileNumber ?? '',
        userId: res?.userId ?? '',
        isMobileVerify: res?.isMobileVerify ?? false,
      });
      setIsOrgName(!!res.orgName);
      setIsLastName(!!res.lastName);
      setIsLoading(false);
      if (res.roleId) {
        const userData = {
          email: res.email,
          firstName: res.firstName,
          lastName: res.lastName,
          mobileNumber: res.mobilePhone,
          emailId: res.orgEmail,
          orgName: res.orgName,
          orgNo: res.orgNo,
          userId: res.userId,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', res.access_token);
        localStorage.setItem('roleId', res.roleId);
        localStorage.setItem('email', res.orgEmail);
        localStorage.setItem('id', res.userId);
        localStorage.setItem('lastName', res.lastName);
        localStorage.setItem('firstName', res.firstName);
        localStorage.setItem('contactSales', res.isContactSales);
        localStorage.setItem('isSocial', res.isSocial);
        localStorage.setItem('orgName', res.orgName);
        localStorage.setItem('orgNo', res.orgNo);
        localStorage.setItem('mobile', res.mobilePhone);
        localStorage.setItem('probe', res.probe);
        getFCRestoreId().then();
        let redirectTo = '/';
        switch (localStorage.getItem('token') && res.roleId) {
          case userRoleId.signetAdmin:
            redirectTo = '/users';
            break;
          case userRoleId.nonRemoteSmartUser:
            redirectTo = '/tickets';
            break;
          case userRoleId.remoteSmartUser:
            redirectTo = '/tickets';
            break;
          default:
            redirectTo = '/';
            break;
        }
        navigate(redirectTo);
      }
      if (responseData.message === 'Success') {
        setIsAuthenticated(true);
      }
    } else {
      setShowAlert(true);
      setAlertVarient('danger');
      setAlertMessage(responseData?.message ?? 'Something went wrong contact Admin');
      if (responseData?.message === "You can't sign in here with a personal account. Use your work or school account instead.") {
        localStorage.setItem('personalEmailLogin', responseData?.message);
        localStorage.removeItem('temp_token');
        navigate('/');
      } else {
        setIsLoading(false);
        localStorage.removeItem('temp_token');
        setTimeout(() => {
          navigate('/');
          setShowAlert(false);
        }, 5000);
      }
    }
  }, [navigate]);

  const redirecttologin = useCallback(
    () => (localStorage.getItem('temp_token') ? getUserDetails() : navigate('/')),
    [getUserDetails, navigate],
  );

  useEffect(() => {
    redirecttologin();
  }, [redirecttologin]);

  const updateUser = async () => {
    buttonTracker(gaEvents.UPDATE_SSO_USER_DETAILS);
    if (otpVer === true || !user.orgName) {
      setIsLoading(true);
      const { 0: statusCode, 1: responseData } = await fetchCall(APIUrlConstants.CREATE_USER_WITH_ORG, apiMethods.POST, user);
      if (statusCode === httpStatusCode.SUCCESS) {
        localStorage.removeItem('temp_token');
        setIsLoading(false);
        setShowModal(true);
      } else {
        setShowAlert(true);
        setAlertVarient('danger');
        setIsLoading(false);
        setAlertMessage(responseData.message);
        localStorage.removeItem('temp_token');
        setTimeout(() => {
          navigate('/');
        }, 5000);
      }
    } else {
      setShowAlert(true);
      setAlertVarient('danger');
      setIsLoading(false);
      setAlertMessage('Please fill required fields');
      setTimeout(() => {
        setShowAlert(false);
      }, 5000);
    }
  };
  function formatPhoneNumber(x) {
    const formated = x.replace(/\D+/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');

    return formated;
  }

  const phoneChange = (e) => {
    setPhoneValid(e.target.value.length !== 10);
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setPhoneUi(formattedPhoneNumber);
    setUser((prevState) => ({ ...prevState, primaryPhone: e.target.value }));
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      'sign-in-button',
      {
        size: 'invisible',
        callback: () => {},
      },
      authentication,
    );
  };
  const phoneNumber = '+1' + user.primaryPhone;
  const requestOtp = (e) => {
    if (user.primaryPhone.length === 10) {
      e.preventDefault();
      setToogle(true);
      !appVerifier && generateRecaptcha();
      const appRecaptchaVerifier = window.recaptchaVerifier;
      setAppVerifier(appRecaptchaVerifier);
      signInWithPhoneNumber(authentication, phoneNumber, appRecaptchaVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          setAlertVarient('success');
          setAlertMessage('OTP sent successfully');
          setShowAlert(true);
        })
        .catch(() => {
          setAlertVarient('danger');
          setAlertMessage('Something went wrong');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
        });
    } else {
      setPhoneValid(true);
    }
  };

  const verifyOtp = (e) => {
    const userOtp = e.target.value;
    setOtp(userOtp);
    if (userOtp.length === 6) {
      setValidOtp(false);
      const { confirmationResult } = window;
      confirmationResult
        .confirm(userOtp)
        .then(() => {
          setWrongOtp(false);
          setAlertVarient('success');
          setAlertMessage('OTP verified successfully');
          setShowAlert(true);
          setUser((prevState) => ({ ...prevState, isMobileVerify: true }));
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
          setOtpVer(true);
        })
        .catch(() => {
          setWrongOtp(true);
          setAlertVarient('danger');
          setAlertMessage('Invalid OTP');
          setShowAlert(true);
          setTimeout(() => {
            setShowAlert(false);
          }, 5000);
          setOtpVer(true);
        });
    } else {
      setValidOtp(true);
    }
  };
  return (
    <Container fluid className="lognWrapper">
      {showAlert && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setShowAlert(false);
          }}
          alertshow={alertMessage}
        />
      )}
      <div id="sign-in-button" />
      {isLoading ? (
        <Loading />
      ) : (
        !isAuthenticated && (
          <div>
            {' '}
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
                  <div className="ssoWrap mainWrap d-flex align-items-flex-start flex-column justify-content-center">
                    <div className="regTxt d-flex align-items-start flex-column">
                      <h1>Enter Details </h1>
                    </div>

                    <Form onSubmit={handleSubmit(updateUser)}>
                      {!isOrgName ? (
                        <div className="mb-2">
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name="organization"
                              className="input user-detail-button"
                              placeholder="Organization"
                              id="organization"
                              {...register('Organization', {
                                required: 'organization name is required',
                              })}
                              onChange={(e) => {
                                setUser((prevState) => ({ ...prevState, orgName: e.target.value }));
                              }}
                              value={user?.orgName}
                            />
                            {errors.Organization && <p className="text-danger">{errors.Organization.message}</p>}
                          </Form.Group>
                        </div>
                      ) : null}
                      {!isLastName ? (
                        <div className="mb-2">
                          <Form.Group>
                            <Form.Control
                              type="text"
                              name="lastName"
                              className="input user-detail-button"
                              placeholder="Last Name"
                              id="lastName"
                              {...register('LastName', {
                                required: 'last name is required',
                              })}
                              onChange={(e) => {
                                setUser((prevState) => ({ ...prevState, lastName: e.target.value }));
                              }}
                              value={user?.lastName}
                            />
                            {errors.LastName && <p className="text-danger">{errors.LastName.message}</p>}
                          </Form.Group>
                        </div>
                      ) : null}

                      {toogle === true ? (
                        <Row>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="formPhone">
                              <Form.Control
                                required
                                className="user-detail-button"
                                type="text"
                                placeholder="Phone Number"
                                autoComplete="off"
                                value={phoneUi}
                                onChange={phoneChange}
                              />
                            </Form.Group>
                          </Col>
                          <Col xs={12} md={6}>
                            <Form.Group controlId="formOtp" className="inputHolder">
                              <Form.Control
                                required
                                type="text"
                                className="user-detail-button"
                                placeholder="OTP"
                                autoComplete="off"
                                value={otp}
                                onChange={verifyOtp}
                                isInvalid={validOtp || wrongOtp}
                              />
                              <div className="d-flex flex-row-reverse align-items-center widthFull">
                                <Button
                                  className="resendText"
                                  onClick={() => {
                                    requestOtp();
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
                                  className="user-detail-button"
                                  pattern="^\(\d{3}\)\s\d{3}-\d{4}"
                                  type="text"
                                  placeholder="Phone Number"
                                  autoComplete="off"
                                  value={user?.primaryPhone}
                                  onChange={phoneChange}
                                  isInvalid={validPhone}
                                />
                                {validPhone === true ? (
                                  <Form.Control.Feedback type="invalid" data-testid="phonerr">
                                    Enter a valid Phone Number
                                  </Form.Control.Feedback>
                                ) : null}
                              </Form.Group>
                              <div className="verify-button-wrap">
                                <Button
                                  className="verifyBtn btn-block mt-0"
                                  variant="primary"
                                  type="submit"
                                  onClick={() => {
                                    requestOtp();
                                    buttonTracker(gaEvents.SEND_OTP);
                                  }}
                                  data-testid="verifybtn"
                                >
                                  <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/verify.svg'} alt="" /> Verify
                                </Button>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      ) : null}

                      <div className="d-flex justify-content-md-start justify-content-sm-center justify-content-center">
                        <input
                          className="buttonPrimary text-center mb-5 mt-4 me-2 update-button-wrap"
                          type="submit"
                          value="Update"
                        />
                      </div>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        )
      )}
      <Modal show={showModal} onHide={handleClose} centered className="sucessModal">
        <Modal.Header closeButton />
        <Modal.Body className="modal-body d-flex align-items-center justify-content-center flex-column">
          <div className="blastImg">
            <img src={process.env.REACT_APP_PUBLIC_URL + 'images/signup/success.png'} alt="" />
          </div>
          <div className="greetWrap text-center">
            <p className="infoTxt">Thank you for signing up!</p>
            <p>We will be contacting you soon</p>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default GetSSOUserdetails;
