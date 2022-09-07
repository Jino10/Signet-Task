import { SIGNET_ADMIN, REMOTE_SMARTUSER, NON_REMOTE_SMARTUSER } from '../Config/Environment';

export const userRoleId = {
  nonRemoteSmartUser: NON_REMOTE_SMARTUSER,
  remoteSmartUser: REMOTE_SMARTUSER,
  signetAdmin: SIGNET_ADMIN,
};

export const roleId = localStorage.getItem('roleId');

export const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
export const token = localStorage.getItem('token');

export const randomColorForCharts = (count) => {
  const colors = [];
  for (let i = 0; i < count; i += 1) {
    colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
  }
  return colors;
};
