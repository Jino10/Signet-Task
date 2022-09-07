import { ENV } from './Environment';

// Auth  API list
const REGISTRATION = `${ENV}/user/register`;
const LOGIN_API = `${ENV}/login`;
const APPROVAL_REQUEST_API = `${ENV}/email/verifyEmail`;
const UPDATE_PROFILE = `${ENV}/user/updateProfile`;
const LOGOUT_API = `${ENV}/logout`;

// users API list
const GET_SSO_USER_DETAILS = `${ENV}/user/isOrgEmail`;
const CREATE_USER_WITH_ORG = `${ENV}/user/createUserWithOrg`;
const GET_USER_DETAILS = `${ENV}/user/getUserDetails`;
const FORGET_PASSWORD_API = `${ENV}/user/forgotPassword?email=`;
const RESET_PASSWORD_API = `${ENV}/user/changePassword`;
const APPROVE_USER_WITH_MAIL = `${ENV}/user/approveUserWithRole`;
const SOCIAL_ORG_API = `${ENV}/user/isOrgEmail`;
const GET_USER_ROLES = `${ENV}/user/roles`;
const SEARCH_ORG = `${ENV}/ticket/customerList`;
const RESEND_OTP_EMAIL = `${ENV}/user/resendOtp`;
// dashboard API list
const FETCH_USER_DETAILS = `${ENV}/dashboard/getUserDetails`;
const SEARCH_USER_DETAILS = `${ENV}/dashboard/getUserDetailByValue`;
const DELETE_USER = `${ENV}/dashboard/deleteUser`;
const UPDATE_USER_DETAILS = `${ENV}/dashboard/updateUserDetails`;
const CONTACT_SALES = `${ENV}/dashboard/contactSales`;
const GET_CHARTS_BY_TICKETS = `${ENV}/dashboard/q360Ticket`;
const GET_CHARTS_BY_SYSTEM = `${ENV}/dashboard/system`;
// notifications  API list
const POST_NOTIFICATION_API = `${ENV}/notification/addOrgLevelAlert`;
const GET_ORG_NAME = `${ENV}/dashboard/findByOrgName`;
const LIST_NOTIFICATIONS = `${ENV}/notification/listMenuNotifications`;
const REMOVE_NOTIFICATIONS = `${ENV}/notification/setNotificationAsSeen`;
const GET_FC_RESTORE_ID_API = `${ENV}/user/getRestoreId`;
const UPDATE_RESTORE_ID_API = `${ENV}/user/updateFreshchatRestoreId`;
const LOGIN_OTP_API = `${ENV}/user/verifyUser`;
const VIEW_ALL_NOTIFICATIONS = `${ENV}/notification/listNotifications`;
const TICKETS_LIST = `${ENV}/ticket/ticketList`;
const LIST_SITES = `${ENV}/ticket/siteList`;
const LIST_PRIORITY = `${ENV}/ticket/priority`;
const LIST_PROBLEM_CODE = `${ENV}/ticket/problemCode`;
const CREATE_TICKET = `${ENV}/ticket/createTicket`;
const VIEW_TICKET = `${ENV}/ticket/getTicketByTicketNo`;

export default {
  REGISTRATION,
  LOGIN_API,
  LOGOUT_API,
  FORGET_PASSWORD_API,
  RESET_PASSWORD_API,
  APPROVAL_REQUEST_API,
  GET_USER_DETAILS,
  GET_USER_ROLES,
  APPROVE_USER_WITH_MAIL,
  FETCH_USER_DETAILS,
  SEARCH_USER_DETAILS,
  UPDATE_USER_DETAILS,
  DELETE_USER,
  SOCIAL_ORG_API,
  CONTACT_SALES,
  GET_CHARTS_BY_TICKETS,
  GET_CHARTS_BY_SYSTEM,
  POST_NOTIFICATION_API,
  GET_SSO_USER_DETAILS,
  GET_ORG_NAME,
  CREATE_USER_WITH_ORG,
  LIST_NOTIFICATIONS,
  REMOVE_NOTIFICATIONS,
  GET_FC_RESTORE_ID_API,
  UPDATE_RESTORE_ID_API,
  LOGIN_OTP_API,
  UPDATE_PROFILE,
  VIEW_ALL_NOTIFICATIONS,
  SEARCH_ORG,
  TICKETS_LIST,
  LIST_SITES,
  LIST_PRIORITY,
  LIST_PROBLEM_CODE,
  CREATE_TICKET,
  VIEW_TICKET,
  RESEND_OTP_EMAIL,
};
