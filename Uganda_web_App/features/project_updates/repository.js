
const oracledb = require('oracledb');
const database = require('../../db/index');
var moment = require('moment');

async function list(req, res) {
  let params = {  
    query : `BEGIN MOB_PROJECT_UP_BUILDNG_LIST(:p_user_info_id,:result_set); END;`,
        params : {
          p_user_info_id : req.user.USER_INFO_ID ? req.user.USER_INFO_ID : 0,
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
        } 
  };
  database.GetDataStoreProcedure(params, async function(err,result){ 
    if(err){
      return res(err,null);
    } else {   
      req.UNIT_MAPPING_LIST = result;
      Getunitmaster(req,res)
    } 
  });
}
async function Getunitmaster(req, res) {
    let params = {  
      query : `BEGIN MOB_GET_UNIT_MASTER(:result_set); END;`,
      params : {
          result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
      } 
  };
  database.GetDataStoreProcedure(params,function(err,result){ 
    if(err){
      return res(err,null);
    } else {  
      var obj = [];
      obj.push(req.UNIT_MAPPING_LIST);
      obj.push(result);
      return res(null,obj);
    } 
  });
}


async function buildingwiselist(req, res) {
  let params = {  
    query : `BEGIN MOB_PROJECT_UP_BUILDNG_TO_DATE(:p_building_name,:result_set); END;`,
    params : {
        p_building_name : req.body.building_name ? req.body.building_name : null,
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


async function datewiselist(req, res) {
  let params = {  
    query : `BEGIN MOB_PROJECT_UP_DATE_TO_LIST(:p_created_on,:p_building_name,:result_set); END;`,
    params : {
        p_created_on :  moment(req.body.CREATED_ON_DATE).format("DD-MMM-YYYY") ? moment(req.body.CREATED_ON_DATE).format("DD-MMM-YYYY") : null,
        p_building_name : req.body.BUILDING_NAME ? req.body.BUILDING_NAME : null,
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

async function saveProject(req, res) {
  let length = 1;
    for(var i=0;i<req.name.length;i++){
      var parameters = {  query : `BEGIN MOB_PROJECT_UP_FILES_INSERT(:P_BUILDING_NAME,:P_BUILDING_CODE,:p_FILE_NAME,:p_FILE_SIZE,:p_FILE_CONTENT,
        :p_CREATED_ON,:p_CREATED_BY,:p_MODIFIED_BY,:p_MODIFIED_ON,:p_error_code); END;`,
        params : [
          P_BUILDING_NAME      =  req.unitlist[0].BUILDING_NAME ? req.unitlist[0].BUILDING_NAME : null,
          P_BUILDING_CODE      =  req.unitlist[0].BUILDING_CODE ? req.unitlist[0].BUILDING_CODE : null,
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
        //return res(null,result);
        Notification_save(req,res);
      }
      length++;
     
    } 
  });
    }
}


async function Notification_save(req, res) {
  var parameters = {  query : `BEGIN WEB_NOTIFICATION_INSERT(:p_refer_id,:p_building_code,:p_messgae,:p_type,:p_building_name,:p_created_by,
    :p_modified_by,:p_user_info_id); END;`,
    params : [
      p_refer_id            = 0,
      p_building_code       = req.unitlist[0].BUILDING_CODE ? req.unitlist[0].BUILDING_CODE : null,
      p_messgae             =`${req.name.length} files are inserted in ${req.unitlist[0].BUILDING_NAME}`,
      p_type                = 'PROJECT UPDATES',
      p_building_name       =  req.unitlist[0].BUILDING_NAME ? req.unitlist[0].BUILDING_NAME : null,
      p_created_by          =  req.created_by ? req.created_by : 0,
      p_modified_by         =  req.modified_by ? req.modified_by : 0,
      p_user_info_id        = 0
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
  buildingwiselist,
  saveProject,
  datewiselist
};
