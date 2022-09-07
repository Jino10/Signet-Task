/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/**
 * API Service Call
 */

import APIUrlConstants from '../Config/APIUrlConstants';

export const makeRequest = async (endpoint) => {
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  return fetch(endpoint, options).then((response) => {
    const statusCode = response.status;
    const resbody = response.json();
    if ([401].includes(statusCode)) {
      localStorage.clear();
      sessionStorage.clear();
      window.location = '/';
    } else {
      return Promise.all([statusCode, resbody]);
    }
  });
};

export const fetchCall = async (endpoint, method, opts) => {
  const token = localStorage.getItem('token');
  const tempToken = localStorage.getItem('temp_token');
  const options =
    !token && !tempToken
      ? {
          method,
          body: endpoint === (APIUrlConstants.LOGIN_API || APIUrlConstants.LOGIN_OTP_API) ? opts : JSON.stringify(opts),
          headers:
            endpoint === APIUrlConstants.LOGIN_API
              ? { 'Content-Type': 'application/x-www-form-urlencoded' }
              : { 'Content-Type': 'application/json' },
        }
      : {
          method,
          body:
            endpoint === APIUrlConstants.UPDATE_RESTORE_ID_API || endpoint === APIUrlConstants.LOGOUT_API
              ? opts
              : opts
              ? JSON.stringify(opts)
              : null,
          headers: {
            'Content-Type':
              endpoint === APIUrlConstants.UPDATE_RESTORE_ID_API || endpoint === APIUrlConstants.LOGOUT_API
                ? 'application/x-www-form-urlencoded'
                : 'application/json',
            Authorization: `Bearer ${!token ? tempToken : token}`,
          },
        };
  return fetch(endpoint, options, method).then((response) => {
    const statusCode = response.status;
    let resbody;
    if (endpoint !== APIUrlConstants.LOGOUT_API) {
      resbody = response.json();
    } else {
      resbody = {};
    }
    if ([401].includes(statusCode) && endpoint !== APIUrlConstants.LOGIN_API) {
      localStorage.clear();
      sessionStorage.clear();
      window.location = '/';
    } else {
      return Promise.all([statusCode, resbody]);
    }
  });
};
