const { wrap } = require('async-middleware');

const loadPage = require('./commands/load-page');
const Getuser = require('./commands/Getuserdata');
const Otpcheck = require('./commands/Otpcheck');
const Update = require('./commands/Update_password');

module.exports = router => {
  router.get('/reset-password', wrap(loadPage));
  router.post('/reset-password', wrap(Getuser));
  router.post('/reset-password/otp', wrap(Otpcheck));
  router.post('/reset-password/update', wrap(Update));
  return router;
};
