
const oracledb = require('oracledb');
const database = require('../../db/index');


async function list_payment(req, res) {
  let params = {  
    query : `BEGIN WEB_PAYMENT_DETAILS_USER_LIST(:p_user_id,:result_set); END;`,
    params : {
        p_user_id:   req.user.USER_INFO_ID ? req.user.USER_INFO_ID : 0, 
        result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
    } 
};
database.GetDataStoreProcedure(params,function(err,result){ 
  if(err){
    return res(err,null);
  } else {
    return res(null,result);
  } 
});
}

async function payment_file(req, res) {
  let params = {  
    query : `BEGIN MOB_GET_PAYMENT_DETAILS_FILE(:p_user_info_id,:p_location_code,:result_set); END;`,
    params : {
        p_user_info_id : req.body.user_id ? req.body.user_id : 0,
        p_location_code : req.body.unit_id ? req.body.unit_id : null,
        result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
    } 
};
database.GetDataStoreProcedure(params,function(err,result){ 
  if(err){
    return res(err,null);
  } else {
    return res(null,result);
  } 
});
}

async function payment_unit(req, res) {
  let params = {  
    query : `BEGIN WEB_PAYMENT_UNIT_LISTING(:p_user_id,:result_set); END;`,
    params : {
        p_user_id : req.body.user_id ? req.body.user_id : 0,
        result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
    } 
};
database.GetDataStoreProcedure(params,function(err,result){ 
  if(err){
    return res(err,null);
  } else {
    return res(null,result);
  } 
});
}


module.exports = {
  list_payment,
  payment_file,
  payment_unit
};
