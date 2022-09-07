import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Security } from '@okta/okta-react';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import ApprovalConfirm from './Pages/ApprovalConfirm/ApprovalConfirm';
import PrivateRoute from './Pages/Authentication/PrivateRoute';
import { userRoleId, roleId } from './Utilities/AppUtilities';
import Layout from './Layout';
import { components } from './Constants/TextConstants';
import ReactGA from 'react-ga4';

const oktaAuth = new OktaAuth({
  issuer: process.env.REACT_APP_OKTA_AUTH_URL,
  clientId: process.env.REACT_APP_OKTA_AUTH_CLIENT_ID,
  redirectUri: `${window.location.origin}/login/callback`,
});

const restoreOriginalUri = async (_oktaAuth, originalUri) => {
  window.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
};

function App() {
  const token = localStorage.getItem('token');
  ReactGA.initialize([
    {
      trackingId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
    },
  ]);
  if (window.location.pathname === '/chatdemo') {
    localStorage.setItem('redirectTo', '/chatdemo');
  }

  let redirectTo;
  switch (token && roleId) {
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

  return (
    <Router>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route exact path="/users" element={<Layout component={components.DASHBOARD} />} />
            <Route exact path="/dashboard" element={<Layout component={components.HEALTH_CHARTS} />} />
            <Route exact path="/tickets" element={<Layout component={components.TICKETS} />} />
            <Route exact path="/ticket/add" element={<Layout component={components.ADD_TICKET} />} />
            <Route exact path="/ticket/edit/:id" element={<Layout component={components.EDIT_TICKET} />} />
            <Route exact path="/ticket/view/:id" element={<Layout component={components.VIEW_TICKET} />} />
            <Route exact path="/chatdemo" element={<Layout component={components.CHATS} />} />
            <Route exact path="/edituser/:id" element={<Layout component={components.EDIT_USER} />} />
            <Route exact path="/announcement" element={<Layout component={components.ANNOUNCEMENT} />} />
            <Route exact path="/notification" element={<Layout component={components.NOTIFICATION} />} />
            <Route exact path="/profile" element={<Layout component={components.PROFILE} />} />
          </Route>
          <Route path="*" element={<Navigate replace to={redirectTo} />} />
          <Route exact path="/" element={token ? <Navigate to={redirectTo} /> : <Layout component={components.LOGIN} />} />

          <Route exact path="/signup" element={token ? <Navigate to="/users" /> : <Layout component={components.SIGNUP} />} />
          <Route
            exact
            path="/forgotpassword"
            element={token ? <Navigate to="/users" /> : <Layout component={components.FORGET} />}
          />
          <Route
            exact
            path="/getuserdetails"
            element={token ? <Navigate to="/users" /> : <Layout component={components.GET_SSO_USER_DETAILS} />}
          />

          <Route
            exact
            path="/resetpassword"
            element={token ? <Navigate to="/users" /> : <Layout component={components.RESET} />}
          />

          <Route exact path="/email/approvalconfirm/:userId" element={<ApprovalConfirm />} />
          <Route exact path="/success" element={<Layout component={components.SUCCESS} />} />
          <Route exact path="/approverequest" element={<Layout component={components.SUCCESS} />} />
          <Route exact path="/email/verifyemail/:userId" element={<Layout component={components.SUCCESS} />} />
          <Route exact path="/user/resetpassword" element={<Layout component={components.RESET} />} />
          <Route exact path="/otpverify" element={<Layout component={components.OTP_VERIFY} />} />
          <Route exact path="/twofactor" element={<Layout component={components.TWO_FACTOR} />} />
        </Routes>
      </Security>
    </Router>
  );
}
export function AddLibrary(urlOfTheLibrary) {
  const script = document.createElement('script');
  script.src = urlOfTheLibrary;
  script.async = true;
  document.body.appendChild(script);
}
export default App;
