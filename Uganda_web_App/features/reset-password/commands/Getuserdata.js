const registerRepo = require('../repository');
const email_config = require('../../../config/email_config');

async function Getuser(req, res) {

  const  errormsg =  'Something went wrong.';

  registerRepo.Getuseremail(req.body,function(err,result){
    if (err) {
      req.session.messages = { databaseError: errormsg };
      res.redirect('/reset-password');
    }else{
      var otp= Math.floor(1000 + Math.random() * 9000);
      req.session.One_time_pass = otp;
      req.session.forgot_user_list = result[0];
      var context  = {
          to : req.body.email,
          subject:'FP UGANDA (ONE TIME PASSWORD)',
          html: `Hello,<br> OTP to verify your email. <br><span>${otp}</span>`};
        email_config.sendingMail(context,function(err,data1){
          if(!err){
            res.render('pages/reset-password',{data:2,sidebar:global.homepage});
            }
          });
    }
  });
}



module.exports = Getuser;
