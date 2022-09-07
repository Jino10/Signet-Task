import React, { useEffect, useState } from 'react';
import { Nav, Col } from 'react-bootstrap';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';
import { userRoleId } from '../../Utilities/AppUtilities';
import { useTheme, useThemeUpdate } from '../../Context/MenuContext';
import { messageService } from '../../Services/MessageService';
import useAnalyticsEventTracker from '../../Hooks/useAnalyticsEventTracker';
import { gaEvents } from '../../Constants/TextConstants';

export default function Sidebar() {
  const navigate = useNavigate();
  const sidebarOpen = useTheme();
  const toggleMenu = useThemeUpdate();
  const role = localStorage.getItem('roleId');
  const token = localStorage.getItem('token');
  const [defaultActiveKey, setDefaultActiveKey] = useState('/users');
  const [activeKey, setActiveKey] = useState('dashboard');
  const { linkTracker } = useAnalyticsEventTracker();

  function gotoNavigate(viewURL) {
    navigate(viewURL, { state: { showLoader: viewURL !== '/chatdemo' } });
    toggleMenu();
  }

  useEffect(() => {
    if (role === userRoleId.remoteSmartUser && window.location.pathname === '/chatdemo' && token) {
      setDefaultActiveKey('/chatdemo');
      setActiveKey('chats');
    }
    if (window.location.pathname === '/announcement') {
      setActiveKey('announcement');
    }
    if (window.location.pathname === '/tickets') {
      setActiveKey('tickets');
    }
    messageService.subscription = messageService.getMessage().subscribe((message) => {
      if (message) {
        setActiveKey('tickets');
        gotoNavigate('/tickets');
      }
    });
  }, [role, token]);

  return (
    <Col lg={2} md={3} sm={3} className={'sidebarBox ' + (sidebarOpen ? 'showSidebar' : 'hideSidebar')}>
      <div className="sideWrap flex-column d-flex align-items-center justify-content-between">
        <Nav
          defaultActiveKey={defaultActiveKey}
          className="flex-column"
          activeKey={activeKey}
          onSelect={(eventKey) => {
            setActiveKey(eventKey);
          }}
        >
          {role === userRoleId.signetAdmin && (
            <>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="dashboard"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_USERS_LIST);
                  gotoNavigate('/users');
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/user.svg'} alt="" className="pe-2 defaultImg" />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/user-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Users
              </Nav.Link>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="announcement"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_ANNOUNCEMENTS);
                  gotoNavigate('/announcement');
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/env.svg'} alt="" className="pe-2 defaultImg" />{' '}
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/env-active.svg'} alt="" className="pe-2 activeImg" />
                Announcements
              </Nav.Link>
            </>
          )}
          {role === userRoleId.remoteSmartUser && (
            <>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="tickets"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_TICKETS_LIST);
                  gotoNavigate('/tickets');
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/tickets.svg'} alt="" className="pe-2 defaultImg" />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/tickets-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Tickets
              </Nav.Link>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="health"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_DASHBOARD);
                  gotoNavigate('/dashboard');
                }}
              >
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/network-health.svg'}
                  alt=""
                  className="pe-2 defaultImg"
                />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/network-health-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Dashboard
              </Nav.Link>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="chats"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_CHAT);
                  gotoNavigate('/chatdemo');
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/chats.svg'} alt="" className="pe-2 defaultImg" />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/chats-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Chat
              </Nav.Link>
            </>
          )}
          {role === userRoleId.nonRemoteSmartUser && (
            <>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="tickets"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_TICKETS_LIST);
                  gotoNavigate('/tickets');
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/tickets.svg'} alt="" className="pe-2 defaultImg" />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/tickets-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Tickets
              </Nav.Link>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="health"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_DASHBOARD);
                  gotoNavigate('/dashboard');
                }}
              >
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/network-health.svg'}
                  alt=""
                  className="pe-2 defaultImg"
                />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/network-health-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Dashboard
              </Nav.Link>
              <Nav.Link
                className="pe-0 ps-2"
                eventKey="chats"
                onClick={() => {
                  linkTracker(gaEvents.NAVIGATE_CHAT);
                  gotoNavigate('/chatdemo');
                }}
              >
                <img src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/chats.svg'} alt="" className="pe-2 defaultImg" />
                <img
                  src={process.env.REACT_APP_PUBLIC_URL + 'images/sidebar/chats-active.svg'}
                  alt=""
                  className="pe-2 activeImg"
                />
                Chat
              </Nav.Link>
            </>
          )}
        </Nav>
      </div>
    </Col>
  );
}
