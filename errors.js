var errors = {
  'USERNAME_MISSING': 'Username is required',
  'USERNAME_LENGTH': 'Username must be at least 4 characters and not more than 20',
  'USERNAME_INVALID': 'Username may only contain letters, numbers and underscores',
  'USERNAME_TAKEN': 'Username already exists',
  'AVATAR_MISSING': 'Avatar is required',
  'KEY_MISSING': 'Public key is required',
  'KEY_INVALID': 'Public key is invalid',
  'KEY_NOTPUBLIC': 'Public key is not public key',
  'KEY_TOOLARGE': 'Public key must be at maximal 4096 bits',
  'KEY_TOOSMALL': 'Public key must be at least 1024 bits',
  'ERROR_REGISTER': 'Registration failed, please try it later',
};

module.exports = errors;
