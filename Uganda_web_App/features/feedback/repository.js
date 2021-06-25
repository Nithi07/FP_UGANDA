
const oracledb = require('oracledb');
const database = require('../../db/index');

async function list(req, res) {
  let params = {
    query: `BEGIN usp_get_feedback_header(:p_user_info_id,:result_set); END;`,
    params: {
      p_user_info_id: req.user.USER_INFO_ID ? req.user.USER_INFO_ID : null,
      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      return res(null, result);
    }
  });
}

async function getFeedbackHistory(req, res) {
  let params = {
    query: `BEGIN usp_get_feedback_history(:p_user_info_id, :p_feedback_id, :result_set); END;`,
    params: {
      p_user_info_id: req.user.USER_INFO_ID ? req.user.USER_INFO_ID : null,
      p_feedback_id: req.body.feedback_id ? req.body.feedback_id : null,
      result_set: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }
    }
  };
  database.GetDataStoreProcedure(params, async function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      return res(null, result);
    }
  });
}



function getInsertFeedbackReply(req, res) {


  var parameters = {
    query: `BEGIN MOB_FEEDBACK_COMMENTS_INSERT(:p_feedback_id,:p_comments,:p_is_active,:p_created_on,
      :p_modified_on,:p_created_by,:p_modified_by,:p_error_code); END;`,
    params: [
      p_feedback_id  = req.feedback_id ? req.feedback_id : 0,
      p_comments     = req.comments ? req.comments : null,
      p_is_active    = 1,
      p_created_on   = req.created_on ? req.created_on : null,
      p_modified_on  = req.created_on ? req.created_on : null,
      p_created_by   = req.created_by ? req.created_by : 0,
      p_modified_by  = req.created_by ? req.created_by : 0,
      p_error_code   = 0
    ],
    options: {
      autoCommit: true,
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING },
        { type: oracledb.NUMBER },
        { type: oracledb.DATE },
        { type: oracledb.DATE },
        { type: oracledb.NUMBER },
        { type: oracledb.NUMBER },
        { type: oracledb.DB_TYPE_NUMBER, dir: oracledb.BIND_OUT }
      ]
    }
  };
  database.insertStoreProcedureExecute(parameters, function (err, result) {
    if (err) {
      return res(err, null);
    } else {
      Notification_save(req, res);

    }
  });

}

function getInsertNewFeedback(req, res) {

  var parameters = {};
  parameters.params = { 
    p_subject      : req.comments ? req.comments : 0,
    p_is_active    : 1,
    p_created_on   : req.created_on ? req.created_on : null,
    p_modified_on  : req.created_on ? req.created_on : null,
    p_created_by   : req.created_by ? req.created_by : 0,
    p_modified_by  : req.created_by ? req.created_by : 0,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN USP_FEEDBACK_INSERT(:p_subject,:p_is_active,:p_created_on,
    :p_modified_on,:p_created_by,:p_modified_by,:p_error_code); END;` ;
  
 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.feedback_id = result.p_error_code;
      Notification_save(req, res);
    }
});
}


async function Notification_save(req, res) {

  var USER_INFO_ID = req.created_by;

  var parameters = {  query : `BEGIN WEB_NOTIFICATION_INSERT(:p_refer_id,:p_building_code,:p_messgae,:p_type,:p_building_name,:p_created_by,
    :p_modified_by,:p_user_info_id); END;`,
    params : [
      p_refer_id            = req.feedback_id ? req.feedback_id :0,
      p_building_code       = null,
      p_messgae             = req.comments ? req.comments : null,
      p_type                = 'FEEDBACK',
      p_building_name       =  null,
      p_created_by          =  req.created_by ? req.created_by : 0,
      p_modified_by         =  req.created_by ? req.created_by : 0,
      p_user_info_id        =  USER_INFO_ID ? USER_INFO_ID :0
    ],
    options: {
      autoCommit: true,
      bindDefs: [
        { type: oracledb.NUMBER },
        { type: oracledb.STRING },
        { type: oracledb.STRING },
        { type: oracledb.STRING },
        { type: oracledb.STRING },
        { type: oracledb.NUMBER },
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
  getFeedbackHistory,
  getInsertFeedbackReply,
  getInsertNewFeedback
};
