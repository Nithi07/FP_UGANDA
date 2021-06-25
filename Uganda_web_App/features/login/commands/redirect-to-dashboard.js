const debug = require('debug')('express:login');

const { FETCH_INFO_ERROR_MESSAGE } = require('../constants');
const { getUserById } = require('../repository');

async function redirectToDashboard(req, res) {
  let userInfo;
  const { user } = req;
  getUserById(user.USER_INFO_ID,(err,result)=>{
    if(err){
      const messages = {
        errors: {
          databaseError: FETCH_INFO_ERROR_MESSAGE,
        },
      };
  
      return res.status(500).render('pages/login', { messages });
    }else{
      userInfo = result
      debug('login:redirectToDashboard');
  req.session.userInfo = { ...userInfo };
  res.redirect('/');
    }
  }); 

  
}

module.exports = redirectToDashboard;
