const oracledb = require('oracledb');
const database = require('../../db/index');

async function Announcementlist(req, res) {
    let params = {  
      query : `BEGIN WEB_ANNOUNCEMENT_COMMENT_LIST(:p_user_id,:result_set); END;`,
          params : {
            p_user_id : req.user.USER_INFO_ID ? req.user.USER_INFO_ID : 0,
            result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
          } 
    };
    database.GetDataStoreProcedure(params, async function(err,result){ 
      if(err){
        return res(err,null);
      } else {   
        req.Announcementlist = result;
        getallbuildings(req,res);
      } 
    });
  }
  
  async function getallbuildings(req, res) {
    let params = {  
      query : `BEGIN WEB_GET_ALL_BUILDINGS(:p_user_info_id,:result_set); END;`,
          params : {
            p_user_info_id : req.user.USER_INFO_ID ? req.user.USER_INFO_ID : 0,
            result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
          } 
    };
    database.GetDataStoreProcedure(params, async function(err,result){ 
      if(err){
        return res(err,null);
      } else {   
        var obj = [];
        obj.push(req.Announcementlist);
        obj.push(result);
        return res(null,obj);
      } 
    });
  }

  function createannouncement(req,res){
    var parameters = {};
    parameters.params = { 
      P_COMMENTS     : req.announcement_text ? req.announcement_text : null,
      p_CREATED_ON   : req.created_on ? req.created_on :null,
      p_CREATED_BY   : req.created_by ? req.created_by :null,
      p_MODIFIED_BY  : req.modified_by ? req.modified_by :null,
      p_MODIFIED_ON  : req.modified_on ? req.modified_on :null,
      p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
    };
    parameters.query = `BEGIN WEB_ANNOUNCEMENT_INSERT(:P_COMMENTS,:p_CREATED_ON,:p_CREATED_BY,:p_MODIFIED_BY,
      :p_MODIFIED_ON,:p_error_code); END;` ;
    
   database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
      if(err){
        return res(err,null);
      } else {
        req.announcement_id = result.p_error_code;
        announcement_building_insert(req,res);
      }
    });
}

function announcement_building_insert(req,res){
  let length = 1;
  for(var i=0;i<req.building.length;i++){
    var parameters = {  query : `BEGIN WEB_ANNOUNCEMENT_BUILDING_INS(:P_ANNOUNCEMENT_ID,:P_BUILDING_NAME,:P_BUILDING_CODE,
      :p_CREATED_BY,:p_MODIFIED_BY,:p_CREATED_ON,:p_MODIFIED_ON,:p_error_code); END;`,
      params : [
        P_ANNOUNCEMENT_ID   = req.announcement_id ? req.announcement_id : 0,
        P_BUILDING_NAME     =  req.building[i].BUILDING_NAME ? req.building[i].BUILDING_NAME : null,
        P_BUILDING_CODE     =  req.building[i].BUILDING_CODE ? req.building[i].BUILDING_CODE : null,
        p_CREATED_BY        =  req.created_by ? req.created_by : 0,
        p_MODIFIED_BY       =  req.modified_by ? req.modified_by : 0,
        p_CREATED_ON        =  req.created_on ? req.created_on : null,
        p_MODIFIED_ON       =  req.modified_on ? req.modified_on : null,
        p_error_code        =  0
      ],
      options: {
        autoCommit: true,
        bindDefs: [
          { type: oracledb.NUMBER },
          { type: oracledb.STRING },
          { type: oracledb.STRING },
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.DATE },
          { type: oracledb.DATE },
          { type: oracledb.DB_TYPE_NUMBER, dir : oracledb.BIND_OUT }
        ]
      }
    };
database.insertStoreProcedureExecute(parameters,function(err,result){
  if(err){
    return res(err,null);
  } else {
    if(req.building.length == length){
      Announcementfile_insert(req,res);
    }
    length++;
  } 
});
  }
}

function Announcementfile_insert(req,res){
  let length = 1;
  for(var i=0;i<req.name.length;i++){
    var parameters = {  query : `BEGIN WEB_ANNOUNCEMENT_FILE_INSERT(:P_ANNOUNCEMENT_ID,:p_FILE_NAME,:p_FILE_SIZE,:p_FILE_CONTENT,
      :p_CREATED_BY,:p_MODIFIED_BY,:p_CREATED_ON,:p_MODIFIED_ON,:p_error_code); END;`,
      params : [
        P_ANNOUNCEMENT_ID   = req.announcement_id ? req.announcement_id : 0,
        p_FILE_NAME         =  req.name[i] ? req.name[i] : null,
        p_FILE_SIZE         =  req.size_data[i] ? req.size_data[i] : 0,
        p_FILE_CONTENT      =  req.Blob[i].buffer ? req.Blob[i].buffer : null,
        p_CREATED_BY        =  req.created_by ? req.created_by : 0,
        p_MODIFIED_BY       =  req.modified_by ? req.modified_by : 0,
        p_CREATED_ON        =  req.created_on ? req.created_on : null,
        p_MODIFIED_ON       =  req.modified_on ? req.modified_on : null,
        p_error_code        =  0
      ],
      options: {
        autoCommit: true,
        bindDefs: [
          { type: oracledb.NUMBER },
          { type: oracledb.STRING },
          { type: oracledb.NUMBER },
          { type: oracledb.BLOB },
          { type: oracledb.NUMBER },
          { type: oracledb.NUMBER },
          { type: oracledb.DATE },
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
  let length = 1;
  for(var i=0;i<req.building.length;i++){
    var notes = `Message:${req.announcement_text}   ${req.name.length} files are inserted in ${req.building[i].BUILDING_NAME}`;
  var parameters = {  query : `BEGIN WEB_NOTIFICATION_INSERT(:p_refer_id,:p_building_code,:p_messgae,:p_type,:p_building_name,:p_created_by,
    :p_modified_by,:p_user_info_id); END;`,
    params : [
      p_refer_id            = req.announcement_id ? req.announcement_id : null,
      p_building_code       = null,
      p_messgae             = notes,
      p_type                = 'ANNOUNCEMENT',
      p_building_name       =  req.building[i].BUILDING_NAME ? req.building[i].BUILDING_NAME : null,
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
      if(req.building.length == length){
        return res(null,result);
      }
      length++;
    } 
  });
    }
}

async function Announcementfilelist(req, res) {
  let params = {  
    query : `BEGIN WEB_ANNOUNCEMENT_LIST(:p_announcement_id,:result_set); END;`,
        params : {
          p_announcement_id : req.body.ANNOUNCEMENT_ID ? req.body.ANNOUNCEMENT_ID : null,
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
  
  module.exports = {
    Announcementlist,
    createannouncement,
    Announcementfilelist
  };