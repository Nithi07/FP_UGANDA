
const oracledb = require('oracledb');
const database = require('../../db/index');


async function list_note(req, res) {
 
  let params = {  
    query : `BEGIN WEB_UNIT_NOTE_LIST(:result_set); END;`,
    params : {
        //p_user_id:   req.user.USER_INFO_ID ? req.user.USER_INFO_ID : 0, 
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


async function note_category(req, res) {
  let params = {  
    query : `BEGIN WEB_NOTE_CATEGORY_LIST(:result_set); END;`,
    params : {
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



async function getAllBuildings(req, res) {
  let params = {  
    query : `BEGIN WEB_NOTE_BUILDING_LIST(:result_set); END;`,
    params : {
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





async function getAllUnitLIst(req, res) {
  let params = {  
    query : `BEGIN WEB_NOTE_UNIT_LIST(:result_set); END;`,
    params : {
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



async function getAllUserList(req, res) {
  let params = {  
    query : `BEGIN WEB_NOTE_USERS_LIST(:result_set); END;`,
    params : {
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

async function savenotefile(req, res) {

   
  let length = 1;
    for(var i=0;i<req.name.length;i++){
      var parameters = {  query : `BEGIN WEB_NOTE_FILES_INSERT(:P_LOCATION_CODE,:P_UNIT_CODE,:p_FILE_NAME,:p_FILE_SIZE,:p_FILE_CONTENT,
        :p_CREATED_ON,:p_CREATED_BY,:p_MODIFIED_BY,:p_MODIFIED_ON,:p_error_code); END;`,
        params : [
          P_LOCATION_CODE     =  req.location_code ? req.location_code : null,
          P_UNIT_CODE         =  req.unit_id ? req.unit_id : null,
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
            { type: oracledb.NUMBER },
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


async function note_file(req, res) {



  let params = {  
    query : `BEGIN MOB_GET_NOTE_FILE(:p_user_info_id,:p_unit_id,:result_set); END;`,
    params : {
        p_user_info_id : req.body.user_id ? req.body.user_id : 0,
        p_unit_id : req.body.unit_id ? req.body.unit_id : null,
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

async function note_commentlist(req, res) {
  console.log("calling db....");
  let params = {  
    query : `BEGIN WEB_NOTE_COMMENT_LISTING(:p_unit_id,:result_set); END;`,
    params : {
        p_unit_id : req.body.unit_id ? req.body.unit_id : null,
        result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
    } 
};
database.GetDataStoreProcedure(params,function(err,result){ 
  if(err){
    return res(err,null);
  } else {
    console.log("record found");
    return res(null,result);
  } 
});
}


async function note_Reportcommentlist(req, res) {
  console.log("calling db...." +req.query.fdate );
 
  let params = {  
    query : `BEGIN WEB_NOTE_RPT_COMMENT_LISTING(:p_unit_id,:p_fdate,:p_tdate,:p_categoryid,:p_userid,:p_buildingid,:result_set); END;`,
    params : {
      p_unit_id : req.query.unitid ? req.query.unitid : null,
      p_fdate : req.query.fdate ? req.query.fdate : null,
      p_tdate: req.query.tdate ? req.query.tdate : null,
      p_categoryid : req.query.categoryid ? req.query.categoryid : null,
      p_userid : req.query.userid ? req.query.userid : null,
      p_buildingid : req.query.buildingid ? req.query.buildingid : null,
      result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
    } 
};
database.GetDataStoreProcedure(params,function(err,result){ 
  if(err){
    return res(err,null);
  } else {
    console.log("record found");
    return res(null,result);
  } 
});
}



function getInsertNewComment(req, res) {

 

  var parameters = {};
  parameters.params = { 
    p_comments      : req.comments ? req.comments : 0,
    P_category_id  : req.category_id ? req.category_id : null,
    P_ref_id  : req.unit_id ? req.unit_id : null,
    p_is_active    : 1,
    p_created_on   : req.created_on ? req.created_on : null,
    p_modified_on  : req.created_on ? req.created_on : null,
    p_created_by   : req.created_by ? req.created_by : 0,
    p_modified_by  : req.created_by ? req.created_by : 0,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN USP_NOTE_COMMENT_INSERT(:p_comments,:p_category_id,:P_ref_id,:p_is_active,:p_created_on,
    :p_modified_on,:p_created_by,:p_modified_by,:p_error_code); END;` ;
  
 database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.Comment_id = result.p_error_code;
      return res(null,result);
    }
});
}
function getupdReminder(req, res) {

  console.log("reminder id ===========rmdate======== "+ req.rmdate);
 
  var parameters = {};
  parameters.params = { 
  
    p_NOTE_COMMENT_ID  : req.comment_id ? req.comment_id : null,
          P_rmdate  : req.rmdate ? req.rmdate : null,
    p_modified_on  : req.modified_on ? req.modified_on : null,
    p_modified_by  : req.modified_by ? req.modified_by : 0,
    p_error_code   : { type: oracledb.NUMBER, dir : oracledb.BIND_INOUT}
  };
  parameters.query = `BEGIN USP_NOTE_RMNDER_UPD( :p_NOTE_COMMENT_ID,:P_rmdate, :p_modified_on,:p_modified_by,:p_error_code); END;` ;
  database.InsertDataWithGetInsertIdStoreProcedure(parameters,function(err,result){
    if(err){
      return res(err,null);
    } else {
      req.Comment_id = result.p_error_code;
      return res(null,result);
    }
});
}



async function ReminderById(req, res) {
  console.log("get reminder by id ...inside repository");
  console.log("calling db...." +req.ref_id );
 
  let params = {  
    query : `BEGIN USP_GET_SCHEDULED_EMAILBYID(:p_ref_id,:result_set); END;`,
    params : {
      p_ref_id : req.ref_id ? req.ref_id : null,
      result_set:  { type: oracledb.CURSOR, dir : oracledb.BIND_OUT }
    } 
};
database.GetDataStoreProcedure(params,function(err,result){ 
  if(err){
    return res(err,null);
  } else {
    console.log("record found");
    return res(null,result);
  } 
});
}


 

module.exports = {
  list_note,
  note_file,
  getInsertNewComment,
  getupdReminder,
  savenotefile,
  note_category,
  getAllBuildings,
  getAllUnitLIst,
  getAllUserList,
  note_Reportcommentlist,
  note_commentlist,
  ReminderById
};
