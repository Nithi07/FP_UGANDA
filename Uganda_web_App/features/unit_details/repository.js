const oracledb = require('oracledb');
const database = require('../../db/index');

async function list(req, res) {
  let params = {  
    query : `BEGIN MOB_GET_UNIT_MASTER_LIST(:p_user_info_id,:result_set); END;`,
    params : {
      p_user_info_id : req.user.USER_INFO_ID ? req.user.USER_INFO_ID :0,
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


async function saveunitfile(req, res) {
  let length = 1;
    for(var i=0;i<req.name.length;i++){
      var parameters = {  query : `BEGIN WEB_UNIT_FILES_INSERT(:P_LOCATION_CODE,:p_FILE_NAME,:p_FILE_SIZE,:p_FILE_CONTENT,
        :p_CREATED_ON,:p_CREATED_BY,:p_MODIFIED_BY,:p_MODIFIED_ON,:p_error_code); END;`,
        params : [
          P_LOCATION_CODE     =  req.location_code ? req.location_code : null,
          p_FILE_NAME         =  req.name[i] ? req.name[i] : null,
          p_FILE_SIZE         =  req.size_data[i] ? req.size_data[i] : 0,
          p_FILE_CONTENT      =  req.Blob[i].buffer ? req.Blob[i].buffer : null,
          p_CREATED_ON        =  req.created_on ? req.created_on : null,
          p_CREATED_BY        =  req.created_by ? req.created_by : 0,
          p_MODIFIED_BY       =  req.modified_by ? req.modified_by : 0,
          p_MODIFIED_ON       =  req.modified_on ? req.modified_on : null,
          p_error_code        =  0
        ],
        options: {
          autoCommit: true,
          bindDefs: [
            { type: oracledb.STRING },
            { type: oracledb.STRING },
            { type: oracledb.NUMBER },
            { type: oracledb.BLOB },
            { type: oracledb.DATE },
            { type: oracledb.NUMBER },
            { type: oracledb.NUMBER },
            { type: oracledb.DATE },
            { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
          ]
        }
      };
  database.insertStoreProcedureExecute(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      if(req.name.length == length){
        return res(null,result);
        //Notification_save(req,res);
      }
      length++;
     
    } 
  });
    }
}

async function Filelist(req, res) {
  let params = {  
    query : `BEGIN WEB_GET_UNIT_FILE_LIST(:p_location_code,:result_set); END;`,
    params : {
      p_location_code : req.body.location_code ? req.body.location_code :null,
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
  list,
  saveunitfile,
  Filelist
};
