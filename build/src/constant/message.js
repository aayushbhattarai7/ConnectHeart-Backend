'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.createdMEssage =
  exports.updatedMessage =
  exports.deletedMessage =
  exports.getNotFoundMessage =
  exports.Message =
    void 0
exports.Message = {
  registerSuccessfully: 'Registered Successfully',
  passwordShouldStrong: 'Password must contain one uppercase, one digit and minimum of 8 characters',
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
}
const getNotFoundMessage = (title) => {
  return `${title} not found`
}
exports.getNotFoundMessage = getNotFoundMessage
const deletedMessage = (title) => {
  return `${title} deleted Successfully`
}
exports.deletedMessage = deletedMessage
const updatedMessage = (title) => {
  return `${title} updated successfully`
}
exports.updatedMessage = updatedMessage
const createdMEssage = (title) => {
  return `${title} created Successfully`
}
exports.createdMEssage = createdMEssage
