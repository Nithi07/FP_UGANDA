const NAME_MIN = 3;
const NAME_MAX = 60;
const PASSWORD_MIN = 6;
const PASSWORD_MAX = 30;
const Mobile_MIN = 9;
const Mobile_MAX = 9;
// Errors constant name is created from:
// 1: uppercase input name + _ + (eg: NAME)
// 2: error type serverd by joi + _ + (eg: MIN)
// 3: ERROR
// 4: final constant name: NAME_MIN_ERROR

const NAME_MIN_ERROR = `Name length must be at least ${NAME_MIN} characters long`;
const NAME_MAX_ERROR = `Name length must be less than or equal to ${NAME_MAX} characters long`;
const PASSWORD_MAX_ERROR = `Password length must be less than or equal to ${PASSWORD_MAX} characters long`;
const PASSWORD_MIN_ERROR = `Password length must be at least ${PASSWORD_MIN} characters long`;
const USERNAME_EMAIL_ERROR = 'Email must be a valid email address';
const PASSWORD_MATCH = `Password and confrim password doesn't match`;
const Mobile_MIN_ERROR = `Mobile Number length must be at least ${Mobile_MIN} Number long`;
const Mobile_MAX_ERROR = `Mobile Number length must be less than or equal to ${Mobile_MAX} characters long`;

module.exports = {
  NAME_MIN,
  NAME_MAX,
  PASSWORD_MAX,
  PASSWORD_MIN,
  NAME_MIN_ERROR,
  NAME_MAX_ERROR,
  PASSWORD_MAX_ERROR,
  PASSWORD_MIN_ERROR,
  USERNAME_EMAIL_ERROR,
  PASSWORD_MATCH,
  Mobile_MAX,
  Mobile_MIN,
  Mobile_MIN_ERROR,
  Mobile_MAX_ERROR
};
