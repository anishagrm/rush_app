const isEmpty = (string) => {
  return string.trim() === "";
};

const isBrotherEmail = (email, gtid) => {
  // TODO: Add all brother emails in for security
  return true;
};

exports.validateSignup = (newUser) => {
  let errors = {};
  // Check if its a valid brother, if not return an error

  if (!isBrotherEmail(newUser.email, newUser.gtid))
    errors.brother = "Not a detected brother";

  if (isEmpty(newUser.password) || newUser.password !== newUser.confirmPassword)
    errors.password = "Passwords dont match or are empty";

  if (isEmpty(newUser.name)) errors.name = "Name cannot be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLogin = (user) => {
  let errors = {};
  if (isEmpty(user.email)) errors.email = "Must not be empty";
  if (isEmpty(user.password)) errors.password = "Must not be empty";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};
