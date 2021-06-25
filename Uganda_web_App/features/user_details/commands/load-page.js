
async function loadPage(req, res) {
  res.render('pages/User_Details',{sidebar:global.homepage});
}

module.exports = loadPage;
