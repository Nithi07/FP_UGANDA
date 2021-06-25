const { wrap } = require('async-middleware');

//const verifyRequestBody = require('./commands/verify-request-body');
const loadPage = require('./commands/load-page');
const { getUserData } = require('./repository');

module.exports = router => {
  //router.get('/User_Details',wrap(getUserData),wrap(loadPage));
  //return router;
};
