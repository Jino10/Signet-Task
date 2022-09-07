const emailValidator = (email) => {
  const pattern = /^\w+([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;
  return !pattern.test(email);
};

export default emailValidator;
