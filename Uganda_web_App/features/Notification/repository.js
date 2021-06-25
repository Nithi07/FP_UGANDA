
const oracledb = require('oracledb');
const database = require('../../db/index');
var moment = require('moment');

async function list(req, res) {
  let params = {  
    query : `BEGIN WEB_GET_NOTIFICATION_USER_ID(:p_user_info_id,:result_set); END;`,
        params : {
          p_user_info_id : req.user.USER_INFO_ID ? req.user.USER_INFO_ID : 0,
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

async function updateNotification(req, res) {
  var parameters = {  query : `BEGIN WEB_NOTIFICATION_UPDATE(:p_notify_id,:p_user_info_id,:p_modified_on,:p_modified_by); END;`,
    params : [
      p_notify_id           = req.notify_id ? req.notify_id : 0,
      p_user_info_id        = req.USER_INFO_ID ? req.USER_INFO_ID : 0,
      p_modified_on         = req.modified_on ? req.modified_on : null,
      p_modified_by         = req.modified_by ? req.modified_by : 0
    ],
    options: {
      autoCommit: true,
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.NUMBER },
        { type: oracledb.DATE },
        { type: oracledb.NUMBER }
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
  list,
  updateNotification
};
