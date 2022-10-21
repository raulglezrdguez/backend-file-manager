const re_email =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports.validateSignUpInput = (
  name,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (typeof name !== 'string') {
    errors.name = 'Invalid name type';
  } else if (name.trim().length < 4) {
    errors.name = 'Name is to short';
  } else if (name.trim().length > 15) {
    errors.name = 'Name is to long';
  }
  if (typeof email !== 'string') {
    errors.email = 'Invalid email type';
  } else if (!email.match(re_email)) {
    errors.email = 'Incorrect email';
  }
  if (typeof password !== 'string') {
    errors.password = 'Invalid password type';
  } else if (typeof confirmPassword !== 'string') {
    errors.confirmPassword = 'Invalid confirmPassword type';
  } else if (password.length < 6) {
    errors.password = 'Password to short';
  } else if (password !== confirmPassword) {
    errors.password = 'Passwords dont match';
    errors.confirmPassword = 'Passwords dont match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateForgetPassInput = (email, password, confirmPassword) => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email is empty';
  } else {
    if (!email.match(re_email)) {
      errors.email = 'Incorrect email';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password is empty';
  } else if (password.length < 6) {
    errors.password = 'Password less than 6 characters';
  } else if (password !== confirmPassword) {
    errors.password = 'Passwords dont match';
    errors.confirmPassword = 'Passwords dont match';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (email, password) => {
  const errors = {};

  if (email.trim() === '') {
    errors.email = 'Email is empty';
  } else {
    if (!email.match(re_email)) {
      errors.email = 'Incorrect email';
    }
  }
  if (password.trim() === '') {
    errors.password = 'Password must not be empty';
  } else if (password.length < 6) {
    errors.password = 'Password less than 6 characters';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
