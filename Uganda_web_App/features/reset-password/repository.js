const oracledb = require('oracledb');
const database = require('../../db/index');


async function Getuseremail(req,res) {
  let params = {  
    query : `BEGIN MOB_USER_INFO_GET_USER_PWD(:p_user_login_name,:p_user_email,:result_set); END;`,
        params : {
          p_user_login_name: null,
          p_user_email:  req.email ? req.email : null,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        } 
  };
  database.GetDataStoreProcedure(params, async function(err,result){ 
    if(err){
      return res(err,null);
    } else {   
      return res(null,result);
    } 
  });
}

async function UserinfoUpdateDAL(req,res){
  var parameters = {  query : `BEGIN MOB_USER_INFO_UPDATE(:p_USER_INFO_ID,:p_user_login_name,:p_user_email,:p_user_password,
    :p_modified_on,:p_modified_by,:p_error_code); END;`,
    params : [
      p_USER_INFO_ID        =  req.user_id ? req.user_id : 0,
      p_user_login_name     =  req.user_name ? req.user_name : null,
      p_user_email         =  req.email ? req.email : null,
      p_user_password      =  req.password ? req.password : null,
      p_modified_on        =  req.modified_on ? req.modified_on : null,
      p_modified_by        =  req.modyfied_by ? req.modyfied_by : 0,
      p_error_code        =  0
    ],
    options: {
      autoCommit: true,
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING },
        { type: oracledb.STRING },
        { type: oracledb.STRING },
        { type: oracledb.DATE },
        { type: oracledb.NUMBER },
        { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
      ]
    }
  };
database.insertStoreProcedureExecute(parameters,function(err,result){
  if(err){
    return res(err,null);
  } else {
    return res(null,result);
  } 
});
}


module.exports = {
  Getuseremail,
  UserinfoUpdateDAL
};
