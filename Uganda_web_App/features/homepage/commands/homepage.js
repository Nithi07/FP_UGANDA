const registerRepo = require('../repository');
var moment = require('moment');

async function userwiseformslist(req, res) {
    registerRepo.GetAllUserwiseFormList(req, function (err, result) {
        if (err) {
            console.log("Error:", err);
        } else {
          global.homepage = result;
          res.render('pages/dashboard', { sidebar: result,moment:moment});

        }
    });
}



module.exports = {
  userwiseformslist,


};
