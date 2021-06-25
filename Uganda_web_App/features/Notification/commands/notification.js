const registerRepo = require('../repository');
var moment = require('moment');

async function listdata(req, res) {
   
    registerRepo.list(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    }); 
  }

  async function update(req, res) {
   var data ={};
   data.notify_id       = req.params.id;
   data.USER_INFO_ID    = req.user.USER_INFO_ID
   data.modified_by     = req.user.USER_INFO_ID;
   data.modified_on     = moment().format("DD-MMM-YYYY,h:mm:ss a");

    registerRepo.updateNotification(data,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.redirect('/');
        }
    }); 
  }


module.exports ={
    listdata,
    update
};
