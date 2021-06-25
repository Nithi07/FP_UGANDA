const { wrap } = require('async-middleware');

const loadPage = require('./commands/load-page');

module.exports = router => {
 // router.get('/dashboard', wrap(loadPage));

  return router;
};
