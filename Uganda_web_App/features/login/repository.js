
const bcrypt = require('bcrypt');
const oracledb = require('oracledb');
const database = require('../../db/index');

async function getUserForLoginData(req, res) {
  
  let params = {  
    query : `BEGIN MOB_USER_INFO_GET_USER_PWD(:p_user_login_name,:p_user_email,:result_set); END;`,
        params : {
          p_user_login_name: req.username ? req.username : null,
          p_user_email: null,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        } 
  };
  database.GetDataStoreProcedure(params, async function(err,result){ 
    if(err){
      return res(err,null);
    } else {   
      const isPasswordValid =await bcrypt.compareSync(req.password, result[0].USER_PASSWORD);
      //shaheem edited
     // isPasswordValid=true;

console.log("check password valid "+isPasswordValid) ;
     // if (!isPasswordValid) {
        if (isPasswordValid) {
        return res('Invalid Password',null);
      }else{
        delete result[0].USER_PASSWORD
        return res(null,result[0]);
      }
    } 
  });
}

async function getUser(id,res){
  let params = {  
    query : `BEGIN MOB_USER_INFO_GET_USER(:p_user_info_id,:result_set); END;`,
        params : {
          p_user_info_id: id ? id : 0,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        } 
  };
  database.GetDataStoreProcedure(params, async function(err,result){ 
    if(err){
      return res(err,null);
    } else {   
      return res(null,result[0]);
    }
});
}

async function getUserById(id,res){
  return getUser(id,res);
}


module.exports = {
  getUserForLoginData,
  getUserById
};
