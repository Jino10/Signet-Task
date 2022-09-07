import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Form, Modal } from 'react-bootstrap';
import { apiMethods, gaEvents, httpStatusCode } from '../../Constants/TextConstants';
import { fetchCall, makeRequest } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import emailValidator from '../../EmailValidator';
import Alerts from '../Widgets/Alerts';
import Loading from '../Widgets/Loading';
import AsyncSelect from 'react-select/async';
import { useNavigate, useLocation } from 'react-router-dom';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

function UserModal({ userId, successCallback }) {
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertVarient, setAlertVarient] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [userFirstName, setUserFirstName] = useState('');
  const [userLastName, setUserLastName] = useState('');
  const [showOrgEmail, setShowOrgMail] = useState(false);
  const [userOrgEmail, setOrgMail] = useState('');
  const [userOrg, setUserOrg] = useState('');
  const [userRole, setUserRole] = useState('');
  const [roleValidated, setRoleValidated] = useState(false);
  const [validated, setValidated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [orgNameAlert, setOrgNameAlert] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const closeAlert = () => setShowAlert(false);
  const changeUserFirstName = (e) => setUserFirstName(e.target.value);
  const changeUserLastName = (e) => setUserLastName(e.target.value);
  const changeUserOrg = (e) => setUserOrg(e.target.value);
  const openCreateUserModal = () => {
    setShowCreateUserModal(true);
    buttonTracker(gaEvents.OPEN_CREATE_USER);
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      height: 50,
      minHeight: 35,
      border: orgNameAlert && '1px solid red',
    }),
  };

  function userEmailValidator(email) {
    const orgEmail = emailValidator(email);
    setShowOrgMail(orgEmail);
  }

  const changeUserOrgEmail = (e) => {
    setOrgMail(e.target.value);
    userEmailValidator(e.target.value);
  };
  const changeUserRole = (e) => {
    if (e.target.value === '') {
      setRoleValidated(true);
      setUserRole(e.target.value);
    } else {
      setRoleValidated(false);
      setUserRole(e.target.value);
    }
  };

  const clearState = () => {
    setUserFirstName('');
    setUserLastName('');
    setUserOrg('');
    setShowOrgMail('');
    setOrgMail('');
    setRoleValidated(false);
    setUserRole('');
    setValidated(false);
    setSelectedValue('');
  };

  const closeCreateUserModal = () => {
    setShowCreateUserModal(false);
    clearState();
    navigate('/users');
  };

  const handleChange = (value) => {
    if (value.companyName) {
      setOrgNameAlert(false);
    }
    setSelectedValue(value);
  };

  const loadOptions = async (searchtext) => {
    if (searchtext.length >= 3) {
      const response = await makeRequest(`${APIUrlConstants.SEARCH_ORG}?company=${searchtext}`);
      const statusCode = response[0];
      const responseData = response[1];
      if (httpStatusCode.SUCCESS === statusCode) {
        return responseData.data;
      }
      return responseData.data;
    }
    return null;
  };

  const fetchUserDetails = useCallback(async () => {
    const { 0: status, 1: data } = await makeRequest(`${APIUrlConstants.GET_USER_DETAILS}/${userId}`);
    const result = data;
    if (status === httpStatusCode.SUCCESS && result.data.status !== 'Active') {
      setShowCreateUserModal(true);
      setUserLastName(result.data.lastName);
      setUserFirstName(result.data.firstName);
      setUserOrg(result.data.organization);
      setOrgMail(result.data.orgEmail);
    } else if (status === httpStatusCode.SUCCESS && result.data.status === 'Active') {
      setShowAlert(true);
      setAlertMessage('User already active');
      setAlertVarient('danger');
      setIsLoading(false);
      setTimeout(() => {
        closeCreateUserModal();
        closeAlert();
        clearState();
      }, 5000);
    }
  }, [userId]);

  const fetchRoles = async () => {
    const { 0: status, 1: res } = await makeRequest(APIUrlConstants.GET_USER_ROLES);

    const result = res.data;
    if (status === httpStatusCode.SUCCESS) {
      setRoles(result);
    }
  };
  useEffect(() => {
    if (userId && location.pathname !== '/users') {
      fetchUserDetails();
    }
    fetchRoles();
  }, [fetchUserDetails, userId]);

  const createNewUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let user = {
      firstName: userFirstName,
      lastName: userLastName,
      orgName: selectedValue?.companyName,
      orgEmail: userOrgEmail,
      roleId: userRole,
      orgNo: selectedValue?.customerNo,
    };
    if (!selectedValue) {
      setOrgNameAlert(true);
    } else {
      setOrgNameAlert(false);
    }

    if (
      e.currentTarget.checkValidity() !== false &&
      selectedValue &&
      userRole.length > 0 &&
      userRole !== '' &&
      userOrgEmail.length > 0
    ) {
      e.stopPropagation();
      setValidated(true);
      let endPoint = `${APIUrlConstants.REGISTRATION}?isAdmin=true`;
      if (userId) {
        endPoint = `${APIUrlConstants.APPROVE_USER_WITH_MAIL}`;
        user = {
          userId,
          roleId: userRole,
          orgName: selectedValue.companyName,
          orgNo: selectedValue.customerNo,
        };
        buttonTracker(gaEvents.APPROVE_USER);
      } else {
        buttonTracker(gaEvents.CREATE_USER);
      }
      const { 0: statusCode, 1: responseData } = await fetchCall(endPoint, apiMethods.POST, user);

      if (statusCode === httpStatusCode.SUCCESS) {
        setShowAlert(true);
        setAlertMessage(responseData.message);
        setAlertVarient('success');
        successCallback();
        localStorage.removeItem('userId');
        setIsLoading(false);
        closeCreateUserModal();
        setTimeout(() => {
          closeAlert();
          clearState();
        }, 5000);
      } else {
        setShowAlert(true);
        setAlertMessage(responseData.message);
        setAlertVarient('danger');
        localStorage.removeItem('userId');
        setIsLoading(false);
        closeCreateUserModal();
        setTimeout(() => {
          closeAlert();
          clearState();
        }, 5000);
      }
    } else if (userRole.length === 0 || userRole === 'Select Role') {
      setRoleValidated(true);
      localStorage.removeItem('userId');
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
    setValidated(true);
  };
  return (
    <div className="wrapperBase">
      {showAlert && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setShowAlert(true);
          }}
          alertshow={alertMessage}
        />
      )}
      <Button className="buttonPrimary" onClick={openCreateUserModal} data-testid="userModal">
        <img src={process.env.REACT_APP_PUBLIC_URL + 'images/users/plus.svg'} alt="" /> Create User
      </Button>
      {isLoading && <Loading />}
      <Modal className="userModal" centered show={showCreateUserModal} onHide={closeCreateUserModal}>
        <Modal.Header closeButton>
          <Modal.Title>{location.pathname === '/users' ? 'Create User' : 'Approve User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={createNewUser} data-testid="CNform">
            <Form.Group className="mb-3 input-group">
              <div className="input-container col-6">
                <Form.Label>
                  First Name <span className="requiredTxt">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="First Name"
                  data-testid="FName"
                  autoFocus
                  value={userFirstName}
                  required
                  name="firstName"
                  onChange={changeUserFirstName}
                />
                <Form.Control.Feedback type="invalid">First Name is required</Form.Control.Feedback>
              </div>
              <div className="input-container col-6">
                <Form.Label>
                  Last Name <span className="requiredTxt">*</span>
                </Form.Label>
                <Form.Control
                  data-testid="LName"
                  type="text"
                  placeholder="Last Name"
                  autoFocus
                  value={userLastName}
                  required
                  onChange={changeUserLastName}
                />
                <Form.Control.Feedback type="invalid">Last Name is required</Form.Control.Feedback>
              </div>
            </Form.Group>
            {location.pathname !== '/users' && (
              <Form.Group className="mb-3 input-group input-container  bit-1">
                <Form.Label>
                  User&apos;s Organization <span className="requiredTxt">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  data-testid="userOrg"
                  placeholder="Organization"
                  autoFocus
                  value={userOrg}
                  required
                  onChange={changeUserOrg}
                />
                <Form.Control.Feedback type="invalid">Organization Name is required</Form.Control.Feedback>
              </Form.Group>
            )}
            <Form.Group className="mb-3 input-group input-container bit-1 zIndex-99">
              <Form.Label>
                Organization <span className="requiredTxt">*</span>
              </Form.Label>
              <AsyncSelect
                value={selectedValue}
                getOptionLabel={(e) => e.companyName}
                getOptionValue={(e) => e.customerNo}
                loadOptions={loadOptions}
                onChange={handleChange}
                placeholder="Search for Organization Name"
                styles={customStyles}
                components={{
                  IndicatorSeparator: () => null,
                }}
              />
              {orgNameAlert && (
                <Alert key="danger" className="dangerAlert errorColor">
                  Organization Name is required
                </Alert>
              )}
            </Form.Group>
            <Form.Group className="mb-3 input-group input-container  bit-1">
              <Form.Label>
                Organization Email <span className="requiredTxt">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                placeholder="Organization Email"
                autoFocus
                value={userOrgEmail}
                required
                onChange={changeUserOrgEmail}
                isInvalid={showOrgEmail}
              />
              <Form.Control.Feedback type="invalid">Organization Email is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3 input-group input-container bit-1">
              <Form.Label>
                Role <span className="requiredTxt">*</span>
              </Form.Label>
              <Form.Select value={userRole} onChange={changeUserRole} required isInvalid={roleValidated} data-testid="userRole">
                <option value="">Select Role</option>
                {roles?.length > 0 &&
                  roles?.map((roleData) => (
                    <option value={roleData.roleId} key={roleData.roleId}>
                      {roleData?.name}
                    </option>
                  ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">Role is required</Form.Control.Feedback>
            </Form.Group>
            <Button className="saveBtn" type="submit">
              {location.pathname === '/users' ? 'Create' : 'Approve'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </div>
  );
}

export default UserModal;
