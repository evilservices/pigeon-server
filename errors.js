var errors = {
  'USERNAME_MISSING': 'Username is required',
  'USERNAME_LENGTH': 'Username must be at least 4 characters and not more than 20',
  'USERNAME_INVALID': 'Username may only contain letters, numbers and underscores',
  'USERNAME_TAKEN': 'Username already exists',
  'USERNAME_NOTEXISTS': 'Username does not exists',
  'USERID_MISSING': 'User ID is required',
  'USERID_NOTEXISTS': 'User does not exists',
  'AVATAR_MISSING': 'Avatar is required',
  'MESSAGE_MISSING': 'Message is required',
  'KEY_MISSING': 'Public key is required',
  'KEY_INVALID': 'Public key is invalid',
  'KEY_NOTPUBLIC': 'Public key is not public key',
  'KEY_TOOLARGE': 'Public key must be at maximal 4096 bits',
  'KEY_TOOSMALL': 'Public key must be at least 1024 bits',
  'LOCALID_MISSING': 'Local ID is required',
  'SIGNATURE_MISSING': 'Signature is required',
  'SIGNATURE_INVALID': 'Signature is invalid',
  'REQUEST_NOTEXISTS': 'Request does not exists',
  'LOGINTOKEN_MISSING': 'Logintoken is required',
  'UNAUTHORIZED': 'Login is required for this action',
  'ERROR_REGISTER': 'Registration failed, please try it later',
  'ERROR_REQUEST': 'Request failed, please try it later',
  'ERROR_MESSAGE': 'Message failed, please try it later'
};

module.exports = errors;
