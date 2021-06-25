const { wrap } = require('async-middleware');

const { logout } = require('./commands/logout');

module.exports = (router, middlewares = []) => {
  router.get('/logout', wrap(logout));

  return router;
};
