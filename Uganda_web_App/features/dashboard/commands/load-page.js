async function loadPage(req, res) {
  res.render('pages/dashboard',{sidebar:global.homepage});
}

module.exports = loadPage;
