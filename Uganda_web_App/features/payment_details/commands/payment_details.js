const registerRepo = require('../repository');

async function list(req, res) {

    registerRepo.list_payment(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.render('pages/payment_details',{data:result,sidebar:global.homepage});
        }
    });
  }

  async function payment_file_list(req, res) {

    registerRepo.payment_file(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

  async function payment_unitwise(req, res) {

    registerRepo.payment_unit(req,function(err,result){
        if (err) {
            console.log("Error:", err);
        }else{
            res.status('200').json(result);
        }
    });
  }

module.exports ={
    list,
    payment_file_list,
    payment_unitwise
};
