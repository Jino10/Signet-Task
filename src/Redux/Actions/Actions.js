export const startlogin = () => ({
  type: 'START_LOGIN',
});

export const successlogin = (user) => ({
  type: 'SUCCESS_LOGIN',
  payload: user,
});

export const updateUser = (user) => ({
  type: 'UPDATE_USER',
  payload: user,
});

export const failedlogin = (error) => ({
  type: 'FAILED_LOGIN',
  payload: error,
});
