const registerRepo = require('../repository');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var moment = require('moment');

async function Getuser(req, res) {
   const errormsg_pass = 'Password and confrim password not match';
  const  errormsg =  'Something went wrong.';
  if(req.body.password == req.body.con_password){
    bcrypt.hash(req.body.password,saltRounds).then(function(hash_pass){
        hash_password = hash_pass;
        return hash_password;
      }).then(function(hash_password){
        delete req.body.password;
        req.body.user_id       = req.session.forgot_user_list.USER_INFO_ID;
        req.body.user_name     = req.session.forgot_user_list.USER_LOGIN_NAME;
        req.body.email         = req.session.forgot_user_list.USER_EMAIL;
        req.body.password      = hash_password;
        req.body.modified_on   = moment().format("DD-MMM-YYYY,h:mm:ss a");
        req.body.created_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
      registerRepo.UserinfoUpdateDAL(req.body,function(err,result){
        if (err) {
            req.session.messages = { databaseError: errormsg };
            res.redirect('/reset-password');
          }else{
            res.redirect('/login');
          }
      });
    });
  }else{
    req.session.messages =  {
        errors: { con_password: errormsg_pass },
      };
      res.render('pages/reset-password',{data:3,sidebar:global.homepage});
  }
}

module.exports = Getuser;
