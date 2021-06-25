const registerRepo = require('../repository');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var moment = require('moment');

async function createUser(req, res) {

  const registerSuccessMessage = 'You have successfully registered, you can now log in.';
  const  errormsg =  'Something went wrong.';
  const errormsgalreadyuser = 'The User Name has already been taken.'
  
  bcrypt.hash(req.body.password,saltRounds).then(function(hash_pass){
    hash_password = hash_pass;
    return hash_password;
  }).then(function(hash_password){
    delete req.body.password;
    req.body.password = hash_password;
    req.body.modified_on   = moment().format("DD-MMM-YYYY,h:mm:ss a");
    req.body.created_on    = moment().format("DD-MMM-YYYY,h:mm:ss a");
  registerRepo.createUser(req.body,function(err,result){
    if (err) {
      req.session.messages = { databaseError: errormsg };
      res.redirect('/register');
    }else{
      if(result == 100){
        req.session.messages = { databaseError: errormsgalreadyuser };
        res.redirect('/register');
      }else{
        req.session.messages = { success: registerSuccessMessage };
        res.redirect('/login');
      }
    }
   }); 
  }); 
  // let user = {};
  // const registerSuccessMessage = 'You have successfully registered, you can now log in.';
  // try {
  //   user = await registerRepo.createUser(req.body);
  // } catch (error) {
  //   user = error;
  // }
  // if (user.email) {
  //   req.session.messages = { success: registerSuccessMessage };
  //   res.redirect('/login');
  // }
  // const { code } = user;
  // const databaseError =
  //   code === '23505' ? 'The email has already been taken.' : 'Something went wrong.';
  // req.session.messages = { databaseError };
  // res.redirect('/register');
}

module.exports = createUser;
