export const Message = {
  registerSuccessfully: 'Registered Successfully',
  passwordShouldStrong:
    'Password must contain one uppercase, one digit and minimum of 8 characters',
  passwordShouldMatch: 'Passwords should match',
  validPhoneNumber: 'Invalid Phone number',
  notFound: 'Not Found',
  invalidCredentials: 'Invalid Credentials',
  loginSuccessfully: 'Successfully logged in',
  invalidOldPassword: 'Invalid Old Password',
  passwordReset: 'Your password is successfully reset',
  updated: 'Successfully updated',
  deleted: 'Successfully deleted',
  created: 'Successfully created',
  error: 'Error occurred',
  notAuthorized: ' You are not Authorized',
  tokenExpire: 'Token expired, Please signin again',
  uploadFailed: 'Sorry file couldnot be uploaded',
  success: 'Success',
  accepted: 'accepted',
};

export const getNotFoundMessage = (title: string) => {
  return `${title} not found`;
};

export const deletedMessage = (title: string) => {
  return `${title} deleted Successfully`;
};

export const updatedMessage = (title: string) => {
  return `${title} updated successfully`;
};

export const createdMessage = (title: string) => {
  return `${title} created Successfully`;
};
