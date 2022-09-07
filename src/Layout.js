import React, { useEffect } from 'react';
import LayoutWithHeader from './Common/LayoutWithHeader';
import Login from './Pages/Authentication/Login';
import ForgetPassword from './Pages/Authentication/ForgetPassword';
import OTPVerification from './Pages/Authentication/OTPVerification';
import ResetPassword from './Pages/Authentication/ResetPassword';
import SignUp from './Pages/Authentication/SignUp';
import Dashboard from './Pages/Dashboard/Dashboard';
import Success from './Pages/Success/Success';
import Home from './Pages/Home/Home';
import NetworkHealth from './Pages/NetworkHealth/NetworkHealth';
import Tickets from './Pages/Tickets/Tickets';
import AddTicket from './Pages/Tickets/AddTicket';
import ViewTicket from './Pages/Tickets/ViewTicket';
import Chats from './Pages/Chats/Chats';
import Announcement from './Pages/Announcement/Announcement';
import EditUser from './Pages/EditUser/EditUser';
import GetSSOUserdetails from './Pages/Authentication/GetSSOUserdetails';
import TwoFactorSignIn from './Pages/Authentication/TwoFactorSignIn';
import Notification from './Pages/Notification/Notification';
import HealthCharts from './Pages/HealthCharts/HealthCharts';
import Profile from './Pages/Profile/Profile';
import { components } from './Constants/TextConstants';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

function Layout(props) {
  const { component } = props;
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);

  switch (component) {
    case components.LOGIN:
      return <Login />;
    case components.SIGNUP:
      return <SignUp />;
    case components.SUCCESS:
      return <Success />;
    case components.HOME:
      return <Home />;
    case components.FORGET:
      return <ForgetPassword />;
    case components.GET_SSO_USER_DETAILS:
      return <GetSSOUserdetails />;
    case components.OTP_VERIFY:
      return <OTPVerification />;
    case components.RESET:
      return <ResetPassword />;
    case components.DASHBOARD:
      return LayoutWithHeader(<Dashboard />);
    case components.ANNOUNCEMENT:
      return LayoutWithHeader(<Announcement />);
    case components.NETWORK_HEALTH:
      return LayoutWithHeader(<NetworkHealth />);
    case components.HEALTH_CHARTS:
      return LayoutWithHeader(<HealthCharts />);
    case components.TICKETS:
      return LayoutWithHeader(<Tickets />);
    case components.ADD_TICKET:
      return LayoutWithHeader(<AddTicket />);
    case components.EDIT_TICKET:
      return LayoutWithHeader(<AddTicket />);
    case components.VIEW_TICKET:
      return LayoutWithHeader(<ViewTicket />);
    case components.CHATS:
      return LayoutWithHeader(<Chats />);
    case components.EDIT_USER:
      return LayoutWithHeader(<EditUser />);
    case components.TWO_FACTOR:
      return <TwoFactorSignIn />;
    case components.NOTIFICATION:
      return LayoutWithHeader(<Notification />);
    case components.PROFILE:
      return LayoutWithHeader(<Profile />);

    default:
      return <div>Component not found</div>;
  }
}

export default Layout;
