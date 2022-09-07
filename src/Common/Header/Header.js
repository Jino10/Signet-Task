import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { Alert, Dropdown, Nav, Navbar, NavDropdown, Badge, Offcanvas, Button } from 'react-bootstrap';
import Stomp from 'stompjs';
import SockJS from 'sockjs-client';
import { randomColor, userRoleId } from '../../Utilities/AppUtilities';
import { useThemeUpdate } from '../../Context/MenuContext';
import { fetchCall } from '../../Services/APIService';
import APIUrlConstants from '../../Config/APIUrlConstants';
import { apiMethods, gaEvents } from '../../Constants/TextConstants';
import { ENV } from '../../Config/Environment';
import Loading from '../../Pages/Widgets/Loading';
import Alerts from '../../Pages/Widgets/Alerts';
import { useOktaAuth } from '@okta/okta-react';
import { useSelector } from 'react-redux';
import ReactGA from 'react-ga4';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';

export default function Header() {
  const { oktaAuth } = useOktaAuth();
  const organizationName = localStorage.getItem('orgName');
  const toggleMenu = useThemeUpdate();
  const [unseenNotification, setUnseenNotification] = useState([]);
  const [seenNotification, setSeenNotification] = useState([]);
  const [liveNotification, setLiveNotification] = useState([]);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [badgeNumber, setBadgeNumber] = useState('');
  const handleClose = () => setShow(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertVarient, setAlertVarient] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const state = useSelector((stateR) => stateR.UserReducer);
  const { buttonTracker, linkTracker } = useAnalyticsEventTracker();

  const handleNotification = () => {
    setShow(false);
    buttonTracker(gaEvents.NAVIGATE_NOTIFICATIONS);
    navigate('/notification');
  };

  const fetchNotifications = async () => {
    const [statusCode, response] = await fetchCall(APIUrlConstants.LIST_NOTIFICATIONS, apiMethods.POST, {
      userId: localStorage.getItem('id'),
      orgName: organizationName,
    });
    if (statusCode === 200) {
      const ids = [];
      setSeenNotification(response.data.seenList);
      setUnseenNotification(response.data.unSeenList);
      setLiveNotification([]);
      response.data.unSeenList.length > 0 && response.data.unSeenList.map((item) => ids.push(item.id));
      ids.length > 0 &&
        (await fetchCall(APIUrlConstants.REMOVE_NOTIFICATIONS, apiMethods.POST, {
          userId: localStorage.getItem('id'),
          notificationIds: ids,
        }));
    }
  };
  const handleShow = () => {
    setShow(true);
    fetchNotifications();
    setBadgeNumber('');
    setLiveNotification([]);
    ReactGA.send({ hitType: 'pageview', page: '/modal/notifications' });
    buttonTracker(gaEvents.OPEN_NOTIFICATION_SLIDER);
  };

  const removeSeenLiveNotification = async () => {
    await fetchCall(APIUrlConstants.REMOVE_NOTIFICATIONS, apiMethods.POST, {
      userId: localStorage.getItem('id'),
      notificationIds: [liveNotification[0].id],
    });
    const notifications = [...liveNotification];
    notifications.shift();
    setLiveNotification(notifications);
    const notificationCount = badgeNumber > 1 ? badgeNumber - 1 : '';
    setBadgeNumber(notificationCount);
  };

  const stompClient = useRef(null);

  const changeLiveNotification = (resp) => {
    setBadgeNumber((prev) => Number(prev) + 1);
    setLiveNotification((prev) => [JSON.parse(resp.body), ...prev]);
  };

  const listNotifications = async () => {
    const notify = [];
    const [statusCode, response] = await fetchCall(APIUrlConstants.LIST_NOTIFICATIONS, apiMethods.POST, {
      userId: localStorage.getItem('id'),
      orgName: organizationName,
    });
    if (statusCode === 200) {
      response.data.unSeenList.length > 0 && response.data.unSeenList.map((item) => notify.push(item));
      notify.length > 0 && setBadgeNumber(notify.length);
      setLiveNotification(notify);
    }
    const socket = new SockJS(`${ENV}/notifications`);
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      stompClient.current.subscribe('/user/notification/message', (resp) => {
        changeLiveNotification(resp);
      });
      stompClient.current.send('/swns/start', { userId: localStorage.getItem('id') });
    });
    return () => {
      stompClient.current.send('/swns/stop', { userId: localStorage.getItem('id') });
    };
  };

  const alertCommand = (message, varient) => {
    setAlertMessage(message);
    setAlertVarient(varient);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  const Logout = async () => {
    setIsLoading(true);
    buttonTracker(gaEvents.USER_LOGOUT);
    const urlencoded = new URLSearchParams();
    urlencoded.append('userId', localStorage.getItem('id'));
    urlencoded.append('isSocial', localStorage.getItem('isSocial'));
    const [statusCode, response] = await fetchCall(APIUrlConstants.LOGOUT_API, apiMethods.POST, urlencoded);
    if (statusCode === 200) {
      oktaAuth.tokenManager.clear();
      localStorage.clear();
      window.fcWidget.destroy();
      window.location.href = '/';
      setIsLoading(false);
    } else {
      alertCommand(response.errorMessage || 'Log out failed, Try again', 'danger');
      setIsLoading(false);
    }
  };

  const firstName = state.user?.firstName || localStorage.getItem('firstName') || '';
  const lastName = state.user?.lastName || localStorage.getItem('lastName') || '';
  const name = `${firstName}  ${lastName}`;
  const roleId = localStorage.getItem('roleId');

  const avatar = `${firstName.trim().charAt(0)} ${lastName.trim().charAt(0)}`;

  useEffect(() => {
    if (roleId !== userRoleId.signetAdmin) {
      listNotifications();
    }
  }, []);

  return (
    <div className="headerWrap d-flex align-items-center justify-content-between">
      {isLoading && <Loading />}
      {showAlert && (
        <Alerts
          variant={alertVarient}
          onClose={() => {
            setShowAlert(false);
          }}
          alertshow={alertMessage}
        />
      )}
      <div className="d-flex align-items-center justify-content-between logoMenu headerBar">
        <img className="logoImg" src={process.env.REACT_APP_PUBLIC_URL + 'images/header/logo.png'} alt="" />
        <img
          className="menuIcn"
          src={process.env.REACT_APP_PUBLIC_URL + 'images/header/menu.svg'}
          aria-hidden="true"
          alt=""
          onClick={toggleMenu}
        />
      </div>
      <Navbar className="justify-content-end flex-grow-1">
        {liveNotification.length > 0 && (
          <div className="openAlertWrapper">
            <Alert variant="primary" className="notification" onClose={() => removeSeenLiveNotification()} dismissible>
              <div className="customAlertBox">
                <div className="customAlertIcn">
                  <img src={process.env.REACT_APP_PUBLIC_URL + 'images/info.svg'} alt="Info" />
                </div>
                <div className="customAlertInfo">
                  <div dangerouslySetInnerHTML={{ __html: liveNotification[0].notificationMessage }} />
                </div>
              </div>
            </Alert>
          </div>
        )}
        {roleId === userRoleId.signetAdmin && (
          <Nav.Item className="me-4">
            <a
              href="https://signetelectronics-support.freshchat.com/"
              rel="noreferrer"
              target="_blank"
              onClick={() => linkTracker(gaEvents.NAVIGATE_FRESHCHAT)}
            >
              <img src={process.env.REACT_APP_PUBLIC_URL + 'images/freshchat.png'} alt="chat" className="chatIcn" />
            </a>
          </Nav.Item>
        )}
        {roleId !== userRoleId.signetAdmin && (
          <Dropdown onClick={handleShow} autoClose="outside">
            <Dropdown.Toggle variant="default" id="dropdown-basic" className="dropBtn bellIcn w-100">
              <img src={process.env.REACT_APP_PUBLIC_URL + 'images/header/bell.svg'} alt="" />
              <Badge bg="secondary">{badgeNumber}</Badge>
            </Dropdown.Toggle>
          </Dropdown>
        )}

        <Nav.Item className="mobileName mRight10">{name}</Nav.Item>
        <NavDropdown
          align="end"
          title={
            <span
              className="avatar text-capitalize d-flex align-items-center justify-content-center"
              style={{ backgroundColor: randomColor }}
            >
              {avatar}
            </span>
          }
          className="profileMenu"
        >
          <NavDropdown.Item className="mobileNameInfo">{name}</NavDropdown.Item>
          <NavDropdown.Item
            onClick={() => {
              buttonTracker(gaEvents.NAVIGATE_PROFILE);
              navigate('/profile');
            }}
            className="actionMenu"
          >
            <span>Profile</span> <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/user.svg'} alt="" />
          </NavDropdown.Item>
          <NavDropdown.Item onClick={Logout} className="actionMenu">
            <span>Logout</span> <img src={process.env.REACT_APP_PUBLIC_URL + 'images/login/logout.svg'} alt="" />
          </NavDropdown.Item>
        </NavDropdown>
      </Navbar>
      <Offcanvas placement="end" show={show} onHide={handleClose} className="customCanvasBox">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Notifications</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="notificationBox">
            <div className="notificationItemBox">
              {unseenNotification.slice(0, 10).map((item) => (
                <div key={item.id} className="notificationItem unseenNotification">
                  <span className="itemDot" />
                  <b>
                    <div dangerouslySetInnerHTML={{ __html: item.notificationMessage }} />
                  </b>
                </div>
              ))}

              {seenNotification.slice(0, 10).map((item) => (
                <div key={item.id} className="notificationItem">
                  <span className="itemDot" />
                  <div dangerouslySetInnerHTML={{ __html: item.notificationMessage }} />
                </div>
              ))}
            </div>
            <Button className="viewAllBtn" onClick={handleNotification} area-hidden="true">
              view All
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
