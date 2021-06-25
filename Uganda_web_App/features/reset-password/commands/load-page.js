async function loadPage(req, res) {
  res.render('pages/reset-password',{data:1,sidebar:global.homepage});
}

module.exports = loadPage;
