async function Otpcheck(req, res) {
    var errormsg = 'Please Enter The valid One time password';
    if(req.session.One_time_pass == req.body.otp){
      req.session.messages =  {
        errors: {password:'',con_password:'' },
      };
      res.render('pages/reset-password',{data:3,sidebar:global.homepage});
      req.session.One_time_pass = 0;

    }else{
      req.session.messages =  {
        errors: { otp: errormsg,password:'',con_password:'' },
      };
      res.render('pages/reset-password',{data:2,sidebar:global.homepage});
    }
  }

  module.exports = Otpcheck;
