// Development Base API URL
export const ENV = process.env.REACT_APP_API_BASE_URL;
// export const ENV = 'http://127.0.0.1:8084';

export const NON_REMOTE_SMARTUSER = process.env.REACT_APP_NON_REMOTE_SMARTUSER;
export const REMOTE_SMARTUSER = process.env.REACT_APP_REMOTE_SMARTUSER;
export const SIGNET_ADMIN = process.env.REACT_APP_SIGNET_ADMIN;

export const GOOGLE_LOGIN_URL = `${process.env.REACT_APP_OKTA_URL}${process.env.REACT_APP_GOOGLE_IDP}&client_id=${process.env.REACT_APP_OKTA_URL_CLIENT_ID}&response_type=token&response_mode=fragment&scope=openid%20profile&redirect_uri=${process.env.REACT_APP_SOCIAL_LOGIN_REDIRECT_URL}&state=WM6D&amp&nonce=YsG76jo`;
export const MICROSOFT_LOGIN_URL = `${process.env.REACT_APP_OKTA_URL}${process.env.REACT_APP_MICROSOFT_IDP}&client_id=${process.env.REACT_APP_OKTA_URL_CLIENT_ID}&response_type=token&response_mode=fragment&scope=openid%20profile&redirect_uri=${process.env.REACT_APP_SOCIAL_LOGIN_REDIRECT_URL}&state=WM6D&amp&nonce=YsG76jo`;

export const BRANCHIO = process.env.REACT_APP_BRANCH_IO;
